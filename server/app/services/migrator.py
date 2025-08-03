import mysql.connector
import psycopg2
import pymongo
import decimal
import datetime


def convert_for_mongo(val):
    if isinstance(val, decimal.Decimal):
        return float(val)
    if isinstance(val, datetime.date):
        return val.isoformat()
    return val

class Migrator:
    def __init__(self, mysql_credentials, target_db, target_credentials):
        self.mysql_credentials = mysql_credentials
        self.target_db = target_db.lower()
        self.target_credentials = target_credentials

    def migrate(self):
        if self.target_db == 'postgresql':
            return self.migrate_to_postgresql()
        elif self.target_db == 'mongodb':
            return self.migrate_to_mongodb()
        else:
            return {"status": "error", "details": f"Unsupported target DB: {self.target_db}"}

    def _mysql_connect(self):
        creds = self.mysql_credentials
        return mysql.connector.connect(
            host=creds['host'],
            port=creds['port'],
            database=creds['database'],
            user=creds['user'],
            password=creds['password']
        )

    def migrate_to_postgresql(self):
        try:
            myconn = self._mysql_connect()
            mycursor = myconn.cursor()
            pg = self.target_credentials
            pgconn = psycopg2.connect(
                host=pg['host'],
                port=pg['port'],
                dbname=pg['database'],
                user=pg['user'],
                password=pg['password']
            )
            pgcursor = pgconn.cursor()
            mycursor.execute("SHOW TABLES")
            tables = [row[0] for row in mycursor.fetchall()]
            for table in tables:
                mycursor.execute(f"DESCRIBE `{table}`")
                columns = mycursor.fetchall()
                col_defs = []
                col_names = []
                for col, typ, *_ in columns:
                    col_names.append(col)
                    if 'int' in typ:
                        pg_type = 'INTEGER'
                    elif 'char' in typ or 'text' in typ:
                        pg_type = 'TEXT'
                    elif 'date' in typ or 'time' in typ:
                        pg_type = 'TIMESTAMP'
                    elif 'float' in typ or 'double' in typ or 'decimal' in typ:
                        pg_type = 'NUMERIC'
                    else:
                        pg_type = 'TEXT'
                    col_defs.append(f'"{col}" {pg_type}')
                col_defs_str = ', '.join(col_defs)
                col_names_str = ', '.join(col_names)
                pgcursor.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE')
                pgcursor.execute(f'CREATE TABLE "{table}" ({col_defs_str})')
                mycursor.execute(f'SELECT {col_names_str} FROM `{table}`')
                rows = mycursor.fetchall()
                for row in rows:
                    placeholders = ','.join(['%s'] * len(row))
                    pgcursor.execute(
                        f'INSERT INTO "{table}" ({col_names_str}) VALUES ({placeholders})',
                        row
                    )
            pgconn.commit()
            pgcursor.close()
            pgconn.close()
            mycursor.close()
            myconn.close()
            return {"status": "success", "details": f"Migrated {len(tables)} tables to PostgreSQL."}
        except psycopg2.Error as e:
            error_msg = f"PostgreSQL error: {e}"
            if "connection" in str(e).lower():
                error_msg = f"PostgreSQL connection failed - check host, port, and credentials"
            elif "authentication" in str(e).lower():
                error_msg = "PostgreSQL authentication failed - check username and password"
            elif "database" in str(e).lower():
                error_msg = f"PostgreSQL database '{pg['database']}' does not exist or access denied"
            return {"status": "error", "details": error_msg}
        except mysql.connector.Error as e:
            error_msg = f"MySQL error during migration: {e}"
            if e.errno == 2003:
                error_msg = f"MySQL server not accessible at {self.mysql_credentials['host']}:{self.mysql_credentials['port']}"
            elif e.errno == 1045:
                error_msg = "MySQL authentication failed - check username and password"
            return {"status": "error", "details": error_msg}
        except Exception as e:
            return {"status": "error", "details": f"Unexpected error during PostgreSQL migration: {str(e)}"}

    def migrate_to_mongodb(self):
        try:
            myconn = self._mysql_connect()
            mycursor = myconn.cursor()
            mg = self.target_credentials
            client = pymongo.MongoClient(mg['uri'])
            db = client[mg['database']]
            mycursor.execute("SHOW TABLES")
            tables = [row[0] for row in mycursor.fetchall()]
            for table in tables:
                mycursor.execute(f"DESCRIBE `{table}`")
                columns = mycursor.fetchall()
                col_names = [col[0] for col in columns]
                col_names_str = ', '.join(col_names)
                mycursor.execute(f'SELECT {col_names_str} FROM `{table}`')
                rows = mycursor.fetchall()
                docs = []
                for row in rows:
                    doc = {col: convert_for_mongo(val) for col, val in zip(col_names, row)}
                    docs.append(doc)
                if docs:
                    safe_table = table.replace('$', '_')
                    db[safe_table].drop()
                    db[safe_table].insert_many(docs)
            mycursor.close()
            myconn.close()
            client.close()
            return {"status": "success", "details": f"Migrated {len(tables)} tables to MongoDB."}
        except pymongo.errors.ConnectionFailure as e:
            error_msg = f"MongoDB connection failed - check URI and network connectivity"
            return {"status": "error", "details": error_msg}
        except pymongo.errors.ServerSelectionTimeoutError as e:
            error_msg = f"MongoDB server not accessible - check host and port"
            return {"status": "error", "details": error_msg}
        except pymongo.errors.OperationFailure as e:
            error_msg = f"MongoDB operation failed: {e}"
            return {"status": "error", "details": error_msg}
        except mysql.connector.Error as e:
            error_msg = f"MySQL error during migration: {e}"
            if e.errno == 2003:
                error_msg = f"MySQL server not accessible at {self.mysql_credentials['host']}:{self.mysql_credentials['port']}"
            elif e.errno == 1045:
                error_msg = "MySQL authentication failed - check username and password"
            return {"status": "error", "details": error_msg}
        except Exception as e:
            return {"status": "error", "details": f"Unexpected error during MongoDB migration: {str(e)}"} 
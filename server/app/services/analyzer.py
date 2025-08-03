import mysql.connector
import decimal
import datetime

def convert_for_mongo(val):
    if isinstance(val, decimal.Decimal):
        return float(val)
    if isinstance(val, datetime.date):
        return val.isoformat()  # or use datetime.datetime(val.year, val.month, val.day)
    return val

class Analyzer:
    def __init__(self, mysql_credentials):
        self.mysql_credentials = mysql_credentials

    def analyze(self):
        creds = self.mysql_credentials
        try:
            conn = mysql.connector.connect(
                host=creds['mysql_host'],
                port=creds['mysql_port'],
                database=creds['mysql_database'],
                user=creds['mysql_user'],
                password=creds['mysql_password']
            )
            cursor = conn.cursor()
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]
            table_info = []
            for table in tables:
                cursor.execute(f"DESCRIBE `{table}`")
                columns = cursor.fetchall()
                col_info = []
                primary_keys = []
                for col, typ, null, key, *_ in columns:
                    col_info.append({
                        "name": col,
                        "type": typ,
                        "nullable": null == 'YES',
                        "primary_key": key == 'PRI'
                    })
                    if key == 'PRI':
                        primary_keys.append(col)
                table_info.append({
                    "name": table,
                    "columns": col_info,
                    "primary_keys": primary_keys
                })
            # Foreign keys
            relationships = []
            for table in tables:
                cursor.execute(f"SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '{creds['mysql_database']}' AND TABLE_NAME = '{table}' AND REFERENCED_TABLE_NAME IS NOT NULL")
                for col, ref_table, ref_col in cursor.fetchall():
                    relationships.append({
                        "table": table,
                        "column": col,
                        "ref_table": ref_table,
                        "ref_column": ref_col
                    })
            cursor.close()
            conn.close()
            return {"tables": table_info, "relationships": relationships}
        except mysql.connector.Error as e:
            error_msg = f"MySQL connection error: {e}"
            if e.errno == 2003:
                error_msg = f"MySQL server not accessible at {creds['mysql_host']}:{creds['mysql_port']}"
            elif e.errno == 1045:
                error_msg = "MySQL authentication failed - check username and password"
            elif e.errno == 1049:
                error_msg = f"Database '{creds['mysql_database']}' does not exist"
            return {"tables": [], "relationships": [], "error": error_msg}
        except Exception as e:
            return {"tables": [], "relationships": [], "error": f"Unexpected error during analysis: {str(e)}"} 
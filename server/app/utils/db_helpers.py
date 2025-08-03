def connect_mysql(credentials):
    import mysql.connector
    return mysql.connector.connect(
        host=credentials['host'],
        port=credentials['port'],
        database=credentials['database'],
        user=credentials['user'],
        password=credentials['password']
    )

def connect_mongodb(credentials):
    import pymongo
    return pymongo.MongoClient(credentials['uri']) 
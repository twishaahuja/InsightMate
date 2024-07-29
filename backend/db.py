
import mysql.connector
from config import Config

def get_db_connection():
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='twisha',
        database='chatbot_db'
    )
    if conn.is_connected():
        print("connnnnnnnnn")
    if conn:
        print("Connected")
    else:
        print('Could not connect: ' . mysql_error())
    return conn
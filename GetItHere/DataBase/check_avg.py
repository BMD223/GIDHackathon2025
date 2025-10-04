import sqlite3

con = sqlite3.connect("app.db")
con.execute("PRAGMA foreign_keys = ON")
cur = con.cursor()
print(cur.execute("SELECT * FROM historicalData").fetchall())
cur.close()
con.close()
import sqlite3

con = sqlite3.connect("app.db")
con.execute("PRAGMA foreign_keys = ON")
cur = con.cursor()

with open("dbstruct.sql", "r", encoding="utf-8") as f:
    cur.executescript(f.read())

# quick sanity check
cur.execute("INSERT OR IGNORE INTO routes(routeId, lineNumber) VALUES (?, ?)", (1, "194"))
con.commit()

print(cur.execute("SELECT * FROM routes").fetchall())

cur.close()
con.close()

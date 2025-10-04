import sqlite3

con = sqlite3.connect("app.db")
con.execute("PRAGMA foreign_keys = ON")
cur = con.cursor()

with open("dbstruct.sql", "r", encoding="utf-8") as f:
    cur.executescript(f.read())

with open("../../Routes_and_stops/KRK_A/stops.txt", "r", encoding="utf-8") as f:
    next(f)  # Skip header
    for line in f:
        fields = line.strip().split(",")
        stopId = str(fields[0])
        name = str(fields[2][1:-1])  # Remove quotes
        stopLat = float(fields[4])
        stopLon = float(fields[5])
        cur.execute(
            "INSERT INTO stops(stopId, name, lat, lon) VALUES (?, ?, ?, ?)",
            (stopId, name, stopLat, stopLon)
        )

with open("../../Routes_and_stops/KRK_A/routes.txt", "r", encoding="utf-8") as f:
    next(f)  # Skip header
    for line in f:
        fields = line.strip().split(",")
        routeId = str(fields[0])
        lineNumber = int(fields[2][1:-1])  # Remove quotes
        vehicleType = str("A")
        cur.execute(
            "INSERT INTO routes(routeId, lineNumber, vehicleType) VALUES (?, ?, ?)",
            (routeId, lineNumber, vehicleType)
        )

directions = {}
with open("../../Routes_and_stops/KRK_A/trips.txt", "r", encoding="utf-8") as f:
    next(f)  # Skip header
    for line in f:
        fields = line.strip().split(",")
        routeId = str(fields[1])
        endStop = str(fields[3])
        if routeId not in directions:
            directions[routeId] = [endStop, None]
        elif directions[routeId][0] != endStop:
            directions[routeId][1] = endStop
with open("../../Routes_and_stops/KRK_A/trips.txt", "r", encoding="utf-8") as f:
    next(f)  # Skip header
    for line in f:
        fields = line.strip().split(",")
        tripId = str(fields[0])
        routeId = str(fields[1])
        endStop = str(fields[3])
        startStop = directions[routeId][0] if directions[routeId][0] != endStop else directions[routeId][1]
        cur.execute(
            "INSERT INTO trips(tripId, routeId, startStop, endStop) VALUES (?, ?, ?, ?)",
            (tripId, routeId, startStop, endStop)
        )

with open("../../Routes_and_stops/KRK_A/stop_times.txt", "r", encoding="utf-8") as f:
    next(f)  # Skip header
    for line in f:
        fields = line.strip().split(",")
        tripId = str(fields[0])
        stopId = str(fields[3])
        expectedTime = str(fields[1])
        cur.execute(
            "INSERT INTO stopTimes(tripId, stopId, expectedTime) VALUES (?, ?, ?)",
            (tripId, stopId, expectedTime)
        )


con.commit()

print(cur.execute("SELECT * FROM stops").fetchall())
print(cur.execute("SELECT * FROM routes").fetchall())
print(cur.execute("SELECT * FROM trips").fetchall())
print(cur.execute("SELECT * FROM stopTimes").fetchall())

cur.close()
con.close()

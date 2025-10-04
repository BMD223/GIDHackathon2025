PRAGMA foreign_keys = OFF;
DROP TABLE IF EXISTS stopTimes;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS routes;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stops (
  stopId   TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  lat      REAL,
  lon      REAL
);

CREATE TABLE IF NOT EXISTS routes (
  routeId     TEXT PRIMARY KEY,
  lineNumber  INTEGER NOT NULL,
  vehicleType TEXT NOT NULL  -- e.g., 'A', 'T'
);

CREATE TABLE IF NOT EXISTS trips (
  tripId       TEXT PRIMARY KEY,
  routeId      TEXT NOT NULL,
  startStop    TEXT,
  endStop      TEXT NOT NULL,
  FOREIGN KEY (routeId)   REFERENCES routes(routeId)
);

CREATE TABLE IF NOT EXISTS stopTimes (
  stopTimeId    INTEGER PRIMARY KEY,
  stopId        TEXT NOT NULL,
  expectedTime  TEXT NOT NULL,   -- e.g., '2025-10-04T07:35:00' or '07:35:00'
  tripId        TEXT NOT NULL,
  FOREIGN KEY (stopId) REFERENCES stops(stopId),
  FOREIGN KEY (tripId) REFERENCES trips(tripId)
);

CREATE INDEX IF NOT EXISTS idx_trip_route       ON trips(routeId);
CREATE INDEX IF NOT EXISTS idx_stoptime_trip    ON stopTimes(tripId, expectedTime);

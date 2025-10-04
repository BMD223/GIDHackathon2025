PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stops (
  stopId   INTEGER PRIMARY KEY,
  name     TEXT NOT NULL,
  lat      REAL,
  lon      REAL
);

CREATE TABLE IF NOT EXISTS routes (
  routeId     INTEGER PRIMARY KEY,
  lineNumber  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS directions (
  directionId  INTEGER PRIMARY KEY,
  startStop    INTEGER NOT NULL,
  endStop      INTEGER NOT NULL,
  FOREIGN KEY (startStop) REFERENCES stops(stopId),
  FOREIGN KEY (endStop)   REFERENCES stops(stopId)
);

CREATE TABLE IF NOT EXISTS trips (
  tripId       INTEGER PRIMARY KEY,
  routeId      INTEGER NOT NULL,
  directionId  INTEGER NOT NULL,
  FOREIGN KEY (routeId)     REFERENCES routes(routeId),
  FOREIGN KEY (directionId) REFERENCES directions(directionId)
);

CREATE TABLE IF NOT EXISTS stopTimes (
  stopTimeId    INTEGER PRIMARY KEY,
  stopId        INTEGER NOT NULL,
  expectedTime  TEXT NOT NULL,   -- e.g., '2025-10-04T07:35:00' or '07:35:00'
  tripId        INTEGER NOT NULL,
  FOREIGN KEY (stopId) REFERENCES stops(stopId),
  FOREIGN KEY (tripId) REFERENCES trips(tripId)
);

CREATE INDEX IF NOT EXISTS idx_trip_route       ON trips(routeId);
CREATE INDEX IF NOT EXISTS idx_trip_direction   ON trips(directionId);
CREATE INDEX IF NOT EXISTS idx_stoptime_trip    ON stopTimes(tripId, expectedTime);
CREATE INDEX IF NOT EXISTS idx_direction_starts ON directions(startStop);
CREATE INDEX IF NOT EXISTS idx_direction_ends   ON directions(endStop);

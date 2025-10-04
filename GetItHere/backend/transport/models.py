from django.db import models


class Stop(models.Model):
    stopId = models.CharField(max_length=100, primary_key=True, db_column='stopId')
    name = models.CharField(max_length=255)
    lat = models.FloatField()
    lon = models.FloatField()

    class Meta:
        db_table = 'stops'

    def __str__(self):
        return f"{self.name} ({self.stopId})"


class Route(models.Model):
    routeId = models.CharField(max_length=100, primary_key=True, db_column='routeId')
    lineNumber = models.IntegerField(db_column='lineNumber')
    vehicleType = models.CharField(max_length=10, db_column='vehicleType')

    class Meta:
        db_table = 'routes'

    def __str__(self):
        return f"Line {self.lineNumber} ({self.vehicleType})"


class Trip(models.Model):
    tripId = models.CharField(max_length=100, primary_key=True, db_column='tripId')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, db_column='routeId', related_name='trips')
    startStop = models.CharField(max_length=255, db_column='startStop')
    endStop = models.CharField(max_length=255, db_column='endStop')

    class Meta:
        db_table = 'trips'

    def __str__(self):
        return f"{self.tripId}: {self.startStop} → {self.endStop}"


class StopTime(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, db_column='tripId', related_name='stop_times')
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, db_column='stopId', related_name='stop_times')
    expectedTime = models.CharField(max_length=20, db_column='expectedTime')

    class Meta:
        db_table = 'stopTimes'
        unique_together = [['trip', 'stop', 'expectedTime']]

    def __str__(self):
        return f"{self.trip_id} at {self.stop_id}: {self.expectedTime}"

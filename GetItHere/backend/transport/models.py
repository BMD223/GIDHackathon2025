from django.db import models


class Stop(models.Model):
    stopId = models.CharField(max_length=100, primary_key=True, db_column='stopId')
    name = models.CharField(max_length=255)
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'stops'

    def __str__(self):
        return f"{self.name} ({self.stopId})"


class Route(models.Model):
    routeId = models.CharField(max_length=100, primary_key=True, db_column='routeId')
    lineNumber = models.IntegerField(db_column='lineNumber')
    startStop = models.CharField(max_length=255, null=True, blank=True, db_column='startStop')
    endStop = models.CharField(max_length=255, null=True, blank=True, db_column='endStop')

    class Meta:
        db_table = 'routes'
        ordering = ['lineNumber', 'routeId']

    def __str__(self):
        return f"Line {self.lineNumber}"


class Trip(models.Model):
    tripId = models.CharField(max_length=100, primary_key=True, db_column='tripId')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, db_column='routeId', related_name='trips')
    endStop = models.CharField(max_length=255, db_column='endStop')

    class Meta:
        db_table = 'trips'

    def __str__(self):
        return f"{self.tripId} ({self.route_id} → {self.endStop})"


class StopTime(models.Model):
    id = models.BigAutoField(primary_key=True, db_column='stopTimeId')
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, db_column='stopId', related_name='stop_times')
    expectedTime = models.CharField(max_length=32, db_column='expectedTime')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, db_column='tripId', related_name='stop_times')

    class Meta:
        db_table = 'stopTimes'

    def __str__(self):
        return f"{self.trip_id} at {self.stop_id}: {self.expectedTime}"


class HistoricalData(models.Model):
    id = models.BigAutoField(primary_key=True, db_column='historicalDataId')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, db_column='routeId', related_name='historical_data')
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, db_column='stopId', related_name='historical_data')
    direction = models.IntegerField(db_column='direction')
    averageDelay = models.IntegerField(null=True, blank=True, db_column='averageDelay')
    timePeriod = models.TimeField(null=True, blank=True, db_column='timePeriod')

    class Meta:
        db_table = 'historicalData'

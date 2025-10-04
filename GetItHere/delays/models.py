from django.db import models

class Deal(models.Model):
    routeId = models.CharField(max_length=50)
    stopId = models.CharField(max_length=50)
    expectedTime = models.DateTimeField()
    actualTime = models.DateTimeField()
    delay = models.IntegerField()  # zmienione na integer
    direction = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'delays'  # używamy istniejącej tabeli
        managed = False
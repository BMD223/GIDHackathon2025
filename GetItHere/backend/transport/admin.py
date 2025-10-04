from django.contrib import admin
from .models import Stop, Route, Trip, StopTime


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ['stopId', 'name', 'lat', 'lon']
    search_fields = ['stopId', 'name']


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['routeId', 'lineNumber,', 'vehicleType']
    search_fields = ['routeId', 'lineNumber']
    list_filter = ['vehicleType']


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['tripId', 'route', 'startStop', 'endStop']
    search_fields = ['tripId', 'startStop', 'endStop']
    raw_id_fields = ['route']


@admin.register(StopTime)
class StopTimeAdmin(admin.ModelAdmin):
    list_display = ['trip', 'stop', 'expectedTime']
    search_fields = ['trip__tripId', 'stop__name']
    raw_id_fields = ['trip', 'stop']

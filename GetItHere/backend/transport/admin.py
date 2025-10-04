from django.contrib import admin
from .models import Stop, Route, Trip, StopTime


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ['stopId', 'name', 'lat', 'lon']
    search_fields = ['stopId', 'name']


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['routeId', 'lineNumber', 'startStop', 'endStop']
    search_fields = ['routeId', 'lineNumber']
    # vehicleType does not exist on Route; remove invalid filter
    # If you later add a vehicle_type field, you can re-enable filtering:
    # list_filter = ['vehicle_type']
    list_filter = ['lineNumber']


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    # Trip doesn't have startStop/endStop fields; expose route's stops via methods
    list_display = ['tripId', 'route', 'route_start_stop', 'route_end_stop']
    search_fields = ['tripId', 'route__routeId', 'route__lineNumber']
    raw_id_fields = ['route']

    @admin.display(description='Start Stop', ordering='route__startStop')
    def route_start_stop(self, obj):
        return getattr(obj.route, 'startStop', None)

    @admin.display(description='End Stop', ordering='route__endStop')
    def route_end_stop(self, obj):
        return getattr(obj.route, 'endStop', None)


@admin.register(StopTime)
class StopTimeAdmin(admin.ModelAdmin):
    list_display = ['trip', 'stop', 'expectedTime']
    search_fields = ['trip__tripId', 'stop__name']
    raw_id_fields = ['trip', 'stop']

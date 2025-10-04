from rest_framework import serializers
from .models import Stop, Route, Trip, StopTime


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ['stopId', 'name', 'lat', 'lon']

class StopTimeSerializer(serializers.ModelSerializer):
    stop_info = StopSerializer(source='stop', read_only=True)

    class Meta:
        model = StopTime
        fields = ['id', 'trip', 'stop', 'stop_info', 'expectedTime']


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['routeId', 'lineNumber', 'startStop', 'endStop']


class TripSerializer(serializers.ModelSerializer):
    route_info = RouteSerializer(source='route', read_only=True)
    route_start_stop = serializers.CharField(source='route.startStop', read_only=True)
    route_end_stop = serializers.CharField(source='route.endStop', read_only=True)

    class Meta:
        model = Trip
        fields = ['tripId', 'route','endStop', 'route_info', 'route_start_stop', 'route_end_stop']


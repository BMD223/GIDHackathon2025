from rest_framework import serializers
from .models import Stop, Route, Trip, StopTime


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ['stopId', 'name', 'lat', 'lon']


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['routeId', 'lineNumber', 'vehicleType']


class TripSerializer(serializers.ModelSerializer):
    route_info = RouteSerializer(source='route', read_only=True)

    class Meta:
        model = Trip
        fields = ['tripId', 'route', 'route_info', 'startStop', 'endStop']


class StopTimeSerializer(serializers.ModelSerializer):
    stop_info = StopSerializer(source='stop', read_only=True)

    class Meta:
        model = StopTime
        fields = ['id', 'trip', 'stop', 'stop_info', 'expectedTime']
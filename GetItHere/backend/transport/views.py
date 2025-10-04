import json

from django.db.models import Avg
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Stop, Route, Trip, StopTime, Deal, HistoricalData
from .serializers import StopSerializer, RouteSerializer, TripSerializer, StopTimeSerializer, HistoricalDataSerializer


class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'stopId']


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['lineNumber', 'vehicleType']

    @action(detail=False, methods=['get'])
    def by_line(self, request):
        line_number = request.query_params.get('line_number')
        if not line_number:
            return Response({'error': 'line_number parameter required'}, status=400)
        qs = self.get_queryset().filter(lineNumber=line_number)
        return Response(self.get_serializer(qs, many=True).data)


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.select_related('route').all()
    serializer_class = TripSerializer

    @action(detail=False, methods=['get'])
    def by_route(self, request):
        route_id = request.query_params.get('route_id')
        if not route_id:
            return Response({'error': 'route_id parameter required'}, status=400)
        qs = self.get_queryset().filter(route_id=route_id)
        return Response(self.get_serializer(qs, many=True).data)


class StopTimeViewSet(viewsets.ModelViewSet):
    queryset = StopTime.objects.select_related('trip', 'stop').all()
    serializer_class = StopTimeSerializer

    @action(detail=False, methods=['get'])
    def by_stop(self, request):
        stop_id = request.query_params.get('stop_id')
        if not stop_id:
            return Response({'error': 'stop_id parameter required'}, status=400)
        qs = self.get_queryset().filter(stop_id=stop_id)
        return Response(self.get_serializer(qs, many=True).data)

@csrf_exempt  # tylko do testów; w produkcji użyj CSRF tokena!
def add_delay_record(request):
    if request.method == "POST":
        try:
            # Wczytaj dane JSON z frontendu
            data = json.loads(request.body)

            route_id = data.get("routeId")
            stop_id = data.get("stopId")
            expected_time = parse_datetime(data.get("expectedTime"))
            actual_time = parse_datetime(data.get("actualTime"))
            direction_value = data.get("direction")
            # Oblicz opóźnienie (w minutach)
            delay = (actual_time - expected_time).total_seconds() / 60.0

            # Utwórz nowy rekord
            Deal.objects.create(
                routeId=route_id,
                stopId=stop_id,
                expectedTime=expected_time,
                actualTime=actual_time,
                delay=int(delay),  # upewniamy się, że jest int
                direction=direction_value  # np. 0 lub 1
            )

            return JsonResponse({"status": "success", "delay": delay})

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)



class HistoricalDataViewSet(viewsets.ModelViewSet):
    queryset = HistoricalData.objects.select_related('route', 'stop').all()
    serializer_class = HistoricalDataSerializer
    @action(detail=False, methods=['get'])
    def average_delay(self, request):
        route_id = request.query_params.get('route_id')
        stop_id = request.query_params.get('stop_id')
        direction = request.query_params.get('direction')

        # Walidacja parametrów
        if not all([route_id, stop_id, direction]):
            return Response({'error': 'route_id, stop_id and direction parameters are required'}, status=400)

        # Filtrowanie danych
        qs = self.get_queryset().filter(route_id=route_id, stop_id=stop_id, direction=direction)

        # Obliczenie średniego opóźnienia
        avg_delay = qs.aggregate(avg_delay=Avg('averageDelay'))['avg_delay']

        if avg_delay is None:
            return Response({'message': 'No data found for given parameters'}, status=404)

        return Response({
            'average_delay': round(avg_delay, 2)
        })

class HistoricalDataViewSet(viewsets.ModelViewSet):
    queryset = HistoricalData.objects.select_related('route', 'stop').all()
    serializer_class = HistoricalDataSerializer
    @action(detail=False, methods=['get'])
    def average_by_route(self, request):
        route_id = request.query_params.get('route_id')
        direction = request.query_params.get('direction')

        # Walidacja parametrów
        if not all([route_id, direction]):
            return Response({'error': 'route_id and direction parameters are required'}, status=400)

        # Filtrowanie danych
        qs = self.get_queryset().filter(route_id=route_id, direction=direction)

        # Oblicz średnią z kolumny averageDelay
        avg_delay = qs.aggregate(avg_delay=Avg('averageDelay'))['avg_delay']

        if avg_delay is None:
            return Response({'message': 'No data found for given route and direction'}, status=404)

        return Response({
            'average_delay': round(avg_delay, 2)
        })
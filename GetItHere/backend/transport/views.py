from django.shortcuts import render

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Stop, Route, Trip, StopTime
from .serializers import StopSerializer, RouteSerializer, TripSerializer, StopTimeSerializer


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

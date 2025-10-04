from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
import json
from .models import Deal

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

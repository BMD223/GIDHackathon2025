from django.db import transaction
from django.utils import timezone
from django.db.models import Avg
from ..models import Delay, HistoricalData #change to ORM implementation

def update_average_delay(route_id: str, direction_id: str, stop_id: str, time_period: str = "all") -> int:
    # Compute the average (may be None) and convert to a safe numeric value
    avg_value = (Delay.objects
                 .filter(route_id=route_id, direction_id=direction_id, stop_id=stop_id)
                 .aggregate(avg=Avg("delay"))["avg"]) or 0.0

    # Ensure stored/returned value is an int. Use round before int to preserve conventional rounding.
    avg_delay = int(round(float(avg_value)))

    with transaction.atomic():
        HistoricalData.objects.update_or_create(
            route_id=route_id,
            direction_id=direction_id,
            stop_id=stop_id,
            time_period=time_period,
            defaults={"actual_time": timezone.now(), "average_delay": avg_delay},
        )
    return avg_delay

def refresh_all_averages(time_period: str = "all") -> int:
    from ..models import Delay, HistoricalData
    groups = (Delay.objects.values("route_id", "direction_id", "stop_id")
              .annotate(avg=Avg("delay")))
    n = 0
    for g in groups:
        avg_value = g.get("avg") or 0.0
        avg_delay = int(round(float(avg_value)))
        HistoricalData.objects.update_or_create(
            route_id=g["route_id"],
            direction_id=g["direction_id"],
            stop_id=g["stop_id"],
            time_period=time_period,
            defaults={"actual_time": timezone.now(), "average_delay": avg_delay},
        )
        n += 1
    return n

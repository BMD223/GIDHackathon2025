from django.db import transaction
from django.db.models import Avg
from .models import Deal, HistoricalData, Route, Stop


def update_average_delay(route_id: str, stop_id: str, direction: int, time_period: str = "all") -> int:
	"""
	Update (or create) a HistoricalData row for the given route/stop/direction
	using the average of Deal.delay values. Returns the integer average delay.
	"""
	# aggregate average delay from Deal.delay
	avg_value = (
		Deal.objects
		.filter(routeId=route_id, stopId=stop_id, direction=direction)
		.aggregate(avg=Avg("delay"))["avg"]
	) or 0

	avg_delay = int(round(float(avg_value)))

	with transaction.atomic():
		# Ensure FK rows exist. Route.lineNumber and Stop.name are required by the model,
		# so provide minimal defaults if they are missing.
		route_obj, _ = Route.objects.get_or_create(routeId=route_id, defaults={"lineNumber": 0})
		stop_obj, _ = Stop.objects.get_or_create(stopId=stop_id, defaults={"name": stop_id})

		# Use FK objects to avoid integrity errors when route/stop didn't exist.
		HistoricalData.objects.update_or_create(
			route=route_obj,
			stop=stop_obj,
			direction=direction,
			defaults={"averageDelay": avg_delay, "timePeriod": None},
		)

	return avg_delay


def refresh_all_averages(time_period: str = "all") -> int:
	"""
	Recompute averages for all distinct route/stop/direction groups present in Deal.
	Returns number of groups processed.
	"""
	groups = (
		Deal.objects
		.values("routeId", "stopId", "direction")
		.annotate(avg=Avg("delay"))
	)

	n = 0
	with transaction.atomic():
		for g in groups:
			avg_value = g.get("avg") or 0
			avg_delay = int(round(float(avg_value)))

			route_obj, _ = Route.objects.get_or_create(routeId=g["routeId"], defaults={"lineNumber": 0})
			stop_obj, _ = Stop.objects.get_or_create(stopId=g["stopId"], defaults={"name": g["stopId"]})

			HistoricalData.objects.update_or_create(
				route=route_obj,
				stop=stop_obj,
				direction=g["direction"],
				defaults={"averageDelay": avg_delay, "timePeriod": None},
			)
			n += 1
	return n

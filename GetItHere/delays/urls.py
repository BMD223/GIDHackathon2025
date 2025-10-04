from django.urls import path
from . import views

urlpatterns = [
    path("add-delay/", views.add_delay_record, name="add_delay_record"),
]

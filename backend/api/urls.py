from django.urls import path

from . import views

urlpatterns = [
    path('data/', views.get_initial_data, name='get_initial_data'),
    path('challenge/', views.get_challenge, name='get_challenge'),
    path('validate/', views.validate_range, name='validate_range'),
]

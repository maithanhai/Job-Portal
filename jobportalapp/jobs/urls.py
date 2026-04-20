from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet

r = DefaultRouter()
r.register('categories', CategoryViewSet)
urlpatterns = [
    path('', include(r.urls)),
]

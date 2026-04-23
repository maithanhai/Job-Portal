from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, UserViewSet

r = DefaultRouter()
r.register('users',UserViewSet,basename='user')
r.register('categories', CategoryViewSet)
urlpatterns = [
    path('', include(r.urls)),
]

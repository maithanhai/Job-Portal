from django.urls import path,include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, UserViewSet, JobViewSet, ApplicationViewSet, SavedJobViewSet, \
    EmployerViewSet

r = DefaultRouter()
r.register('users',UserViewSet,basename='user')
r.register('categories', CategoryViewSet,basename='category')
r.register('jobs', JobViewSet,basename='job')
r.register('applications', ApplicationViewSet,basename='application')
r.register('saved-jobs',SavedJobViewSet,basename='saved-job')
r.register('employers',EmployerViewSet,basename='employer')
urlpatterns = [
    path('', include(r.urls)),
]

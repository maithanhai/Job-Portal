from django.urls import path,include
from rest_framework.routers import DefaultRouter

from .models import SavedJob
from .views import CategoryViewSet, UserViewSet, SkillViewSet, JobViewSet, ApplicationViewSet, SavedJobViewSet

r = DefaultRouter()
r.register('users',UserViewSet,basename='user')
r.register('categories', CategoryViewSet,basename='category')
r.register('skills', SkillViewSet,basename='skill')
r.register('jobs', JobViewSet,basename='job')
r.register('applications', ApplicationViewSet,basename='application')
r.register('saved-jobs',SavedJobViewSet,basename='saved-job')
urlpatterns = [
    path('', include(r.urls)),
]

from django.shortcuts import render
from jobs.models import Category
from jobs.serializers import CategorySerializer
from rest_framework import viewsets
from rest_framework import permissions


# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
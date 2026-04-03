from jobs.models import Candidate, Employer, User, Category, Job
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']
class CandidateSerializer(serializers.ModelSerializer):
    full_name=serializers.CharField(source='user.full_name',read_only=True)
    avatar=serializers.CharField(source='user.avatar',read_only=True)
    phone_number=serializers.CharField(source='user.phone_number',read_only=True)
    class Meta:
        model = Candidate
        fields = ['id','user','full_name','avatar','phone_number']
class EmployerSerializer(serializers.ModelSerializer):
    full_name=serializers.CharField(source='user.full_name',read_only=True)
    avatar=serializers.CharField(source='user.avatar',read_only=True)
    phone_number=serializers.CharField(source='user.phone_number',read_only=True)
    class Meta:
        model = Employer
        fields = ['id','full_name','avatar','phone_number','company_name','location']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name','description']

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id','name','location','description','salary']
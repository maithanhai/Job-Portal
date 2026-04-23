from jobs.models import Candidate, Employer, User, Category, Job
from rest_framework import serializers

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'avatar', 'full_name']

class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ['username', 'password', 'role']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()
        return user
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

class JobSalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id','name','location','description','salary_min','salary_max']

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id','name','location','description','is_negotiable']
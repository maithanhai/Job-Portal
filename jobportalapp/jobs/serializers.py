

from jobportalapp.settings import cloud_name
from jobs.models import Candidate, Employer, User, Category, Job, Skill, Resume, Application, SavedJob
from rest_framework import serializers

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'avatar', 'full_name']
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        if instance.avatar:
            avatar_url = instance.avatar.url
            if not avatar_url.startswith('http'):
                avatar_url = f"http://res.cloudinary.com/{cloud_name}{avatar_url}" #update duong dan avatar
        instance.avatar = avatar_url
        instance.save()
        return instance

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

class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer(read_only=True)
    class Meta:
        model = Job
        fields = ['id','name',
                  'category','location',
                  'description','salary_min',
                  'salary_max','is_negotiable',
                  'employer','deadline']
    def to_representation(self, instance):
        response = super().to_representation(instance)
        category_data = CategorySerializer(instance.category).data
        response['category'] = category_data
        return response
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id','name']

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id','name','file_cv']

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id','resume','candidate','cover_letter']

class SavedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJob
        fields = ['id','candidate','job']
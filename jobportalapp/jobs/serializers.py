from jobs.models import Candidate, Employer, User, Category, Job, Skill, Resume, Application, SavedJob
from rest_framework import serializers


class SimpleUserSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'avatar', 'first_name', 'last_name', 'role', 'phone_number', 'password',
                  'old_password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def validate(self, data):
        if self.instance and 'password' in data:
            old_password = data.pop('old_password', None)
            if not old_password:
                raise serializers.ValidationError({"old_password": "Vui lòng nhập mật khẩu hiện tại."})

            if not self.instance.check_password(old_password):
                raise serializers.ValidationError({"old_password": "Mật khẩu hiện tại không chính xác."})
        return data

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = User
        fields = SimpleUserSerializer.Meta.fields + ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class CandidateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    avatar = serializers.CharField(source='user.avatar', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Candidate
        fields = ['id', 'user', 'full_name', 'avatar', 'phone_number']

class EmployerSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    avatar = serializers.CharField(source='user.avatar', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Employer
        fields = ['id', 'full_name', 'avatar', 'phone_number', 'company_name', 'location']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class SimpleJobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='employer.company_name')

    avatar = serializers.CharField(source='employer.user.avatar', read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'name', 'salary_min', 'salary_max', 'is_negotiable', 'company_name','avatar','updated_at']


class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer(read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'name', 'category', 'location', 'description', 'salary_min', 'salary_max', 'is_negotiable',
                  'employer', 'deadline']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        category_data = CategorySerializer(instance.category).data
        response['category'] = category_data
        return response


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'name', 'file_cv']


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'resume', 'candidate', 'cover_letter','job']


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']


class SavedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJob
        fields = ['id', 'candidate', 'job']
from django.utils import timezone
from rest_framework import serializers
from jobs.models import Candidate, Employer, Category, Job, Application, SavedJob, User
import re


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'avatar', 'first_name', 'last_name', 'role', 'phone_number']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

    def validate_phone_number(self, value):
        if value and not re.match(r'^0[0-9]{9,10}$', value):
            raise serializers.ValidationError("Số điện thoại không đúng định dạng.")
        return value

class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = User
        fields = SimpleUserSerializer.Meta.fields + ['username','password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class CandidateSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Candidate
        fields = ['id', 'user', 'full_name', 'avatar', 'phone_number']

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

class EmployerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Employer
        fields = ['id', 'full_name', 'avatar', 'phone_number', 'company_name', 'location', 'is_verified', 'tax_code',
                  'employee_card', 'logo_company']

    def validate(self, data):
        company_name = data.get('company_name', '').strip()
        location = data.get('location', '').strip()

        if not company_name:
            raise serializers.ValidationError({"company_name": "Tên công ty không được để trống."})
        if not location:
            raise serializers.ValidationError({"location": "Địa chỉ công ty không được để trống."})

        data['company_name'] = company_name
        data['location'] = location
        return data

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.employee_card:
            data['employee_card'] = instance.employee_card.url
        if instance.logo_company:
            data['logo_company'] = instance.logo_company.url
        return data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class CandidateJobListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='employer.company_name', read_only=True)
    logo_company = serializers.ImageField(source='employer.logo_company', read_only=True)
    is_saved = serializers.BooleanField(read_only=True, default=False)
    is_applied = serializers.BooleanField(read_only=True, default=False)
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'name', 'salary_min', 'salary_max', 'is_negotiable', 'company_name', 'logo_company',
                  'is_saved', 'is_applied', 'updated_at', 'location', 'is_expired']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.employer.logo_company:
            data['logo_company'] = instance.employer.logo_company.url
        return data

    def get_is_expired(self, obj):
        if obj.deadline:
            return obj.deadline < timezone.now()
        return False

class EmployerJobListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='employer.company_name', read_only=True)
    logo_company = serializers.ImageField(source='employer.logo_company', read_only=True)
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'name', 'salary_min', 'salary_max', 'is_negotiable',
                  'company_name', 'logo_company', 'location', 'is_expired', 'updated_at']

    def get_is_expired(self, obj):
        if obj.deadline:
            return obj.deadline < timezone.now()
        return False

class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer(read_only=True)
    is_saved = serializers.BooleanField(read_only=True, default=False)
    is_applied = serializers.BooleanField(default=False, read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'name', 'category', 'location', 'salary_min', 'salary_max',
                  'is_negotiable', 'employer', 'deadline', 'is_saved', 'is_applied',
                  'description', 'requirements', 'benefits']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['category'] = CategorySerializer(instance.category).data
        return response

    def validate(self, data):
        is_negotiable = data.get('is_negotiable', False)
        if not is_negotiable:
            salary_min = data.get('salary_min')
            salary_max = data.get('salary_max')
            if salary_min is not None and salary_max is not None:
                if salary_min >= salary_max:
                    raise serializers.ValidationError({
                        "salary_max": "Mức lương tối đa bắt buộc phải lớn hơn mức lương tối thiểu."
                    })
        return data

class ApplicationSerializer(serializers.ModelSerializer):
    file_cv = serializers.FileField(required=True)
    job_details = CandidateJobListSerializer(source='job', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'candidate', 'job', 'job_details', 'file_cv', 'cover_letter', 'status', 'created_at',
                  'review_comment']
        read_only_fields = ['candidate', 'status']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.file_cv:
            data['file_cv'] = instance.file_cv.url
        if instance.candidate and instance.candidate.user:
            data['candidate'] = {
                "id": instance.candidate.id,
                "user": {
                    "first_name": instance.candidate.user.first_name,
                    "last_name": instance.candidate.user.last_name,
                    "avatar": instance.candidate.user.avatar.url if instance.candidate.user.avatar else None
                }
            }
        if instance.job:
            data['job'] = {"id": instance.job.id, "name": instance.job.name}
        return data

class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status', 'review_comment']

class SavedJobSerializer(serializers.ModelSerializer):
    job_details = CandidateJobListSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'candidate', 'job', 'job_details']
        read_only_fields = ['candidate']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Mật khẩu xác nhận không khớp."})
        if data['new_password'] == data['old_password']:
            raise serializers.ValidationError({"new_password": "Mật khẩu mới phải khác mật khẩu hiện tại."})
        if not self.instance.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Mật khẩu hiện tại không chính xác."})
        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance

class CandidateApplicationListSerializer(serializers.ModelSerializer):
    job_name = serializers.CharField(source='job.name', read_only=True)
    company_name = serializers.CharField(source='job.employer.company_name', read_only=True)
    salary_min = serializers.IntegerField(source='job.salary_min', read_only=True)
    salary_max = serializers.IntegerField(source='job.salary_max', read_only=True)
    is_negotiable = serializers.BooleanField(source='job.is_negotiable', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job_name', 'company_name', 'salary_min', 'salary_max',
            'is_negotiable', 'status', 'created_at', 'cover_letter'
        ]

class EmployerApplicationListSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='candidate.user.avatar', read_only=True)
    full_name = serializers.SerializerMethodField()
    job_name = serializers.CharField(source='job.name', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'full_name', 'job_name', 'status','avatar']

    def get_full_name(self, obj):
        if obj.candidate and obj.candidate.user:
            return obj.candidate.user.get_full_name() or obj.candidate.user.username
        return "Ứng viên ẩn danh"

class ApplicationDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    job_name = serializers.CharField(source='job.name', read_only=True)
    file_cv = serializers.FileField(required=True)
    avatar = serializers.ImageField(source='candidate.user.avatar', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'full_name', 'job_name', 'status', 'cover_letter', 'review_comment', 'file_cv','avatar']

    def get_full_name(self, obj):
        if obj.candidate and obj.candidate.user:
            return obj.candidate.user.get_full_name() or obj.candidate.user.username
        return "Ứng viên ẩn danh"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.file_cv:
            data['file_cv'] = instance.file_cv.url
        return data
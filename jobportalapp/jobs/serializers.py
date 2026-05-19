from rest_framework import serializers
from django.contrib.auth import get_user_model
from jobs.models import Candidate, Employer, Category, Job, Skill, Application, SavedJob

User = get_user_model()

# ==========================================
# 1. USER SERIALIZERS
# ==========================================
class SimpleUserSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'avatar', 'first_name', 'last_name', 'role', 'phone_number', 'password', 'old_password']
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
        fields = SimpleUserSerializer.Meta.fields + ['username']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


# ==========================================
# 2. PROFILE SERIALIZERS (CANDIDATE & EMPLOYER)
# ==========================================
class CandidateSerializer(serializers.ModelSerializer):
    # ĐÃ SỬA: Thay thế user.full_name (không tồn tại) bằng hàm lấy tên chuẩn của Django
    full_name = serializers.SerializerMethodField()
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Candidate
        fields = ['id', 'user', 'full_name', 'avatar', 'phone_number', 'skills']

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class EmployerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Employer
        fields = ['id', 'full_name', 'avatar', 'phone_number', 'company_name', 'location', 'is_verified']

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


# ==========================================
# 3. CATEGORY & SKILL SERIALIZERS
# ==========================================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category']


# ==========================================
# 4. JOB SERIALIZERS (ĐÃ BÓC TÁCH GET_QUERYSET RA NGOÀI)
# ==========================================
class SimpleJobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='employer.company_name', read_only=True)
    company_avatar = serializers.ImageField(source='employer.user.avatar', read_only=True)
    # ĐÃ THÊM: Hứng dữ liệu flag check tim từ annotate của queryset bên Viewset
    is_saved = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = Job
        fields = ['id', 'name', 'salary_min', 'salary_max', 'is_negotiable', 'company_name', 'company_avatar', 'is_saved', 'updated_at']


class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer(read_only=True)
    # ĐÃ THÊM: Ép kiểu fields kỹ năng để React Native hiển thị dạng danh sách thay vì chỉ hiện ID trơn
    skill = SkillSerializer(many=True, read_only=True)
    is_saved = serializers.BooleanField(read_only=True, default=False)
    is_applied = serializers.BooleanField(default=False, read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'name', 'category', 'location', 'description', 'salary_min', 'salary_max', 'is_negotiable', 'employer', 'skill', 'deadline', 'is_saved','is_applied']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['category'] = CategorySerializer(instance.category).data
        return response


# ==========================================
# 5. APPLICATION & SAVED JOB SERIALIZERS
# ==========================================
class ApplicationSerializer(serializers.ModelSerializer):
    # ĐÃ SỬA: Xóa bỏ trường 'resume', thay thế bằng 'file_cv' lấy trực tiếp file upload từ local máy
    file_cv = serializers.FileField(required=True)

    class Meta:
        model = Application
        fields = ['id', 'candidate', 'job', 'file_cv', 'cover_letter', 'status', 'created_at']
        read_only_fields = ['candidate', 'status']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.file_cv:
            data['file_cv'] = instance.file_cv.url
        return data


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']


class SavedJobSerializer(serializers.ModelSerializer):
    # ĐÃ THÊM: Đổ full thông tin Job đã lưu kèm theo cho màn hình SavedJobsTab dễ render card
    job_details = SimpleJobSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'candidate', 'job', 'job_details']
        read_only_fields = ['candidate']
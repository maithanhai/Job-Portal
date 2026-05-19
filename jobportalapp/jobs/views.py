from rest_framework import mixins, status, parsers, filters, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import OuterRef, Exists, Value, BooleanField

from jobs.models import Category, User, Candidate, Employer, Skill, Job, Application, SavedJob
from jobs.paginators import DefaultPagination
from jobs.serializers import (
    CategorySerializer, UserSerializer, SimpleUserSerializer, SkillSerializer,
    JobSerializer, SimpleJobSerializer, ApplicationSerializer,
    ApplicationStatusUpdateSerializer, SavedJobSerializer
)
from . import perms


# ==========================================
# 1. TÀI KHOẢN & XÁC THỰC (USER VIEWSET)
# ==========================================
class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action == 'register':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(methods=['post'], url_path='register', detail=False)
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if user.role == User.CANDIDATE:
            Candidate.objects.create(user=user)
        elif user.role == User.EMPLOYER:
            Employer.objects.create(user=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def current_user(self, request):
        user = request.user
        if request.method == 'PATCH':
            s = SimpleUserSerializer(user, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            s.save()
        return Response(SimpleUserSerializer(user).data, status=status.HTTP_200_OK)


# ==========================================
# 2. DANH MỤC NGÀNH NGHỀ & KỸ NĂNG
# ==========================================
class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

    @action(methods=['get'], detail=True, url_path='skills')
    def get_skills(self, request, pk=None):
        category = self.get_object()
        skills = Skill.objects.filter(category=category, is_active=True)
        return Response(SkillSerializer(skills, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='jobs')
    def get_jobs(self, request, pk=None):
        category = self.get_object()
        jobs = Job.objects.filter(category=category, is_active=True)
        return Response(JobSerializer(jobs, many=True).data, status=status.HTTP_200_OK)


class SkillViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Skill.objects.filter(is_active=True)
    serializer_class = SkillSerializer
    pagination_class = DefaultPagination


# ==========================================
# 3. QUẢN LÝ VIỆC LÀM (JOB VIEWSET)
# ==========================================
class JobViewSet(mixins.ListModelMixin,
                 mixins.RetrieveModelMixin,
                 mixins.CreateModelMixin,
                 mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 viewsets.GenericViewSet):
    queryset = Job.objects.filter(is_active=True)
    pagination_class = DefaultPagination

    # Đã bỏ filters.SearchFilter đi vì mình sẽ tự bắt biến 'q' như cách của thầy
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'salary_min']

    def get_serializer_class(self):
        if self.action == 'list':
            return SimpleJobSerializer
        return JobSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsVerifiedEmployer()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        user = self.request.user

        # 1. BẮT BIẾN TÌM KIẾM 'q'
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)

        # 2. XỬ LÝ CHECK TIM ĐỎ & CHECK NỘP ĐƠN
        if user and not user.is_anonymous and user.role == 'CANDIDATE':
            saved_subquery = SavedJob.objects.filter(
                candidate=user.candidate,
                job_id=OuterRef('pk')
            )
            applied_subquery = Application.objects.filter(
                candidate=user.candidate,
                job_id=OuterRef('pk')
            )
            queryset = queryset.annotate(
                is_saved=Exists(saved_subquery),
                # ĐÃ SỬA: Phải dùng Exists(applied_subquery) ở đây
                is_applied=Exists(applied_subquery)
            )
        else:
            queryset = queryset.annotate(
                is_saved=Value(False, output_field=BooleanField()),
                # ĐÃ THÊM: Phải khai báo mặc định là False cho user vãng lai/HR
                is_applied=Value(False, output_field=BooleanField())
            )

        # 3. CÁC BIẾN LỌC KHÁC
        location_kw = self.request.query_params.get('location')
        category_kw = self.request.query_params.get('category_id')
        salary_min = self.request.query_params.get('salary_min')
        company_kw = self.request.query_params.get('company_name')

        if location_kw:
            queryset = queryset.filter(location__icontains=location_kw)
        if category_kw:
            queryset = queryset.filter(category__id=category_kw)
        if salary_min:
            queryset = queryset.filter(salary_min__gte=salary_min)
        if company_kw:
            queryset = queryset.filter(employer__company_name__icontains=company_kw)

        return queryset
    def create(self, request, *args, **kwargs):
        job_serializer = self.get_serializer(data=request.data)
        job_serializer.is_valid(raise_exception=True)

        if hasattr(request.user, 'employer'):
            self.perform_create(job_serializer)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(job_serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user.employer)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ==========================================
# 4. HỒ SƠ ỨNG TUYỂN (APPLICATION VIEWSET)
# ==========================================
class ApplicationViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Application.objects.filter(is_active=True)
    pagination_class = DefaultPagination
    # Parser này bắt buộc để Django bóc tách nhận file CV nhị phân từ mobile gửi lên
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_permissions(self):
        if self.action == 'status':
            return [perms.IsVerifiedEmployer()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        job_obj = serializer.validated_data['job']

        if not hasattr(user, 'candidate'):
            return Response({"detail": "Chỉ ứng viên mới có quyền nộp hồ sơ."}, status=status.HTTP_403_FORBIDDEN)

        if Application.objects.filter(job=job_obj, candidate=user.candidate).exists():
            return Response({"detail": "Bạn đã ứng tuyển công việc này rồi."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(candidate=user.candidate)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Application.objects.none()

        if user.role == 'CANDIDATE':
            return Application.objects.filter(is_active=True, candidate__user=user)
        elif user.role == 'EMPLOYER':
            return Application.objects.filter(is_active=True, job__employer__user=user)
        return Application.objects.none()

    def get_serializer_class(self):
        if self.action == 'status':
            return ApplicationStatusUpdateSerializer
        return ApplicationSerializer

    @action(methods=['patch'], detail=True, url_path='status')
    def status(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if not hasattr(user, 'employer') or instance.job.employer.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


# ==========================================
# 5. LƯU VIỆC LÀM (SAVED JOB VIEWSET)
# ==========================================
class SavedJobViewSet(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = SavedJob.objects.filter(is_active=True)
    serializer_class = SavedJobSerializer
    pagination_class = DefaultPagination
    permission_classes = [permissions.IsAuthenticated]

    # =========================================================
    # ĐÃ THÊM: BẮT BUỘC PHẢI CÓ HÀM NÀY ĐỂ DJANGO PHÂN TRANG ĐÚNG USER
    # =========================================================
    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return SavedJob.objects.none()

        # Chỉ lọc ra những việc làm đã lưu thuộc về ứng viên đang đăng nhập
        return SavedJob.objects.filter(is_active=True, candidate__user=user).order_by('-id')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        job_obj = serializer.validated_data['job']

        if not hasattr(user, 'candidate'):
            return Response({"detail": "Chỉ ứng viên mới được quyền bấm lưu."}, status=status.HTTP_403_FORBIDDEN)

        if SavedJob.objects.filter(candidate=user.candidate, job=job_obj).exists():
            return Response({"detail": "Công việc này đã được lưu trước đó."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(candidate=user.candidate)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        job_id = kwargs.get('pk')

        try:
            instance = SavedJob.objects.get(candidate=user.candidate, job_id=job_id)
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SavedJob.DoesNotExist:
            return Response({"detail": "Không tìm thấy bản ghi cần xóa."}, status=status.HTTP_404_NOT_FOUND)
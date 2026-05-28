from django.db.models.fields import IntegerField
from rest_framework import mixins, status, parsers, filters, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import OuterRef, Exists, Value, BooleanField, Q, Case, When, Count
from . import perms
from django.utils import timezone
from jobs.models import Category, User, Candidate, Employer, Job, Application, SavedJob
from jobs.paginators import DefaultPagination
from jobs.serializers import (
    CategorySerializer, UserSerializer, SimpleUserSerializer, JobSerializer,
    ApplicationSerializer, ApplicationStatusUpdateSerializer, SavedJobSerializer, EmployerSerializer,
    ChangePasswordSerializer, ApplicationDetailSerializer, CandidateApplicationListSerializer,
    EmployerApplicationListSerializer, EmployerJobListSerializer, CandidateJobListSerializer
)
from django.db.models.functions import TruncMonth

class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action == 'register':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(methods=['post'], url_path='register', detail=False)
    def register(self, request):
        user_serializer = self.get_serializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)

        role = user_serializer.validated_data.get('role')
        employer_serializer = None

        if role == User.EMPLOYER:
            employer_serializer = EmployerSerializer(data=request.data)
            employer_serializer.is_valid(raise_exception=True)

        user = user_serializer.save()

        if user.role == User.CANDIDATE:
            Candidate.objects.create(user=user)
        elif user.role == User.EMPLOYER and employer_serializer:
            employer_serializer.save(user=user)

        return Response(user_serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def current_user(self, request):
        user = request.user
        if request.method == 'PATCH':
            s = SimpleUserSerializer(user, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            s.save()
        return Response(SimpleUserSerializer(user).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='change-password', detail=False)
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, instance=request.user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Đổi mật khẩu thành công."}, status=status.HTTP_200_OK)


class EmployerViewSet(viewsets.GenericViewSet):
    queryset = Employer.objects.filter(is_active=True)
    serializer_class = EmployerSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    @action(methods=['get', 'patch'], url_path='current-employer', detail=False)
    def current_employer(self, request):
        user = request.user

        if user.role != 'EMPLOYER':
            return Response({"detail": "Bạn không có quyền truy cập."}, status=status.HTTP_403_FORBIDDEN)

        try:
            employer = user.employer
        except Employer.DoesNotExist:
            return Response({"detail": "Hồ sơ công ty không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PATCH':
            serializer = self.get_serializer(employer, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save(is_verified=False)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(self.get_serializer(employer).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='stats', detail=False)
    def dashboard_stats(self, request):
        user = request.user
        if user.role != 'EMPLOYER':
            return Response({"detail": "Chỉ nhà tuyển dụng mới được xem."}, status=status.HTTP_403_FORBIDDEN)

        employer = user.employer
        year = int(request.query_params.get('year', timezone.now().year))

        total_jobs = Job.objects.filter(employer=employer, is_active=True).count()
        apps = Application.objects.filter(job__employer=employer, is_active=True)
        total_apps = apps.count()

        pipeline = apps.aggregate(
            pending=Count('id', filter=Q(status='PENDING')),
            reviewing=Count('id', filter=Q(status='REVIEWING')),
            accepted=Count('id', filter=Q(status='ACCEPTED')),
            rejected=Count('id', filter=Q(status='REJECTED'))
        )

        acceptance_rate = round((pipeline['accepted'] / total_apps * 100), 1) if total_apps > 0 else 0

        monthly_stats = (apps.filter(created_at__year=year)
                         .annotate(month=TruncMonth('created_at'))
                         .values('month')
                         .annotate(count=Count('id'))
                         .order_by('month'))

        chart_data_dict = {f"{str(m).zfill(2)}/{year}": 0 for m in range(1, 13)}

        for entry in monthly_stats:
            if entry['month']:  # Check an toàn
                month_str = entry['month'].strftime('%m/%Y')
                chart_data_dict[month_str] = entry['count']
        chart_data = [{"label": k, "value": v} for k, v in chart_data_dict.items()]

        return Response({
            "kpis": {
                "total_jobs": total_jobs,
                "total_applications": total_apps,
                "acceptance_rate": acceptance_rate
            },
            "pipeline": {
                "pending": pipeline['pending'] or 0,
                "reviewing": pipeline['reviewing'] or 0,
                "accepted": pipeline['accepted'] or 0,
                "rejected": pipeline['rejected'] or 0,
            },
            "chart_data": chart_data
        }, status=status.HTTP_200_OK)


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

    @action(methods=['get'], detail=True, url_path='jobs')
    def get_jobs(self, request, pk=None):
        category = self.get_object()
        jobs = Job.objects.filter(category=category, is_active=True)
        return Response(JobSerializer(jobs, many=True).data, status=status.HTTP_200_OK)


class JobViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                 mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Job.objects.filter(is_active=True)
    pagination_class = DefaultPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'salary_min']

    def get_serializer_class(self):
        if self.action in ['my_jobs']:
            return EmployerJobListSerializer
        if self.action in ['list']:
            return CandidateJobListSerializer
        return JobSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'my_jobs']:
            return [perms.IsVerifiedEmployer()]
        return [permissions.AllowAny()]

    def get_object(self):
        obj = super().get_object()
        if self.action in ['update', 'partial_update', 'destroy']:
            if not hasattr(self.request.user, 'employer') or obj.employer != self.request.user.employer:
                raise PermissionDenied("Bạn không có quyền thao tác trên tin tuyển dụng của công ty khác.")
        return obj

    @action(methods=['get'], detail=False, url_path='my-jobs')
    def my_jobs(self, request):
        user = request.user
        today = timezone.now()
        queryset = (Job.objects.filter(employer=user.employer, is_active=True)
                    .select_related('employer')
                    .defer('description', 'requirements', 'benefits', 'employer__tax_code', 'employer__employee_card')
                    .order_by('-id'))
        status_filter = request.query_params.get('status', 'active')

        if status_filter == 'active':
            queryset = queryset.filter(Q(deadline__gte=today) | Q(deadline__isnull=True))
        elif status_filter == 'expired':
            queryset = queryset.filter(deadline__lt=today)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        queryset = (Job.objects.filter(is_active=True).select_related('employer')) \
            .defer('description', 'requirements', 'benefits', 'employer__tax_code', 'employer__employee_card')
        user = self.request.user
        today = timezone.now()

        if self.action == 'list':
            if user.is_anonymous or user.role == 'CANDIDATE':
                queryset = queryset.filter(Q(deadline__gte=today) | Q(deadline__isnull=True))

        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)

        if user and not user.is_anonymous and user.role == 'CANDIDATE':
            saved_subquery = SavedJob.objects.filter(candidate=user.candidate, job_id=OuterRef('pk'))
            applied_subquery = Application.objects.filter(candidate=user.candidate, job_id=OuterRef('pk'))
            queryset = queryset.annotate(is_saved=Exists(saved_subquery), is_applied=Exists(applied_subquery))
        else:
            queryset = queryset.annotate(is_saved=Value(False, output_field=BooleanField()),
                                         is_applied=Value(False, output_field=BooleanField()))

        location_kw = self.request.query_params.get('location')
        category_kw = self.request.query_params.get('category_id')
        company_kw = self.request.query_params.get('company_name')
        salary_min = self.request.query_params.get('salary_min')
        salary_max = self.request.query_params.get('salary_max')

        if location_kw:
            queryset = queryset.filter(location__icontains=location_kw)
        if category_kw:
            queryset = queryset.filter(category__id=category_kw)
        if company_kw:
            queryset = queryset.filter(employer__company_name__icontains=company_kw)
        if salary_min and salary_max:
            try:
                s_min, s_max = int(salary_min), int(salary_max)
                if s_min == -1 and s_max == -1:
                    queryset = queryset.filter(is_negotiable=True)
                else:
                    queryset = queryset.filter(is_negotiable=False, salary_min__lte=s_max, salary_max__gte=s_min)
            except (ValueError, TypeError):
                pass
        elif salary_min:
            try:
                queryset = queryset.filter(salary_min__lte=int(salary_min), salary_max__gte=int(salary_min))
            except (ValueError, TypeError):
                pass

        return queryset.order_by("-created_at")

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

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if job.deadline and job.deadline < timezone.now():
            return Response({"detail": "Tin tuyển dụng đã hết hạn, không thể chỉnh sửa!"},
                            status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ApplicationViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    queryset = Application.objects.filter(is_active=True)
    pagination_class = DefaultPagination
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action == 'status':
            return [perms.IsVerifiedEmployer()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        job_obj = serializer.validated_data['job']

        if not job_obj.is_active:
            return Response({"detail": "Công việc này không còn tồn tại hoặc đã bị xóa."},
                            status=status.HTTP_400_BAD_REQUEST)
        if job_obj.deadline and job_obj.deadline < timezone.now():
            return Response({"detail": "Công việc này đã hết hạn ứng tuyển."}, status=status.HTTP_400_BAD_REQUEST)
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
        queryset = Application.objects.filter(is_active=True)

        if user.role == 'CANDIDATE':
            queryset = queryset.filter(candidate__user=user).select_related('job', 'job__employer')
            if self.action == 'list':
                queryset = queryset.only(
                    'id', 'status', 'created_at', 'candidate_id', 'job_id',
                    'job__id', 'job__name', 'job__is_negotiable', 'job__salary_min', 'job__salary_max',
                    'job__employer_id', 'job__employer__id', 'job__employer__company_name', 'cover_letter'
                )
            else:
                queryset = queryset.only(
                    'id', 'status', 'created_at', 'cover_letter', 'review_comment', 'file_cv', 'candidate_id', 'job_id',
                    'job__id', 'job__name', 'job__is_negotiable', 'job__salary_min', 'job__salary_max',
                    'job__employer_id', 'job__employer__id', 'job__employer__company_name'
                )
            queryset = queryset.order_by('-created_at')

        elif user.role == 'EMPLOYER':
            job_id = self.request.query_params.get('job_id')
            queryset = queryset.filter(job__employer__user=user).select_related('candidate__user', 'job')

            if self.action == 'list':
                queryset = queryset.only(
                    'id', 'status', 'candidate_id', 'job_id',
                    'candidate__id', 'candidate__user_id',
                    'candidate__user__id', 'candidate__user__first_name', 'candidate__user__last_name',
                    'candidate__user__username', 'candidate__user__avatar',
                    'job__id', 'job__name'
                )
            else:
                queryset = queryset.only(
                    'id', 'status', 'candidate_id', 'job_id',
                    'cover_letter', 'review_comment', 'file_cv',
                    'candidate__id', 'candidate__user_id',
                    'candidate__user__id', 'candidate__user__first_name', 'candidate__user__last_name',
                    'candidate__user__username', 'candidate__user__avatar',
                    'job__id', 'job__name'
                )

            if job_id:
                queryset = queryset.filter(job_id=job_id)

            status_order = Case(
                When(status='PENDING', then=0),
                When(status='REVIEWING', then=1),
                When(status='ACCEPTED', then=2),
                When(status='REJECTED', then=3),
                default=4,
                output_field=IntegerField(),
            )
            queryset = queryset.annotate(status_priority=status_order).order_by('status_priority', '-created_at')
        else:
            return Application.objects.none()

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            user = self.request.user
            if not user.is_anonymous and user.role == 'EMPLOYER':
                return EmployerApplicationListSerializer
            return CandidateApplicationListSerializer

        elif self.action == 'retrieve':
            return ApplicationDetailSerializer

        elif self.action == 'status':
            return ApplicationStatusUpdateSerializer

        return ApplicationSerializer

    @action(methods=['patch'], detail=True, url_path='review')
    def status(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if not hasattr(user, 'employer') or instance.job.employer.user != user:
            raise PermissionDenied("Bạn không có quyền xét duyệt hồ sơ của công ty khác.")

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class SavedJobViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = SavedJob.objects.filter(is_active=True)
    serializer_class = SavedJobSerializer
    pagination_class = DefaultPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return SavedJob.objects.none()
        return SavedJob.objects.filter(is_active=True, candidate__user=user) \
            .select_related('job__employer') \
            .order_by('-id')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        job_obj = serializer.validated_data['job']

        if not job_obj.is_active:
            return Response({"detail": "Không thể lưu công việc đã bị xóa."}, status=status.HTTP_400_BAD_REQUEST)
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
            return Response({"detail": "Không tìm thấy bản ghi cần xóa hoặc bạn không có quyền."},
                            status=status.HTTP_404_NOT_FOUND)
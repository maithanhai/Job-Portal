from rest_framework import mixins, status, parsers, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from jobs.models import Category, User, Candidate, Employer, Skill, Job, Resume, Application, SavedJob
from jobs.paginators import DefaultPagination
from jobs.serializers import CategorySerializer, UserSerializer, SimpleUserSerializer, SkillSerializer, JobSerializer, \
    ResumeSerializer, ApplicationSerializer, SavedJobSerializer, ApplicationStatusUpdateSerializer, SimpleJobSerializer
from rest_framework import viewsets
from rest_framework import permissions
from . import perms


# Create your views here.
class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action == 'register':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    @action(methods=['post'], url_path='register', detail=False)
    def register(self, request):
        serializer = UserSerializer(data=request.data)
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

class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

    @action(methods=['get'],detail=True,url_path='skills')
    def get_skills(self, request,pk=None):
        category = self.get_object()
        skills = Skill.objects.filter(category=category)
        return Response(SkillSerializer(skills, many=True).data, status=status.HTTP_200_OK)
    @action(methods=['get'],detail=True,url_path='jobs')
    def get_jobs(self, request,pk=None):
        category = self.get_object()
        jobs = Job.objects.filter(category=category)
        return Response(JobSerializer(jobs, many=True).data, status=status.HTTP_200_OK)
class SkillViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Skill.objects.filter(is_active=True)
    serializer_class = SkillSerializer
    pagination_class = DefaultPagination

class JobViewSet(mixins.ListModelMixin,
                 mixins.RetrieveModelMixin,
                 mixins.CreateModelMixin,
                 mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 viewsets.GenericViewSet):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = SimpleJobSerializer
    pagination_class = DefaultPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['id','salary_min']

    def get_serializer_class(self):
        if self.action == 'list':
            return SimpleJobSerializer
        return JobSerializer
    def get_permissions(self):
        if self.action in ['create','update','partial_update']:
            return [perms.IsVerifiedEmployer()]
        return [permissions.AllowAny()]
    def get_queryset(self):
        queryset = super().get_queryset()
        location_kw = self.request.query_params.get('location')
        category_kw = self.request.query_params.get('category_id')
        salary_min = self.request.query_params.get('salary_min')
        company_kw = self.request.query_params.get('company_name')

        if location_kw:
            queryset = queryset.filter(location__icontains=location_kw)
        if category_kw:
            queryset = queryset.filter(category__id=category_kw)
        if salary_min:
            queryset = queryset.filter(salary_min__gte = salary_min)
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

class ResumeViewSet(mixins.ListModelMixin,
                    mixins.CreateModelMixin,
                    mixins.DestroyModelMixin,
                    viewsets.GenericViewSet):
    queryset = Resume.objects.filter(is_active=True)
    serializer_class = ResumeSerializer
    def get_permissions(self):
        if self.action in ['create']:
            return [perms.IsVerifiedCandidate]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        resume_serializer = self.get_serializer(data=request.data)
        resume_serializer.is_valid(raise_exception=True)

        if hasattr(request.user, 'employer'):
            self.perform_create(resume_serializer)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(resume_serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user.candidate)
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class ApplicationViewSet(mixins.ListModelMixin,mixins.CreateModelMixin,viewsets.GenericViewSet):
    queryset = Application.objects.filter(is_active=True)
    permission_classes = [perms.IsVerifiedCandidate,perms.IsVerifiedEmployer]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume_obj = serializer.validated_data['resume']
        job_obj = serializer.validated_data['job']
        user = request.user

        if not hasattr(user,'candidate') or resume_obj.candidate.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if Application.objects.filter(job=job_obj,candidate=user.candidate).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user.candidate)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CANDIDATE':
            return Application.objects.filter(is_active=True,candidate__user=user)
        elif user.role == 'EMPLOYER':
            return Application.objects.filter(is_active=True,job__employer__user=user)

        return Application.objects.none()
    def get_serializer_class(self):
        if self.action in ['status']:
            return ApplicationStatusUpdateSerializer
        return ApplicationSerializer
    @action(methods=['patch'],detail=True,url_path='status')
    def status(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if not hasattr(user,'employer') or instance.job.employer.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance,data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SavedJobViewSet(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = SavedJob.objects.filter(is_active=True)
    serializer_class = SavedJobSerializer
    permission_classes = [perms.IsVerifiedCandidate]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        job_obj = serializer.validated_data['job']

        if SavedJob.objects.filter(candidate=user.candidate,job=job_obj).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def perform_create(self, serializer):
        serializer.save()




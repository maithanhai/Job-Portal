from rest_framework import mixins, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from jobs.models import Category, User, Candidate, Employer
from jobs.serializers import CategorySerializer, UserSerializer, SimpleUserSerializer
from rest_framework import viewsets
from rest_framework import permissions


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
    @action(methods=['get', 'patch'], url_path='me', detail=False)
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

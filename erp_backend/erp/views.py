from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Employee, Profile, CustomUser
from .serializers import EmployeeSerializer, RegisterSerializer, LoginSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.core.exceptions import PermissionDenied

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

class ManageUsersView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user or not self.request.user.is_authenticated:
            raise PermissionDenied("User not authenticated")

        try:
            profile = Profile.objects.get(user=self.request.user)
            if profile.role.lower() != "admin":
                raise PermissionDenied("You do not have permission to access this resource")
        except Profile.DoesNotExist:
            raise PermissionDenied("Profile does not exist for this user")

        return Profile.objects.all()

class DeleteUserView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise NotFound("User not found")

    def delete(self, request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "User not authenticated"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role.lower() != "admin":
                return Response(
                    {"detail": "You do not have permission to perform this action"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Profile does not exist for this user"},
                status=status.HTTP_403_FORBIDDEN
            )

        user_to_delete = self.get_object()
        if user_to_delete == request.user:
            return Response(
                {"detail": "You cannot delete your own account"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UpdateUserView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        return Profile.objects.get(user__id=user_id)

    def update(self, request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "User not authenticated"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role.lower() != "admin":
                return Response(
                    {"detail": "You do not have permission to perform this action"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Profile does not exist for this user"},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)
    

from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.core.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from .models import CustomUser, Profile, Employee, Department, Role
from .serializers import (
    EmployeeSerializer, RegisterSerializer, LoginSerializer, ProfileSerializer,
    DepartmentSerializer, RoleSerializer
)

class DepartmentPagination(PageNumberPagination):
    page_size = 5  # Matches frontend's departmentRowsPerPage
    page_size_query_param = 'page_size'
    max_page_size = 100
class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all().order_by('id')
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DepartmentPagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DepartmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'code'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class RoleListCreateView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RoleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
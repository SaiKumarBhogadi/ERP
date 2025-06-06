from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Employee, Profile, CustomUser
from .serializers import EmployeeSerializer, RegisterSerializer, LoginSerializer, ProfileSerializer,AddUserSerializer
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
    
class AddUserView(generics.CreateAPIView):
    serializer_class = AddUserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check if the requesting user is an admin
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

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Serialize the created user's profile to match the ManageUsersView response
        profile_serializer = ProfileSerializer(user.profile)
        return Response(profile_serializer.data, status=status.HTTP_201_CREATED)
    

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
    

from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, TaxCode, UOM, Warehouse, Size, Color, Supplier
from .serializers import (
    ProductSerializer, CategorySerializer, TaxCodeSerializer, UOMSerializer,
    WarehouseSerializer, SizeSerializer, ColorSerializer, SupplierSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__name', 'status', 'product_type']
    search_fields = ['product_id', 'product_name']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TaxCodeViewSet(viewsets.ModelViewSet):
    queryset = TaxCode.objects.all()
    serializer_class = TaxCodeSerializer

class UOMViewSet(viewsets.ModelViewSet):
    queryset = UOM.objects.all()
    serializer_class = UOMSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer

class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer



from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
import pandas as pd
from .models import Customer, SalesRep
from .serializers import CustomerSerializer, SalesRepSerializer
from .forms import CustomerImportForm

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'customer_type', 'assigned_sales_rep__name']
    search_fields = ['customer_id', 'first_name', 'email']

    @action(detail=False, methods=['post'], url_path='import')
    def import_customers(self, request):
        form = CustomerImportForm(request.POST, request.FILES)
        if not form.is_valid():
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

        file = form.cleaned_data['file']
        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)
            else:  # Excel file
                df = pd.read_excel(file)

            required_fields = [
                'customer_id', 'customer_name', 'customer_type', 'company_name',
                'status', 'email', 'credit_limit', 'city'
            ]
            missing_fields = [field for field in required_fields if field not in df.columns]
            if missing_fields:
                return Response(
                    {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Rename customer_name to first_name
            df = df.rename(columns={'customer_name': 'first_name'})
            # Ensure credit_limit is numeric
            df['credit_limit'] = pd.to_numeric(df['credit_limit'], errors='coerce')

            # Validate and process rows
            valid_rows = []
            invalid_rows = []
            skipped_rows = []
            seen_customer_ids = set(Customer.objects.values_list('customer_id', flat=True))
            seen_emails = set(Customer.objects.values_list('email', flat=True))

            for index, row in df.iterrows():
                row_dict = row.to_dict()
                # Check for required fields
                if any(pd.isna(row_dict[field]) for field in required_fields):
                    invalid_rows.append(index + 2)  # +2 for header row and 1-based indexing
                    continue

                # Check for duplicates
                if row_dict['customer_id'] in seen_customer_ids or row_dict['email'] in seen_emails:
                    skipped_rows.append(index + 2)
                    continue

                seen_customer_ids.add(row_dict['customer_id'])
                seen_emails.add(row_dict['email'])
                valid_rows.append(row_dict)

            # Save valid rows
            for row in valid_rows:
                # Remove customer_id to let the model generate it
                row.pop('customer_id', None)
                serializer = CustomerSerializer(data=row)
                if serializer.is_valid():
                    serializer.save()
                else:
                    invalid_rows.append(index + 2)

            return Response({
                'valid_rows': len(valid_rows),
                'invalid_rows': len(invalid_rows),
                'skipped_rows': len(skipped_rows),
                'invalid_row_numbers': invalid_rows,
                'skipped_row_numbers': skipped_rows,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='merge-duplicates')
    def merge_duplicates(self, request):
        customer_ids = request.data.get('customer_ids', [])
        if len(customer_ids) < 2:
            return Response(
                {'error': 'At least two customers are required to merge.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            customers = Customer.objects.filter(id__in=customer_ids)
            if customers.count() != len(customer_ids):
                return Response(
                    {'error': 'One or more customers not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Keep the first customer as the primary record
            primary = customers.first()
            others = customers.exclude(id=primary.id)

            # Merge logic (simplified: keep primary data, update references if any)
            # You can add more complex merging logic here (e.g., compare fields)
            others.delete()  # Delete duplicates

            return Response(
                {'message': f'Merged {len(others)} duplicates into customer {primary.customer_id}'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SalesRepViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SalesRep.objects.all()
    serializer_class = SalesRepSerializer
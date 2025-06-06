from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Profile, Employee, CustomUser

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'email', 'position', 'hire_date', 'created_at']

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    full_name = serializers.CharField(source='user.full_name')
    role = serializers.CharField(read_only=True)
    profile_pic = serializers.ImageField(allow_null=True, required=False, use_url=True)

    class Meta:
        model = Profile
        fields = ['user_id', 'email', 'phone', 'role', 'full_name', 'profile_pic']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        user.full_name = user_data.get('full_name', user.full_name)
        user.save()

        instance.phone = validated_data.get('phone', instance.phone)
        instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)
        instance.save()
        return instance 
    

class AddUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    contact_number = serializers.CharField(required=False, allow_blank=True, source='phone')
    branch = serializers.CharField(required=True)
    department = serializers.CharField(required=True)
    role = serializers.CharField(required=True)
    reporting_to = serializers.CharField(required=False, allow_blank=True)
    available_branches = serializers.CharField(required=False, allow_blank=True)
    employee_id = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'email', 'contact_number', 'branch',
            'department', 'role', 'reporting_to', 'available_branches', 'employee_id'
        ]

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_employee_id(self, value):
        if value and Profile.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("A user with this Employee ID already exists.")
        return value

    def create(self, validated_data):
        # Combine first_name and last_name into full_name
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        full_name = f"{first_name} {last_name}".strip()

        # Extract profile-related fields
        profile_data = {
            'phone': validated_data.pop('phone', ''),
            'branch': validated_data.pop('branch'),
            'department': validated_data.pop('department'),
            'role': validated_data.pop('role'),
            'reporting_to': validated_data.pop('reporting_to', ''),
            'available_branches': validated_data.pop('available_branches', ''),
            'employee_id': validated_data.pop('employee_id', ''),
        }

        # Generate a default password (e.g., 'default_password_123')
        # In a production environment, you might want to email the user a temporary password or a reset link
        default_password = "default_password_123"

        # Create the CustomUser
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=full_name,
            password=default_password
        )

        # Create the associated Profile
        Profile.objects.create(user=user, **profile_data)

        return user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    full_name = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'password', 'phone', 'role']

    def create(self, validated_data):
        phone = validated_data.pop('phone')
        role = validated_data.pop('role')
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user, phone=phone, role=role)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        user = authenticate(email=email, password=password)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")
    


from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Profile, Employee, Department, Role, Access

class AccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Access
        fields = [
            'dashboard_full_access', 'dashboard_view', 'dashboard_create', 'dashboard_edit', 'dashboard_delete',
            'task_full_access', 'task_view', 'task_create', 'task_edit', 'task_delete',
            'project_tracker_full_access', 'project_tracker_view', 'project_tracker_create', 'project_tracker_edit', 'project_tracker_delete',
            'onboarding_full_access', 'onboarding_view', 'onboarding_create', 'onboarding_edit', 'onboarding_delete',
            'attendance_full_access', 'attendance_view', 'attendance_create', 'attendance_edit', 'attendance_delete',
            'created_at'
        ]

    def to_representation(self, instance):
        return {
            'dashboard': {
                'fullAccess': instance.dashboard_full_access,
                'view': instance.dashboard_view,
                'create': instance.dashboard_create,
                'edit': instance.dashboard_edit,
                'delete': instance.dashboard_delete,
            },
            'task': {
                'fullAccess': instance.task_full_access,
                'view': instance.task_view,
                'create': instance.task_create,
                'edit': instance.task_edit,
                'delete': instance.task_delete,
            },
            'projectTracker': {
                'fullAccess': instance.project_tracker_full_access,
                'view': instance.project_tracker_view,
                'create': instance.project_tracker_create,
                'edit': instance.project_tracker_edit,
                'delete': instance.project_tracker_delete,
            },
            'onboarding': {
                'fullAccess': instance.onboarding_full_access,
                'view': instance.onboarding_view,
                'create': instance.onboarding_create,
                'edit': instance.onboarding_edit,
                'delete': instance.onboarding_delete,
            },
            'attendance': {
                'fullAccess': instance.attendance_full_access,
                'view': instance.attendance_view,
                'create': instance.attendance_create,
                'edit': instance.attendance_edit,
                'delete': instance.attendance_delete,
            },
        }

    def to_internal_value(self, data):
        ret = {}
        for section in ['dashboard', 'task', 'projectTracker', 'onboarding', 'attendance']:
            section_data = data.get(section, {})
            ret[f'{section.replace("Tracker", "_tracker")}_full_access'] = section_data.get('fullAccess', False)
            ret[f'{section.replace("Tracker", "_tracker")}_view'] = section_data.get('view', False)
            ret[f'{section.replace("Tracker", "_tracker")}_create'] = section_data.get('create', False)
            ret[f'{section.replace("Tracker", "_tracker")}_edit'] = section_data.get('edit', False)
            ret[f'{section.replace("Tracker", "_tracker")}_delete'] = section_data.get('delete', False)
        return ret

class RoleSerializer(serializers.ModelSerializer):
    access = AccessSerializer()

    class Meta:
        model = Role
        fields = ['id', 'role', 'description', 'access', 'created_at', 'updated_at']

    def create(self, validated_data):
        access_data = validated_data.pop('access')
        role = Role.objects.create(**validated_data)
        Access.objects.create(role=role, **access_data)
        return role

    def update(self, instance, validated_data):
        access_data = validated_data.pop('access', None)
        instance.role = validated_data.get('role', instance.role)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        if access_data:
            access = instance.access
            for key, value in access_data.items():
                setattr(access, key, value)
            access.save()

        return instance

class DepartmentSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'code', 'department_name', 'description', 'branch', 'roles', 'created_at', 'updated_at']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'email', 'position', 'hire_date', 'created_at']


from rest_framework import serializers
from .models import Product, Category, TaxCode, UOM, Warehouse, Size, Color, Supplier

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class TaxCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxCode
        fields = ['id', 'tax_name', 'tax_percentage', 'description']

class UOMSerializer(serializers.ModelSerializer):
    class Meta:
        model = UOM
        fields = ['id', 'uom_name', 'items', 'description']

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'warehouse_name', 'location', 'manager_name', 'contact_info', 'notes']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'supplier_name', 'contact_person', 'phone_number', 'email_address', 'address']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    tax_code = TaxCodeSerializer(read_only=True)
    tax_code_id = serializers.PrimaryKeyRelatedField(
        queryset=TaxCode.objects.all(), source='tax_code', write_only=True
    )
    uom = UOMSerializer(read_only=True)
    uom_id = serializers.PrimaryKeyRelatedField(
        queryset=UOM.objects.all(), source='uom', write_only=True
    )
    warehouse = WarehouseSerializer(read_only=True)
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), source='warehouse', write_only=True
    )
    size = SizeSerializer(read_only=True)
    size_id = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(), source='size', write_only=True
    )
    color = ColorSerializer(read_only=True)
    color_id = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), source='color', write_only=True
    )
    supplier = SupplierSerializer(read_only=True)
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), source='supplier', write_only=True
    )
    related_products = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), many=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'product_id', 'product_name', 'product_type', 'description',
            'category', 'category_id', 'tax_code', 'tax_code_id', 'unit_price', 'discount',
            'uom', 'uom_id', 'quantity', 'stock_level', 'reorder_level', 'warehouse',
            'warehouse_id', 'size', 'size_id', 'color', 'color_id', 'weight',
            'specifications', 'supplier', 'supplier_id', 'status', 'product_usage',
            'related_products', 'sub_category', 'image'
        ]

    def create(self, validated_data):
        related_products = validated_data.pop('related_products', [])
        product = Product.objects.create(**validated_data)
        product.related_products.set(related_products)
        return product

    def update(self, instance, validated_data):
        related_products = validated_data.pop('related_products', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if related_products is not None:
            instance.related_products.set(related_products)
        return instance
    


from rest_framework import serializers
from .models import Customer, SalesRep

class SalesRepSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRep
        fields = ['id', 'name']

class CustomerSerializer(serializers.ModelSerializer):
    assigned_sales_rep = serializers.PrimaryKeyRelatedField(
        queryset=SalesRep.objects.all(), required=False, allow_null=True
    )
    assigned_sales_rep_name = serializers.CharField(
        source='assigned_sales_rep.name', read_only=True
    )
    industry = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    custom_industry = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    payment_terms = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    custom_payment_terms = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    credit_term = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    custom_credit_term = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Customer
        fields = [
            'id', 'customer_id', 'first_name', 'last_name', 'customer_type', 'status',
            'assigned_sales_rep', 'assigned_sales_rep_name', 'email', 'phone_number',
            'address', 'street', 'city', 'state', 'zip_code', 'country', 'company_name',
            'industry', 'custom_industry', 'location', 'gst_tax_id', 'credit_limit',
            'available_limit', 'billing_address', 'shipping_address', 'payment_terms',
            'custom_payment_terms', 'credit_term', 'custom_credit_term', 'last_edited',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['customer_id', 'available_limit', 'last_edited', 'created_by', 'created_at', 'updated_at']

    def validate(self, data):
        customer_type = data.get('customer_type')
        company_name = data.get('company_name')
        location = data.get('location')

        # Validate company_name and location for non-Individual types
        if customer_type in ['Business', 'Organization']:
            if not company_name:
                raise serializers.ValidationError({'company_name': 'This field is required for Business/Organization types.'})
            if not location:
                raise serializers.ValidationError({'location': 'This field is required for Business/Organization types.'})

        # Handle custom fields
        if data.get('industry') == 'custom':
            if not data.get('custom_industry'):
                raise serializers.ValidationError({'custom_industry': 'This field is required when industry is "custom".'})
            data['industry'] = data.get('custom_industry')
        if data.get('payment_terms') == 'custom':
            if not data.get('custom_payment_terms'):
                raise serializers.ValidationError({'custom_payment_terms': 'This field is required when payment_terms is "custom".'})
            data['payment_terms'] = data.get('custom_payment_terms')
        if data.get('credit_term') == 'custom':
            if not data.get('custom_credit_term'):
                raise serializers.ValidationError({'custom_credit_term': 'This field is required when credit_term is "custom".'})
            data['credit_term'] = data.get('custom_credit_term')

        return data
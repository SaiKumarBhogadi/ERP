from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, full_name, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.full_name

class Employee(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    position = models.CharField(max_length=50)
    hire_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Profile(models.Model):
    from django.conf import settings

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    role = models.CharField(max_length=50)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    # New fields for Add User functionality
    branch = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    reporting_to = models.CharField(max_length=100, blank=True, null=True)
    available_branches = models.CharField(max_length=255, blank=True, null=True)
    employee_id = models.CharField(max_length=50, blank=True, null=True, unique=True)

    def __str__(self):
        return f"{self.user.full_name}'s Profile"
    


class Department(models.Model):
    code = models.CharField(max_length=10, unique=True)
    department_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    branch = models.CharField(max_length=100, blank=True, null=True)  # Storing branch as CharField since frontend uses a dropdown
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.department_name

class Role(models.Model):
    role = models.CharField(max_length=100)  # Renamed 'name' to 'role' to match frontend
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='roles')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('role', 'department')  # Ensure role names are unique within a department

    def __str__(self):
        return f"{self.role} ({self.department.department_name})"

class Access(models.Model):
    role = models.OneToOneField(Role, on_delete=models.CASCADE, related_name='access')
    # Dashboard permissions
    dashboard_full_access = models.BooleanField(default=False)
    dashboard_view = models.BooleanField(default=False)
    dashboard_create = models.BooleanField(default=False)
    dashboard_edit = models.BooleanField(default=False)
    dashboard_delete = models.BooleanField(default=False)
    # Task permissions
    task_full_access = models.BooleanField(default=False)
    task_view = models.BooleanField(default=False)
    task_create = models.BooleanField(default=False)
    task_edit = models.BooleanField(default=False)
    task_delete = models.BooleanField(default=False)
    # Project Tracker permissions
    project_tracker_full_access = models.BooleanField(default=False)
    project_tracker_view = models.BooleanField(default=False)
    project_tracker_create = models.BooleanField(default=False)
    project_tracker_edit = models.BooleanField(default=False)
    project_tracker_delete = models.BooleanField(default=False)
    # Onboarding permissions
    onboarding_full_access = models.BooleanField(default=False)
    onboarding_view = models.BooleanField(default=False)
    onboarding_create = models.BooleanField(default=False)
    onboarding_edit = models.BooleanField(default=False)
    onboarding_delete = models.BooleanField(default=False)
    # Attendance permissions
    attendance_full_access = models.BooleanField(default=False)
    attendance_view = models.BooleanField(default=False)
    attendance_create = models.BooleanField(default=False)
    attendance_edit = models.BooleanField(default=False)
    attendance_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Access for {self.role.role}"
    


from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class TaxCode(models.Model):
    tax_name = models.CharField(max_length=50)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.tax_name} ({self.tax_percentage}%)"

class UOM(models.Model):
    uom_name = models.CharField(max_length=50)
    items = models.PositiveIntegerField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.uom_name} ({self.items})"

class Warehouse(models.Model):
    warehouse_name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    manager_name = models.CharField(max_length=100, blank=True, null=True)
    contact_info = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.warehouse_name

class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Supplier(models.Model):
    supplier_name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email_address = models.EmailField()
    address = models.TextField()

    def __str__(self):
        return self.supplier_name

class Product(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ('Goods', 'Goods'),
        ('Services', 'Services'),
        ('Combo', 'Combo'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Discontinued', 'Discontinued'),
    ]
    USAGE_CHOICES = [
        ('Purchase', 'Purchase'),
        ('Sale', 'Sale'),
        ('Both', 'Both'),
    ]

    product_id = models.CharField(max_length=20, unique=True, editable=False)
    product_name = models.CharField(max_length=100)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    tax_code = models.ForeignKey(TaxCode, on_delete=models.SET_NULL, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    stock_level = models.PositiveIntegerField()
    reorder_level = models.PositiveIntegerField()
    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True)
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, null=True)
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True)
    weight = models.CharField(max_length=50, blank=True, null=True)
    specifications = models.TextField(blank=True, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    product_usage = models.CharField(max_length=20, choices=USAGE_CHOICES)
    related_products = models.ManyToManyField('self', blank=True)
    sub_category = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.product_id:
            last_product = Product.objects.order_by('-id').first()
            new_id = f"CVB{str(last_product.id + 1).zfill(3)}" if last_product else "CVB001"
            self.product_id = new_id
        super().save(*args, **kwargs)

    def __str__(self):
        return self.product_name
    
from django.db import models
from django.utils import timezone

class SalesRep(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    CUSTOMER_TYPE_CHOICES = [
        ('Individual', 'Individual'),
        ('Business', 'Business'),
        ('Organization', 'Organization'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    INDUSTRY_CHOICES = [
        ('Technology', 'Technology'),
        ('Manufacturing', 'Manufacturing'),
        ('Healthcare', 'Healthcare'),
        ('Finance', 'Finance'),
        ('Education', 'Education'),
        ('Construction', 'Construction'),
        ('Transportation', 'Transportation'),
        ('Hospitality', 'Hospitality'),
        ('Energy', 'Energy'),
        ('Media & Comms', 'Media & Comms'),
    ]
    PAYMENT_TERMS_CHOICES = [
        ('Net 15', 'Net 15'),
        ('Net 30', 'Net 30'),
        ('Net 45', 'Net 45'),
        ('Net 60', 'Net 60'),
        ('Due on Receipt', 'Due on Receipt'),
    ]
    CREDIT_TERM_CHOICES = [
        ('Standard', 'Standard'),
        ('Extended', 'Extended'),
        ('Advance', 'Advance'),
        ('Prepaid', 'Prepaid'),
        ('COD (Cash on Delivery)', 'COD (Cash on Delivery)'),
    ]

    customer_id = models.CharField(max_length=10, unique=True, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    assigned_sales_rep = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    country = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, blank=True, null=True)
    custom_industry = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    gst_tax_id = models.CharField(max_length=50, blank=True, null=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    available_limit = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, editable=False)
    billing_address = models.TextField(blank=True, null=True)
    shipping_address = models.TextField(blank=True, null=True)
    payment_terms = models.CharField(max_length=50, choices=PAYMENT_TERMS_CHOICES, blank=True, null=True)
    custom_payment_terms = models.CharField(max_length=50, blank=True, null=True)
    credit_term = models.CharField(max_length=50, choices=CREDIT_TERM_CHOICES, blank=True, null=True)
    custom_credit_term = models.CharField(max_length=50, blank=True, null=True)
    last_edited = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=100, default='Admin')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Auto-generate customer_id if not set (e.g., CUS0001)
        if not self.customer_id:
            last_customer = Customer.objects.all().order_by('id').last()
            if last_customer:
                last_id = int(last_customer.customer_id.replace('CUS', ''))
                new_id = last_id + 1
            else:
                new_id = 1
            self.customer_id = f'CUS{new_id:04d}'

        # Set available_limit to credit_limit if not set (for simplicity)
        if self.credit_limit and not self.available_limit:
            self.available_limit = self.credit_limit

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} ({self.customer_id})"
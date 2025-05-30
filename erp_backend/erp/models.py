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
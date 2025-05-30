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
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, RegisterView, LoginView, ProfileView, ManageUsersView, DeleteUserView , UpdateUserView, DepartmentListCreateView,DepartmentRetrieveUpdateDestroyView, RoleListCreateView,RoleRetrieveUpdateDestroyView
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('manage-users/', ManageUsersView.as_view(), name='manage-users'),
    path('delete-user/<int:user_id>/', DeleteUserView.as_view(), name='delete-user'),
     path('update-user/<int:user_id>/', UpdateUserView.as_view(), name='update_user'),
     path('departments/', DepartmentListCreateView.as_view(), name='department-list-create'),
    path('departments/<str:code>/', DepartmentRetrieveUpdateDestroyView.as_view(), name='department-retrieve-update-destroy'),
    path('roles/', RoleListCreateView.as_view(), name='role-list-create'),
    path('roles/<int:id>/', RoleRetrieveUpdateDestroyView.as_view(), name='role-retrieve-update-destroy'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)    
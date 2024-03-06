from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (TokenRefreshView,TokenVerifyView,)


urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginAPIView.as_view(), name="login"),
    path('logout/', LogoutAPIView.as_view(), name="logout"),
    path('email-verify/', VerifyEmail.as_view(), name="email-verify"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('request-reset-password/', RequestPasswordResetEmail.as_view(),name="request-reset-password"),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(),name='password-reset-complete'),
    path('me/', RetrieveUserView.as_view(),name='retrieve-me'),
    path('user/', UserDetailView.as_view(),name='retrieve-user-detail'),
    path('user/<int:pk>/', UserDetailView.as_view(),name='retrieve-user-detail'),
    path('role/', RoleView.as_view(),name='retrieve-role'),
    # path('role/<int:pk>/', RoleView.as_view(),name='retrieve-plantation-details'),
]
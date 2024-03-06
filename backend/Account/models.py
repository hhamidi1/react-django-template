from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin)
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken

class UserManager(BaseUserManager):

    def create_user(self, username, email, password=None, **extra_fields):
        if username is None:
            raise TypeError('Users should have a username')
        if email is None:
            raise TypeError('Users should have a Email')

        user = self.model(username=username, email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None):
        if password is None:
            raise TypeError('Password should not be none')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user
    
class Role(models.Model):
    Role_id = models.AutoField(primary_key=True)
    Role_name = models.CharField(max_length=1000)
    Role_description = models.TextField(default='N/A',null=True,blank=True)
    
    def __str__(self):
         return self.Role_name
    
class UserDetail(models.Model):
    User_detail_id = models.AutoField(primary_key=True)
    Profile_picture = models.CharField(null=True,blank=True,max_length=1000)
    First_name = models.CharField(default='N/A',max_length=1000)
    Last_name = models.CharField(default='N/A',max_length=1000)
    Date_of_birth = models.DateField(null=True,blank=True)
    Address = models.CharField(default='N/A',max_length=1000)
    Contact_number = models.CharField(default='N/A',max_length=1000)
    Role = models.ForeignKey(Role, on_delete=models.DO_NOTHING,null=True,blank=True)
    
    def __str__(self):
         return f'{self.First_name}, {self.Last_name}'

class UserAccount(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # role = models.ForeignKey(Role, on_delete=models.DO_NOTHING,null=True,blank=True)
    User_detail = models.ForeignKey(UserDetail, on_delete=models.DO_NOTHING,null=True,blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
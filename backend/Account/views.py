from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status, views, permissions
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from django.contrib.sites.shortcuts import get_current_site
import jwt
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q
from .utils import Util
import numpy as np
import os
from django.core.files.storage import FileSystemStorage
import shutil
import datetime
import pytz
import json


class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            email = data['email']
            email = email.lower()
            password = data['password']
            re_password = data['re_password']
            if password == re_password:
                if len(password) >= 8:
                    if not UserAccount.objects.filter(email=email).exists():
                        user = request.data
                        userdetail = {
                            "First_name":user['userDetail']['First_name'],
                            "Last_name" :user['userDetail']['Last_name'],
                            "Role" :user['userDetail']['Role'],
                        }
                        userdetailserializer = UserDetailSerializer(data=userdetail)
                        if userdetailserializer.is_valid():
                            userdetailserializer.save()
                            
                        serializer = self.serializer_class(data=user)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        
                        userdetail = json.loads(json.dumps(UserDetailSerializer(UserDetail.objects.all(), many=True).data))
                        userdetail_id = max(np.unique([ f["User_detail_id"] for f in userdetail ],axis=0))
                        UserAccount.objects.filter(email=email).update(User_detail_id=userdetail_id)
                        
                        user = UserAccount.objects.get(email=email)
                        token = RefreshToken.for_user(user).access_token
                        current_site = get_current_site(request).domain
                        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                        relativeLink = '/activate/'
                        absurl = 'http://'+current_site+relativeLink+str(uidb64)+"/"+str(token)
                        email_body = 'Hi '+user.username + \
                        "\n\nYou're receiving this email because you need to finish activation process on POMAS."+\
                            " Please go to the following page to activate account: \n\n" + absurl + \
                            '\n\nThanks for using our POMAS! \n\nThe POMAS team'
                        data = {'email_body': email_body, 'to_email': user.email,
                                'email_subject': 'POMAS-Account activation'}

                        Util.send_email(data)

                        return Response(
                            {'success': 'User created successfully'},
                            status=status.HTTP_201_CREATED
                        )
                    else:
                        return Response(
                            {'error': 'User with this email already exists'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    return Response(
                        {'error': 'Password must be at least 8 characters in length'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {'error': 'Passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except:
            return Response(
                {'error': 'Something went wrong when registering an account'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class VerifyEmail(views.APIView):
    serializer_class = EmailVerificationSerializer
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        
        try:
            uid = request.data["uid"]
            token = request.data["token"]
            user_id = smart_str(urlsafe_base64_decode(uid))
            email_uid = UserAccount.objects.get(id=user_id)
            payload = jwt.decode(token, settings.SECRET_KEY)
            email_token = UserAccount.objects.get(id=payload['user_id'])
            if email_uid==email_token:
                user = UserAccount.objects.get(id=payload['user_id'])
                if not user.is_verified:
                    user.is_verified = True
                    user.save()
                    user = UserAccount.objects.get(email=email_uid)
                    current_site = get_current_site(request).domain
                    absurl = 'http://'+current_site
                    email_body = 'Hi '+user.username + \
                        '\n\nYour account has been created and is ready to use!. Please log in into link below \n\n' + absurl + \
                            '\n\nThanks for using our POMAS! \n\nThe POMAS team'
                    data = {'email_body': email_body, 'to_email': user.email,
                            'email_subject': 'POMAS-Your account has been successfully created and activated!'}

                    Util.send_email(data)
                    return Response({'success': 'Successfully activated'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Email already been activated'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid Email'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        useraccount = json.loads(json.dumps(serializer.data))
        userdetail = json.loads(json.dumps(UserDetailSerializer(UserDetail.objects.get(User_detail_id=useraccount['User_detail_id'])).data))
        userdata = useraccount | userdetail
        del userdata['User_detail_id']
        UserAccount.objects.filter(email=userdata['email']).update(last_login=datetime.datetime.now(pytz.timezone("Asia/Singapore")))
        return Response(userdata, status=status.HTTP_200_OK)
    
class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            email = request.data.get('email', '')
            if UserAccount.objects.filter(email=email).exists():
                user = UserAccount.objects.get(email=email)
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)
                current_site = get_current_site(
                    request=request).domain
                relativeLink = '/reset-confirm/'
                absurl = 'http://'+current_site + relativeLink +str(uidb64)+"/"+str(token)
                email_body = "You're receiving this email because you requested a password reset for your user account at POMAS"+\
                     '\n\nPlease go to the following page and choose a new password:  \n\n' + \
                    absurl + "\n\nYour username, in case you've forgotten: "+str(email) + \
                        "\n\nThanks for using POMAS! \n\nThe POMAS team"
                data = {'email_body': email_body, 'to_email': user.email,
                        'email_subject': 'POMAS-Reset your passsword'}
                Util.send_email(data)
                return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid email address'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'We cannot sent you a link to reset your password'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = (permissions.AllowAny, )

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            uid = request.data["uid"]
            token = request.data["token"]
            user_id = smart_str(urlsafe_base64_decode(uid))
            email_uid = UserAccount.objects.get(id=user_id)
            if  UserAccount.objects.filter(email=email_uid).exists():
                user = UserAccount.objects.get(email=email_uid)
                current_site = get_current_site(request).domain
                absurl = 'http://'+current_site
                email_body = 'Hi '+user.username + \
                    '\n\nYour password has been changed!. Please proceed to log in into link below \n\n' + absurl + \
                        '\n\nThanks for using our POMAS! \n\nThe POMAS team'
                data = {'email_body': email_body, 'to_email': user.email,
                        'email_subject': 'POMAS-Your password has been successfully changed!'}

                Util.send_email(data)
                return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid Email'}, status=status.HTTP_400_BAD_REQUEST)
        except :
            return Response({'error': 'Something went wrong when reset account'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'TokenError': 'Token is expired or invalid'}, status=status.HTTP_400_BAD_REQUEST)
     
class RetrieveUserView(APIView):
    def get(self, request, format=None):
        try:
            useraccount = json.loads(json.dumps(UserSerializer(request.user).data))
            userdetail = json.loads(json.dumps(UserDetailSerializer(UserDetail.objects.get(User_detail_id=useraccount['User_detail_id'])).data))
            
            userdata = useraccount | userdetail

            return Response(userdata, status=status.HTTP_200_OK)
        except:
            return Response(
                {'error': 'Something went wrong when retrieving user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        try:
            user_data = json.loads(request.data['Profile_data'])
            print(request.data['Profile_picture'])
            if request.data['Profile_picture'] == "" or request.data['Profile_picture'] == "null" or request.data['Profile_picture'] == None:
                print("empty")
                useraccount = json.loads(json.dumps(UserSerializer(request.user).data))
                userdetail = UserDetail.objects.get(User_detail_id=useraccount['User_detail_id'])
                del user_data['id']
                del user_data['username']
                del user_data['email']
                del user_data['Profile_picture']
                userdetailserializer = UserDetailSerializer(userdetail, data=user_data)
                if userdetailserializer.is_valid():
                    userdetailserializer.save()
                    return Response(userdetailserializer.data)
            else:
                print("not empty")
                if os.path.isdir(os.path.join(settings.MEDIA_ROOT))==False:
                    os.mkdir(os.path.join(settings.MEDIA_ROOT))
                else:
                    pass
                if os.path.isdir(os.path.join(settings.MEDIA_ROOT,'Account_Media'))==False:
                    os.mkdir(os.path.join(settings.MEDIA_ROOT,'Account_Media'))
                else:
                    pass
                if os.path.isdir(os.path.join(settings.MEDIA_ROOT,'Account_Media','Profile_Picture'))==False:
                    os.mkdir(os.path.join(settings.MEDIA_ROOT,'Account_Media','Profile_Picture'))
                else:
                    pass
                profile_picture_path = os.path.join(settings.MEDIA_ROOT,'Account_Media','Profile_Picture',str(user_data['User_detail_id']))
                print(os.path.isdir(profile_picture_path))
                if os.path.isdir(profile_picture_path)==False:
                    os.mkdir(profile_picture_path)
                    print(profile_picture_path)
                else:
                    pass
                shutil.rmtree(os.path.join(settings.MEDIA_ROOT,'Account_Media','Profile_Picture',str(user_data['User_detail_id'])))

                fs = FileSystemStorage()
                fs.save(os.path.join(profile_picture_path, str(request.data['Profile_picture'])), request.data['Profile_picture'])

                useraccount = json.loads(json.dumps(UserSerializer(request.user).data))
                userdetail = UserDetail.objects.get(User_detail_id=useraccount['User_detail_id'])
                del user_data['id']
                del user_data['username']
                del user_data['email']
                user_data['Profile_picture'] = str(os.path.join(settings.MEDIA_URL,'Account_Media','Profile_Picture',str(user_data['User_detail_id']), str(request.data['Profile_picture'])))
                userdetailserializer = UserDetailSerializer(userdetail, data=user_data)
                if userdetailserializer.is_valid():
                    userdetailserializer.save()
                    return Response(userdetailserializer.data)
        except:
            return Response(
                {'error': 'Something went wrong when updating user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class UserDetailView (APIView):
    def get(self, request,pk=None):
        if pk:
            UserDetailData = UserDetail.objects.get(pk=pk)
            serializer = UserDetailSerializer(UserDetailData)
            return Response(serializer.data)
        else:
            useraccount = json.loads(json.dumps(UserSerializer(request.user).data))
            userdetail = json.loads(json.dumps(UserDetailSerializer(UserDetail.objects.get(User_detail_id=useraccount['User_detail_id'])).data))
            UserDetailData  = UserDetail.objects.all() if userdetail['Role'] == 1 else UserDetail.objects.filter(Organization=userdetail['Organization'])
            UserDetailData = UserDetailData if userdetail['Role'] == 8 | userdetail['Role'] == 9  else UserDetail.objects.filter(Organization=userdetail['Organization']).filter(Q(Plantation=userdetail['Plantation']) | Q(Plantation__isnull=True))
            serializer = UserDetailSerializer(UserDetailData, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = UserDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        UserDetailData = UserDetail.objects.get(pk=pk)
        serializer = UserDetailSerializer(UserDetailData, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        UserDetailData = UserDetail.objects.get(pk=pk)
        UserDetailData.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RoleView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request,pk=None):
        if pk is not None:
            roleData = Role.objects.get(Role, pk=pk)
            serializer = RoleSerializer(roleData)
            return Response(serializer.data)
        else:
            roleData = Role.objects.all()
            serializer = RoleSerializer(roleData, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = Role(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        roleData = Role.objects.get(pk=pk)
        serializer = Role(roleData, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        roleData = Role.objects.get(pk=pk)
        roleData.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
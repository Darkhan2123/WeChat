from django.http import Http404
from django.shortcuts import render
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, CustomUserSerializer
from .models import User
import jwt, datetime

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()

        response.set_cookie('jwt', token, httponly=True)
        response.data = {
            'jwt': token
        }

        return response

class UserView(APIView):
    def get_object(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, id, format=None):
        user = self.get_object(id)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
'''
class HomeView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated due to expired token')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)
'''

class ChatView(APIView):
    def get(self, request):
        # Authentication check
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        # Assuming you have a model or method to fetch chat data
        # For demonstration, let's say it's fetching all users as a placeholder
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()

        response.delete_cookie('jwt')
        response.data = {
            'message': 'You have been logged out.'
        }

        return response

        
        # testing

class HomeView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)



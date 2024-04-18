from django.db.models import Q
from django.http import Http404
from rest_framework import permissions, status, exceptions, authentication
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

class LogoutView(APIView):
    def post(self, request):
        response = Response()

        response.delete_cookie('jwt')
        response.data = {
            'message': 'You have been logged out.'
        }

        return response

class UserSearchView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        query = request.query_params.get('query')
        if not query:
            raise Http404('Please enter a query')

        users = User.objects.filter(Q(name__icontains=query) | Q(email__icontains=query))
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

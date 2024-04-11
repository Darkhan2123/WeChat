from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, HomeView, ChatView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/<int:id>/', UserView.as_view(), name='user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('home/', HomeView.as_view(), name='home'),
    path('chat/', ChatView.as_view(), name='chat'),
]
from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserSearchView, AvailableUsersView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('search_user/', UserSearchView.as_view(), name='search_user'),
    path('users/', AvailableUsersView.as_view(), name='users'),
]
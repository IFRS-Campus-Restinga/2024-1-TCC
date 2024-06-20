"""
URL configuration for meutcc project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from meutcc.views import GoogleAuthView, GoogleAuthCallbackView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.views import APIView
from rest_framework.response import Response

from .env_settings import FRONTEND_URL, APP_URL

class TesteView(APIView):
    def get(self, request):
        return Response({
            "frontend_url": FRONTEND_URL,
            "app_url": APP_URL
        }, status=200)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('app.urls')),
    path('auth-google', GoogleAuthView.as_view(), name='auth_google'),
    path('oauth2callback', GoogleAuthCallbackView.as_view(), name='google_callback'),
    path('teste', TesteView.as_view(), name='teste'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

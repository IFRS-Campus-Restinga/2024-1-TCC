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
from meutcc.views import GoogleAuthView, GoogleAuthCallbackView, GoogleDriveView, GoogleDriveCallbackView, GoogleDriveUploadBasicView
from django.conf import settings
from django.conf.urls.static import static
from .views.logout import LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('app.urls')),
    path('superadmin/', include('app.superadmin_urls')),  # Inclui as rotas de SuperAdmin
    path('auth-google', GoogleAuthView.as_view(), name='auth_google'),
    path('oauth2callback', GoogleAuthCallbackView.as_view(), name='google_callback'),
    path('auth-google-drive', GoogleDriveView.as_view(), name='auth_google_drive'),
    path('drive_oauth2callback', GoogleDriveCallbackView.as_view(), name='google_drive_callback'),
    path('upload_basic', GoogleDriveUploadBasicView.as_view(), name='upload_basic'),
    path('logout', LogoutView.as_view(), name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

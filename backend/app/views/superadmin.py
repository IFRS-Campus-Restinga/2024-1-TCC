from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from app.models.superadmin import SuperAdmin
from app.models.curso import Curso
from app.permissions import IsSuperAdmin
from app.views.custom_api_view import CustomAPIView
from rest_framework.authtoken.models import Token
import logging
logger = logging.getLogger(__name__)

class SuperAdminLoginView(APIView):
    """
    View para autenticação de SuperAdmins com Tokens.
    """

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email e senha são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Autenticar o superadmin
        superadmin = authenticate(request=request, username=email, password=password)

        if superadmin:
            try:
                # Tentar localizar o SuperAdmin relacionado ao usuário
                user = superadmin.user

                # Gerar ou obter o token
                token, created = Token.objects.get_or_create(user=user)

                return Response(
                    {
                        "message": "Login bem-sucedido!",
                        "token": token.key,
                    },
                    status=status.HTTP_200_OK,
                )
            except SuperAdmin.DoesNotExist:
                # O usuário não está relacionado a um SuperAdmin
                return Response(
                    {"error": "Este usuário não tem permissões de SuperAdmin."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Retornar erro caso a autenticação falhe
        return Response(
            {"error": "Credenciais inválidas ou usuário não autorizado."},
            status=status.HTTP_401_UNAUTHORIZED
        )

from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from app.models import Usuario, User
from app.serializers import UsuarioPolymorphicSerializer

class DetalhesUsuario(CustomAPIView):
    """
    API para obter os detalhes do usuário autenticado.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        get(request, format=None): Obtém os detalhes do usuário autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Obtém os detalhes do usuário autenticado.

        Args:
            request (Request): A requisição HTTP.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP com os detalhes do usuário ou status de erro.
        """
        try:
            usuario = Usuario.objects.get(user=request.user)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            user = User.objects.get(pk=request.user.id)
            return Response({'cadastroIncompleto': True})
                    

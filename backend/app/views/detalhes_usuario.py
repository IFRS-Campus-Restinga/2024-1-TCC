from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from app.models import Usuario, User, SuperAdmin
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
            # Tenta buscar o usuário no modelo Usuario
            usuario = Usuario.objects.get(user=request.user)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)

        except Usuario.DoesNotExist:
            try:
                # Tenta buscar o usuário no modelo SuperAdmin
                superadmin = SuperAdmin.objects.get(user=request.user)
                return Response({
                    "id": superadmin.user.id,
                    "email": superadmin.user.email,
                    "resourcetype": "SuperAdmin"
                })
            except SuperAdmin.DoesNotExist:
                # Caso o usuário não seja encontrado em nenhum dos dois modelos
                try:
                    user = User.objects.get(pk=request.user.id)
                    return Response({'cadastroIncompleto': True})
                except User.DoesNotExist:
                    # Retorna erro caso o usuário não exista de forma alguma
                    return Response({
                        "error": "Usuário não encontrado."
                    }, status=status.HTTP_404_NOT_FOUND)

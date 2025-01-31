from rest_framework.permissions import BasePermission
from app.models import SuperAdmin, Coordenador

class IsSuperAdmin(BasePermission):
    """
    Permissão personalizada para verificar se o usuário autenticado é um SuperAdmin.
    """

    def has_permission(self, request, view):
        # Verifica se o usuário está autenticado
        if not request.user or not request.user.is_authenticated:
            return False

        # Verifica se o usuário está relacionado a um SuperAdmin
        return SuperAdmin.objects.filter(user=request.user).exists()

class IsSuperAdminOrCoordenador(BasePermission):
    """
    Permissão personalizada para SuperAdmin e Coordenador.
    """

    def has_permission(self, request, view):
        user = request.user

        # Verifica se o usuário é um SuperAdmin
        if SuperAdmin.objects.filter(user=user).exists():
            return True

        # Verifica se o usuário é um Coordenador
        try:
            coordenador = Coordenador.objects.get(user=user)

            # Obtém o ID do curso da URL
            curso_id = view.kwargs.get('curso_id')

            # Caso o curso_id seja fornecido, verifica se corresponde ao curso do Coordenador
            if curso_id:
                return coordenador.curso.id == int(curso_id)

            # Se não houver curso_id, permite o acesso (para listagem, etc.)
            return True
        except Coordenador.DoesNotExist:
            return False

        # Caso não seja SuperAdmin nem Coordenador, nega o acesso
        return False
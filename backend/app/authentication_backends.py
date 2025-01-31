from django.contrib.auth.backends import ModelBackend
from app.models.superadmin import SuperAdmin

class SuperAdminBackend(ModelBackend):
    """
    Backend de autenticação exclusivo para SuperAdmin.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username or not password:
            return None

        try:
            # Busca o SuperAdmin pelo email
            superadmin = SuperAdmin.objects.get(email=username)
            # Verifica se a senha está correta
            if superadmin.check_password(password) and self.user_can_authenticate(superadmin):
                return superadmin  # Retorna o SuperAdmin
        except SuperAdmin.DoesNotExist:
            return None

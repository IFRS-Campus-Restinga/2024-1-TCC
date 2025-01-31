from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

class BearerJWTAuthentication(BaseAuthentication):
    """
    Autenticação para tokens JWT no formato Bearer.
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            # Valida o token JWT
            payload = AccessToken(token)
            user = self._get_user_from_payload(payload)
            return (user, token)
        except Exception:
            raise AuthenticationFailed('Token JWT inválido ou expirado.')

    def _get_user_from_payload(self, payload):
        from django.contrib.auth.models import User  # Ajuste para seu modelo de usuário
        try:
            return User.objects.get(id=payload['user_id'])
        except User.DoesNotExist:
            raise AuthenticationFailed('Usuário não encontrado.')

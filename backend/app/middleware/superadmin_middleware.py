from django.http import JsonResponse
from django.contrib.auth import logout

class SuperAdminMiddleware:
    """
    Middleware para isolar rotas do SuperAdmin.
    Garante que apenas SuperAdmins podem acessar as rotas `/adminapp/`.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/adminapp/'):
            # Verifica se o middleware de autenticação já adicionou o atributo user
            if hasattr(request, 'user') and request.user.is_authenticated:
                if not hasattr(request.user, 'superadmin'):
                    # Logout do usuário não autorizado
                    logout(request)
                    return JsonResponse(
                        {'error': 'Sessão de outro sistema detectada. Faça login novamente como SuperAdmin.'},
                        status=403
                    )
        return self.get_response(request)

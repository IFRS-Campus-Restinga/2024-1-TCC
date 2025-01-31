from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class LogoutView(APIView):
    """
    API para logout do usuário. Remove o token de autenticação ativo.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Realiza o logout do usuário autenticado, removendo o token.
        """
        try:
            # Remove o token para invalidar o login
            request.user.auth_token.delete()
            return Response({"message": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Erro ao realizar logout: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

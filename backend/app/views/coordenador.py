from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from app.models import Coordenador, Curso
from app.serializers import CoordenadorSerializer
from app.permissions import IsSuperAdmin

class ListarCoordenadoresView(APIView):
    """
    View para listar todos os coordenadores.

    Permissões:
        - Apenas usuários com a permissão IsSuperAdmin.

    Retorno:
        - Lista de coordenadores com os campos: id, nome, email e curso (ID).
    """
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        coordenadores = Coordenador.objects.all()
        serializer = CoordenadorSerializer(coordenadores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdicionarCursoCoordenadorView(APIView):
    """
    View para adicionar um curso a um coordenador.

    Permissões:
        - Apenas usuários com a permissão IsSuperAdmin.

    Parâmetros esperados:
        - coordenador_id (path): ID do coordenador.
        - curso_id (body): ID do curso a ser associado.

    Retorno:
        - Mensagem de sucesso ou erro junto com a lista atualizada de coordenadores.
    """
    permission_classes = [IsSuperAdmin]

    def post(self, request, coordenador_id):
        try:
            coordenador = Coordenador.objects.get(id=coordenador_id)
            curso_id = request.data.get('curso_id')
            if not curso_id:
                return Response({"error": "O ID do curso é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

            curso = Curso.objects.get(id=curso_id)
            coordenador.curso = curso
            coordenador.save()

            # Listar coordenadores atualizados
            coordenadores = Coordenador.objects.all()
            serializer = CoordenadorSerializer(coordenadores, many=True)

            return Response({
                "message": "Curso atribuído ao coordenador com sucesso.",
                "coordenadores": serializer.data
            }, status=status.HTTP_200_OK)
        except Coordenador.DoesNotExist:
            return Response({"error": "Coordenador não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Curso.DoesNotExist:
            return Response({"error": "Curso não encontrado."}, status=status.HTTP_404_NOT_FOUND)


class LimparCursoCoordenadorView(APIView):
    """
    View para limpar o campo de curso do coordenador.

    Permissões:
        - Apenas usuários com a permissão IsSuperAdmin.

    Parâmetros esperados:
        - coordenador_id (path): ID do coordenador.

    Retorno:
        - Mensagem de sucesso ou erro junto com a lista atualizada de coordenadores.
    """
    permission_classes = [IsSuperAdmin]

    def post(self, request, coordenador_id):
        try:
            coordenador = Coordenador.objects.get(id=coordenador_id)
            coordenador.curso = None
            coordenador.save()

            # Listar coordenadores atualizados
            coordenadores = Coordenador.objects.all()
            serializer = CoordenadorSerializer(coordenadores, many=True)

            return Response({
                "message": "Curso removido do coordenador com sucesso.",
                "coordenadores": serializer.data
            }, status=status.HTTP_200_OK)
        except Coordenador.DoesNotExist:
            return Response({"error": "Coordenador não encontrado."}, status=status.HTTP_404_NOT_FOUND)
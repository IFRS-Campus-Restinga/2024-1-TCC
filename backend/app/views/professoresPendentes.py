from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import Professor, StatusCadastro
from app.serializers import UsuarioPolymorphicSerializer
from rest_framework.permissions import IsAuthenticated

class ProfessoresPendentesListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        professores_pendentes = Professor.objects.filter(status__aprovacao=False, status__justificativa=None)
        serializer = UsuarioPolymorphicSerializer(professores_pendentes, many=True)
        return Response(serializer.data)

class AprovarProfessorAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, idProfessor, format=None):
        try:
            professor = Professor.objects.get(id=idProfessor)
            status_cadastro = professor.status
            status_cadastro.aprovacao = True
            status_cadastro.save()
            return Response({'message': 'Professor aprovado com sucesso!'}, status=status.HTTP_200_OK)
        except Professor.DoesNotExist:
            return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except StatusCadastro.DoesNotExist:
            return Response({'error': 'Status de cadastro não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

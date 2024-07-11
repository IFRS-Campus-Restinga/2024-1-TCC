from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from datetime import datetime, date
from ..models import Semestre, SemestreCoordenador, ProfessorInterno
from ..serializers import SemestreSerializer, SemestreCoordenadorSerializer, SemestreDatasSerializer, CriarSemestreSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class SemestreDatasView(APIView):
    def get(self, request):
        semestre_atual = Semestre.semestre_atual()

        if semestre_atual:
            serializer = SemestreDatasSerializer(semestre_atual)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
class SemestreAtualView(APIView):
    def get(self, request):
        semestre_atual = Semestre.semestre_atual()
        
        if semestre_atual:
            semestre_serializer = SemestreSerializer(semestre_atual).data
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                semestre_serializer['semestreCoordenador'] = semestre_coordenador_serializer
            
            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class CoordenadorAtualView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        semestre_atual = Semestre.semestre_atual()

        if semestre_atual:
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
            return Response(semestre_coordenador_serializer, status=status.HTTP_200_OK)
        else:
            semestre = Semestre.objects.order_by('-dataFechamentoSemestre', '-id').first()
            if semestre:
                semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre).order_by('-dataAlteracao', '-id').first()
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                return Response(semestre_coordenador_serializer, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        

class SemestreView(APIView):
    def get(self, request, semestreid):
        semestre = Semestre.objects.get(pk=semestreid)
        
        if semestre:
            semestre_serializer = SemestreSerializer(semestre).data
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre).order_by('-dataAlteracao', '-id').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                semestre_serializer['semestreCoordenador'] = semestre_coordenador_serializer
            
            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class SemestreAtualCoordenadoresView(APIView):

    def get(self, request):
        semestre_atual = Semestre.semestre_atual()
        
        if semestre_atual:
            semestre_coordenadores = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id')
            if semestre_coordenadores:
                semestre_coordenadores_serialized = SemestreCoordenadorSerializer(semestre_coordenadores, many=True).data
                return Response(semestre_coordenadores_serialized, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Nenhum coordenador encontrado para o semestre atual."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
class SemestreCoordenadoresView(APIView):

    def get(self, request, semestreid):
        semestre = Semestre.objects.get(pk=semestreid)
        
        if semestre:
            semestre_coordenadores = SemestreCoordenador.objects.filter(semestre=semestre).order_by('-dataAlteracao', '-id')
            if semestre_coordenadores:
                semestre_coordenadores_serialized = SemestreCoordenadorSerializer(semestre_coordenadores, many=True).data
                return Response(semestre_coordenadores_serialized, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Nenhum coordenador encontrado para o semestre."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Semestre não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class AlterarCoordenadorSemestre(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        try:
            id_professor = request.data.get('coordenador')
            semestre_atual = Semestre.semestre_atual()

            if semestre_atual:
                professor = ProfessorInterno.objects.get(id=id_professor)
                semestre_coordenador = SemestreCoordenador.objects.create(semestre=semestre_atual, coordenador=professor, dataAlteracao=datetime.now())
                semestre_coordenador.save()
                return Response({'message': 'Coordenador atualizado com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Semestre atual não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except ProfessorInterno.DoesNotExist:
            return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)


class AtualizarDatasPropostasView(APIView):
    def put(self, request):
        try:
            data = request.data

            semestreDatas = Semestre.semestre_atual()

            if 'dataAberturaPrazoPropostas' in data:
                semestreDatas.dataAberturaPrazoPropostas = date.fromisoformat(data['dataAberturaPrazoPropostas'])
            if 'dataFechamentoPrazoPropostas' in data:
                semestreDatas.dataFechamentoPrazoPropostas = date.fromisoformat(data['dataFechamentoPrazoPropostas'])

            semestreDatas.save()

            serializer = SemestreDatasSerializer(semestreDatas)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

class SemestresView(APIView):
    def get(self, request):
        semestres = Semestre.objects.order_by('-dataAberturaSemestre', ).all()
        serializer = SemestreSerializer(semestres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CriarSemestreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        # Extrair os dados do corpo da solicitação
        dados_semestre = request.data.get('semestre', {})
        coordenador_id = request.data.get('coordenador_id', None)

        # Serializar os dados do semestre
        serializer_semestre = CriarSemestreSerializer(data=dados_semestre)
        if serializer_semestre.is_valid():
            novo_semestre = serializer_semestre.validated_data

            # Verificar se existem semestres existentes com datas sobrepostas
            semestres_sobrepostos = Semestre.objects.filter(
                Q(dataAberturaSemestre__range=[novo_semestre['dataAberturaSemestre'], novo_semestre['dataFechamentoSemestre']]) |
                Q(dataFechamentoSemestre__range=[novo_semestre['dataAberturaSemestre'], novo_semestre['dataFechamentoSemestre']])
            )
            if semestres_sobrepostos.exists():
                return Response({'error': 'As datas do semestre estão sobrepostas com semestres existentes.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verificar se o coordenador existe
            coordenador = ProfessorInterno.objects.filter(id=coordenador_id).first()
            if coordenador:
                # Criar e salvar o objeto SemestreCoordenador
                semestre = serializer_semestre.save()
                semestre_coordenador = SemestreCoordenador.objects.create(
                    coordenador=coordenador,
                    semestre=semestre
                )
                return Response(serializer_semestre.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'O coordenador especificado não foi encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer_semestre.errors, status=status.HTTP_400_BAD_REQUEST)

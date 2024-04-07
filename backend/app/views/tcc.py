from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Max, F, Q
from app.enums import StatusTccEnum, UsuarioTipoEnum
from app.models import Tcc, TccStatus, Usuario, Estudante, Semestre
from app.serializers import TccSerializer, TccCreateSerializer, TccStatusResponderPropostaSerializer
from app.services.proposta import PropostaService

class ListarTccPendente(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Usuario.objects.get(user=request.user)
        semestreAtual = Semestre.objects.latest('id')
        tccs = None
        if usuario.tipo == UsuarioTipoEnum.COORDENADOR: 
            tccs = Tcc.objects.all().annotate(max_id=Max('tccstatus__id')).filter(
                tccstatus__id=F('max_id'), 
                semestre=semestreAtual, 
                tccstatus__status=StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR)
        elif usuario.isProfessor():
            tccs = Tcc.objects.all().annotate(max_id=Max('tccstatus__id')).filter(
                Q(orientador=usuario) | Q(coorientador=usuario),
                tccstatus__id=F('max_id'), 
                semestre=semestreAtual,
                tccstatus__status=StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR
            )

        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    
class MeusTCCs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Usuario.objects.get(user=request.user)
        tccs = Tcc.objects.filter(autor = usuario)
        
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
        
class CriarTCCView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            usuario = Estudante.objects.get(user=request.user)
            serializer = TccCreateSerializer(data=request.data)

            # Pega o ultimo semestre cadastrado
            semestreAtual = Semestre.objects.latest('id')

            if not serializer.is_valid():
                print (serializer.errors)
                return Response(serializer.errors, status=400)
                
            tcc = Tcc.objects.create(autor = usuario, semestre = semestreAtual, **serializer.validated_data)

            tccstatus = TccStatus.objects.create(tcc_id=tcc.id, status=StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Estudante.DoesNotExist:
            return Response({'message': 'Usuário não é um estudante!'}, status=403)
        

class TccStatusResponderPropostaView(APIView):
    permission_classes = [IsAuthenticated]
    propostaService = PropostaService()

    def post(self, request, tccId):
        serializer = TccStatusResponderPropostaSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        usuario = Usuario.objects.get(user=request.user)

        self.propostaService.responderProposta(tccId, usuario, serializer)
        
        return Response({'message': 'Status atualizado com sucesso!'})

    
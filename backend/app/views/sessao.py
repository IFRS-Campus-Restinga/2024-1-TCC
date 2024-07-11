from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from datetime import datetime, date
from ..models import Banca, Sessao, SessaoPrevia, SessaoFinal, Tcc, Usuario
from ..serializers import SessaoFuturaSerializer
from rest_framework.permissions import IsAuthenticated
from app.services.notificacoes import notificacaoService
from app.services.sessao import SessaoService
from datetime import date, datetime, time, timedelta
from dateutil.parser import parse

class SessoesFuturasView(APIView):
    def get(self, request):
        sessoes = Sessao.objects.filter(
                data_inicio__gt=datetime.now(),
                validacaoOrientador=True
            )
    
        sessoes_serializer = SessaoFuturaSerializer(sessoes, many=True).data
        return Response(sessoes_serializer, status=status.HTTP_200_OK)
    
class SessoesFuturasOrientadorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            usuario = Usuario.objects.get(user=request.user)
            tccs_do_orientador = Tcc.objects.filter(orientador=usuario)

            # Filtra as sessões futuras dos TCCs do orientador
            sessoes = Sessao.objects.filter(
                tcc__in=tccs_do_orientador,
                data_inicio__gt=datetime.now(),
            )
            
            serializer = SessaoFuturaSerializer(sessoes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
class SessaoEditView(APIView):
    notificacaoService = notificacaoService()
    def put(self, request):
        try:
            data = request.data
            id_sessao = data.get('idSessao')
            sessao_atualizada = Sessao.objects.get(pk=id_sessao)
            banca_atualizada = Banca.objects.filter(sessao=sessao_atualizada).first()
            if not banca_atualizada:
                return Response("Banca não encontrada para esta sessão", status=status.HTTP_400_BAD_REQUEST)
            
            professores_atualizados = []
            if 'avaliador1' in data:
                professores_atualizados.append(data['avaliador1'])
            if 'avaliador2' in data:
                professores_atualizados.append(data['avaliador2'])
            banca_atualizada.professores.set(professores_atualizados)
            
            if 'local' in data:
                sessao_atualizada.local = data['local']
            if 'dataInicio' in data:
                sessao_atualizada.data_inicio = data['dataInicio']
            sessao_atualizada.validacaoCoordenador = True
            self.notificacaoService.enviarNotificacaoAgendamentoBanca(request.user, sessao_atualizada, banca_atualizada)
            sessao_atualizada.save()

        except Sessao.DoesNotExist:
            return Response("Sessão não encontrada", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        return Response("Sessão atualizada com sucesso", status=status.HTTP_200_OK)
    
class SessaoEditOrientadorView(APIView):
    def put(self, request):
        try:
            data = request.data
            id_sessao = data.get('idSessao')
            sessao_atualizada = Sessao.objects.get(pk=id_sessao)
            banca_atualizada = Banca.objects.filter(sessao=sessao_atualizada).first()
            if not banca_atualizada:
                return Response("Banca não encontrada para esta sessão", status=status.HTTP_400_BAD_REQUEST)
            
            professores_atualizados = []
            if 'avaliador1' in data:
                professores_atualizados.append(data['avaliador1'])
            if 'avaliador2' in data:
                professores_atualizados.append(data['avaliador2'])
            banca_atualizada.professores.set(professores_atualizados)
            
            if 'local' in data:
                sessao_atualizada.local = data['local']
            if 'dataInicio' in data:
                sessao_atualizada.data_inicio = data['dataInicio']
            sessao_atualizada.validacaoOrientador = True
            sessao_atualizada.save()

        except Sessao.DoesNotExist:
            return Response("Sessão não encontrada", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        return Response("Sessão atualizada com sucesso", status=status.HTTP_200_OK)

class SessaoCreateView(APIView):
    notificacaoService = notificacaoService()
    sessaoService = SessaoService()

    def post(self, request):
        try:
            data = request.data

            tcc = data['idTCC']

            if data['tipo'] == 'previa' and SessaoPrevia.objects.filter(tcc__id=tcc).exists():
                return Response("Já existe uma sessão de prévia para este TCC", status=status.HTTP_400_BAD_REQUEST)
            
            if data['tipo'] == 'final' and SessaoFinal.objects.filter(tcc__id=tcc).exists():
                return Response("Já existe uma sessão final para este TCC", status=status.HTTP_400_BAD_REQUEST)

            dataInicio = parse(data['dataInicio'])
            dataTermino = dataInicio + timedelta(days=7)
            local = data['localDescricao']
            formaApresentacao = data['localForma']
            prazoEntregaDocumento = dataInicio + timedelta(days=14)
            avaliador1 = data['avaliador1']
            avaliador2 = data['avaliador2']
            tccInstance = Tcc.objects.get(pk=tcc)

            sessao = None
            if data['tipo'] == 'previa':
                sessao = SessaoPrevia.objects.create(
                    data_inicio = dataInicio,
                    data_termino = dataTermino,
                    local = local,
                    forma_apresentacao = formaApresentacao,
                    prazoEntregaDocumento = prazoEntregaDocumento,
                    tcc = tccInstance
                )
            elif data['tipo'] == 'final':
                sessao = SessaoFinal.objects.create(
                    data_inicio = dataInicio,
                    data_termino = dataTermino,
                    local = local,
                    forma_apresentacao = formaApresentacao,
                    prazoEntregaDocumento = prazoEntregaDocumento,
                    tcc = tccInstance
                )

            banca = Banca.objects.create(
                sessao=sessao,
            )

            banca.professores.set([avaliador1, avaliador2])

            self.notificacaoService.enviarNotificacaoAgendamentoBanca(request.user, sessao, banca)

            return Response("Sessão criada com sucesso", status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
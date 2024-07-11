from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from app.enums import CriteriosEnum
from app.models import Professor, SessaoFinal, Banca, Avaliacao, Nota
from app.services import TccService
from app.enums import StatusTccEnum

class Avaliar(APIView):
    permission_classes = [IsAuthenticated]
    tccService = TccService()
    def post(self, request, sessaoId):
        try:
            user = request.user
            sessao = SessaoFinal.objects.get(id=sessaoId)
            banca = Banca.objects.get(sessao=sessao)
            professor = Professor.objects.get(user=user)
            orientador = sessao.tcc.orientador
            avaliacao = sessao.avaliacao
        except SessaoFinal.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        is_orientador = user == orientador.user
        is_in_banca = any(professor.user == user for professor in banca.professores.all())

        if not is_orientador and not is_in_banca:
            return Response({"error": "Você não tem permissão para avaliar este TCC."}, status=status.HTTP_403_FORBIDDEN)

        if (is_orientador and avaliacao.nota_orientador is not None) or (user == banca.professores.all()[0].user and avaliacao.nota_avaliador1 is not None) or (user == banca.professores.all()[1].user and avaliacao.nota_avaliador2 is not None):
            return Response({"error": "Você já avaliou este TCC."}, status=status.HTTP_400_BAD_REQUEST)

        notas = []
        try:
            for criterio in CriteriosEnum:
                nota_valor = float(request.data.get(criterio.name.lower(), 0))
                Nota.objects.create(
                    avaliacao=avaliacao,
                    professor=professor,
                    criterio=criterio,
                    nota=nota_valor
                )
                notas.append(nota_valor)
            soma_notas = round(sum(notas), 2)

        except KeyError as e:
            return Response({'status': 'error', 'message': f'Nota para o critério {e} não encontrada'},
                            status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'status': 'error', 'message': 'Valor da nota inválido'},
                            status=status.HTTP_400_BAD_REQUEST)

        if is_orientador:
            if request.data.get('adequacoes'):
                avaliacao.ajuste = True
                data_entrega = request.data.get('data_entrega')
                horario_entrega = request.data.get('horario_entrega')
                if data_entrega and horario_entrega:
                    try:
                        avaliacao.data_entrega_ajuste = timezone.datetime.strptime(f"{data_entrega} {horario_entrega}","%m/%d/%Y %H:%M")
                    except ValueError as e:
                        return Response({'status': 'error', 'message': f'Erro ao converter data e hora: {e}'}, status=status.HTTP_400_BAD_REQUEST)
                avaliacao.descricao_ajuste = request.data.get('adequacoes_necessarias', avaliacao.descricao_ajuste)
                self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.AJUSTE)
                avaliacao.save()
            avaliacao.comentarios_orientador = request.data.get('comentarios_adicionais',avaliacao.comentarios_orientador)
            avaliacao.nota_orientador = soma_notas
        elif is_in_banca:
            if user == banca.professores.all()[0].user:
                avaliacao.comentarios_avaliador1 = request.data.get('comentarios_adicionais', avaliacao.comentarios_avaliador1)
                avaliacao.nota_avaliador1 = soma_notas
            elif user == banca.professores.all()[1].user:
                avaliacao.comentarios_avaliador2 = request.data.get('comentarios_adicionais', avaliacao.comentarios_avaliador2)
                avaliacao.nota_avaliador2 = soma_notas

        if avaliacao.nota_orientador is not None and avaliacao.nota_avaliador1 is not None and avaliacao.nota_avaliador2 is not None:
            avaliacao.media_final = round(((avaliacao.nota_orientador + avaliacao.nota_avaliador1 + avaliacao.nota_avaliador2) / 3), 2)
            avaliacao.data_avaliacao = timezone.now()
            if avaliacao.ajuste is False:
                if avaliacao.media_final >= 7:
                    self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.APROVADO)
                else:
                    self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.REPROVADO_FINAL, "Não atingiu a média necessária")

        avaliacao.save()
        return Response({'status': 'success', 'message': 'Avaliação cadastrada com sucesso.'}, status=status.HTTP_201_CREATED)

class AvaliarAjustes(APIView):
    permission_classes = [IsAuthenticated]
    tccService = TccService()
    def post(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            sessao = SessaoFinal.objects.get(avaliacao=avaliacao)
            orientador = sessao.tcc.orientador
            user = request.user
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        is_orientador = user == orientador.user

        if not is_orientador:
            return Response({"error": "Você não tem permissão para avaliar este TCC."}, status=status.HTTP_403_FORBIDDEN)

        avaliacao.parecer_orientador = request.data.get('parecer_orientador')
        if request.data.get('ajuste_aprovado'):
            self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.APROVADO)
        else:
            self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.REPROVADO_FINAL, request.data.get('parecer_orientador'))

        avaliacao.save()
        return Response({'status': 'success', 'message': 'Avaliação cadastrada com sucesso.'}, status=status.HTTP_201_CREATED)




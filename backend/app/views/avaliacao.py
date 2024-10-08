from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from app.enums import CriteriosEnum
from app.models import Professor, SessaoFinal, Banca, Avaliacao, Nota
from app.services import TccService
from app.enums import StatusTccEnum
from django.db.models import Sum

class Avaliar(CustomAPIView):
    """
    API para avaliar um TCC.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        post(request, sessaoId): Avalia o TCC da sessão especificada.
    """
    permission_classes = [IsAuthenticated]
    tccService = TccService()
    def post(self, request, sessaoId):
        """
        Avalia o TCC da sessão especificada.

        Args:
            request (Request): A requisição HTTP contendo os dados da avaliação.
            sessaoId (int): ID da sessão a ser avaliada.

        Retorna:
            Response: Resposta HTTP com o status da avaliação.
        """
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
            return Response({'status': 'error', 'message': "Você não tem permissão para avaliar este TCC."}, status=status.HTTP_403_FORBIDDEN)

        if (is_orientador and avaliacao.avaliado_orientador) or (user == banca.professores.all()[0].user and avaliacao.avaliado_avaliador1) or (user == banca.professores.all()[1].user and avaliacao.avaliado_avaliador2):
            return Response({'status': 'error', 'message': "Você já avaliou este TCC."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            for criterio in CriteriosEnum:
                nota_valor = float(request.data.get(criterio.name.lower(), 0))
                Nota.objects.create(
                    avaliacao=avaliacao,
                    professor=professor,
                    criterio=criterio,
                    nota=nota_valor
                )

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
            avaliacao.avaliado_orientador = True
        elif is_in_banca:
            if user == banca.professores.all()[0].user:
                avaliacao.comentarios_avaliador1 = request.data.get('comentarios_adicionais', avaliacao.comentarios_avaliador1)
                avaliacao.avaliado_avaliador1 = True
            elif user == banca.professores.all()[1].user:
                avaliacao.comentarios_avaliador2 = request.data.get('comentarios_adicionais', avaliacao.comentarios_avaliador2)
                avaliacao.avaliado_avaliador2 = True

        if avaliacao.avaliado_orientador and avaliacao.avaliado_avaliador1 and avaliacao.avaliado_avaliador2:
            media_final = Nota.objects.filter(avaliacao=avaliacao).aggregate(Sum('nota'))['nota__sum'] / 3
            if avaliacao.ajuste is False:
                if media_final >= 7:
                    self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.APROVADO)
                else:
                    self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.REPROVADO_FINAL, "Não atingiu a média necessária")

        avaliacao.save()
        return Response({'status': 'success', 'message': 'Avaliação cadastrada com sucesso.'}, status=status.HTTP_201_CREATED)

class AvaliarAjustes(CustomAPIView):
    """
    API para avaliar os ajustes de um TCC.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        post(request, avaliacaoId): Avalia os ajustes de um TCC.
    """
    permission_classes = [IsAuthenticated]
    tccService = TccService()
    def post(self, request, avaliacaoId):
        """
        Avalia os ajustes de um TCC.

        Args:
            request (Request): A requisição HTTP contendo os dados da avaliação.
            avaliacaoId (int): ID da avaliação a ser avaliada.

        Retorna:
            Response: Resposta HTTP com o status da avaliação.
        """
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            sessao = SessaoFinal.objects.get(avaliacao=avaliacao)
            orientador = sessao.tcc.orientador
            user = request.user
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        is_orientador = user == orientador.user

        if not is_orientador:
            return Response({'status': 'error', 'message': "Você não tem permissão para avaliar este TCC."}, status=status.HTTP_403_FORBIDDEN)

        avaliacao.parecer_orientador = request.data.get('parecer_orientador')
        if request.data.get('resultado_ajuste') == 'true':
            self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.APROVADO)
        else:
            self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.REPROVADO_FINAL, request.data.get('parecer_orientador'))

        avaliacao.save()
        return Response({'status': 'success', 'message': 'Avaliação cadastrada com sucesso.'}, status=status.HTTP_201_CREATED)




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Max, F, Q
from app.enums import StatusTccEnum, UsuarioTipoEnum
from app.models import Tcc, TccStatus, Usuario, Estudante, Semestre, Professor, Coordenador, Sessao, Banca, Tema
from app.serializers import TccSerializer, TccCreateSerializer, TccStatusResponderPropostaSerializer, TemaSerializer
from app.services.proposta import PropostaService
from app.services.tcc import TccService
from app.services.notificacoes import notificacaoService
from .custom_api_view import CustomAPIView

class ListarTccPendente(CustomAPIView):
    """
    API para listar TCCs pendentes de aprovação.

    Métodos:
        get(request): Retorna os TCCs pendentes de aprovação.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna os TCCs pendentes de aprovação.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os TCCs pendentes ou mensagem de erro.
        """
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
    
class TCCs(CustomAPIView):
    """
    API para listar todos os TCCs.

    Métodos:
        get(request): Retorna todos os TCCs.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os TCCs.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os TCCs ou mensagem de erro.
        """
     
        tccs = Tcc.objects.all()
        serializer = TccSerializer(tccs, many=True)
        
        return Response(serializer.data)
    
class TCCsByAluno(CustomAPIView):
    """
    API para listar todos os TCCs de um aluno.

    Métodos:
        get(request): Retorna todos os TCCs do aluno autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os TCCs do aluno autenticado.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os TCCs do aluno ou mensagem de erro.
        """
        usuario = Usuario.objects.get(user=request.user)
        tccs = Tcc.objects.filter(autor = usuario)
        
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    

class TCCsByOrientador(CustomAPIView):
    """
    API para listar todos os TCCs de um orientador.

    Métodos:
        get(request): Retorna todos os TCCs do orientador autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os TCCs do orientador autenticado.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os TCCs do orientador ou mensagem de erro.
        """
        usuario = Usuario.objects.get(user=request.user)
        
        tccs = Tcc.objects.filter(Q(orientador=usuario) | Q(coorientador=usuario))
        
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    
class PossuiProposta(CustomAPIView):
    """
    API para verificar se um estudante possui proposta de TCC.

    Métodos:
        get(request): Verifica se o estudante autenticado possui proposta de TCC.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Verifica se o estudante autenticado possui proposta de TCC.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com a verificação ou mensagem de erro.
        """
        usuario = Estudante.objects.get(user=request.user)
        possuiProposta = TccService().possuiProposta(usuario)
        
        return Response({'possuiProposta': possuiProposta})
        
class CriarTCCView(CustomAPIView):
    """
    API para criar um novo TCC.

    Métodos:
        post(request): Cria um novo TCC.
    """
    permission_classes = [IsAuthenticated]
    tccService = TccService()
    notificacaoService = notificacaoService()

    def post(self, request):
        """
        Cria um novo TCC.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP confirmando a criação ou mensagem de erro.
        """
        
        # Validar "afirmo que conversei com o orientador e coorientador sobre o tema do TCC."
        try:
            usuario = Estudante.objects.get(user=request.user)
            serializer = TccCreateSerializer(data=request.data)

            if not serializer.is_valid():
                print (serializer.errors)
                return Response(serializer.errors, status=400) 
            
            if not request.data.get('afirmoQueConversei'):
                return Response({'message': 'Você deve afirmar que conversou com o orientador e coorientador sobre o tema do TCC.'}, status=400) 
                
            self.tccService.criarTcc(usuario, serializer)
            self.notificacaoService.enviarNotificacaoProposta(request.user, request.data)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Estudante.DoesNotExist:
            return Response({'status': 'error', 'message': 'Usuário não é um estudante!'}, status=403)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)
        

class TccStatusResponderPropostaView(CustomAPIView):
    """
    API para responder a uma proposta de TCC.

    Métodos:
        post(request, tccId): Responde a uma proposta de TCC.
    """
    permission_classes = [IsAuthenticated]
    propostaService = PropostaService()

    def post(self, request, tccId):
        """
        Responde a uma proposta de TCC.

        Args:
            request (Request): A requisição HTTP.
            tccId (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP confirmando a resposta ou mensagem de erro.
        """
        serializer = TccStatusResponderPropostaSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        usuario = Usuario.objects.get(user=request.user)

        self.propostaService.responderProposta(tccId, usuario, serializer)
        
        return Response({'status': 'success', 'message': 'Status atualizado com sucesso!'})


class EditarTCCView(CustomAPIView):
    """
    API para editar um TCC existente.

    Métodos:
        put(request, tccid): Edita um TCC existente.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, tccid):
        """
        Edita um TCC existente.

        Args:
            request (Request): A requisição HTTP.
            tccid (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP confirmando a edição ou mensagem de erro.
        """
        try:
            tcc = Tcc.objects.get(id=tccid)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if user == tcc.autor.user:
            tcc.tema = request.data.get('tema', tcc.tema)
            tcc.resumo = request.data.get('resumo', tcc.resumo)
            tcc.save()
            return Response({'status': 'success', 'message': 'TCC atualizado com sucesso.'})

        if user.is_superuser or Coordenador.objects.filter(user=user).exists():
            tcc.orientador = Professor.objects.get(id=request.data.get('orientador', tcc.orientador))
            if request.data.get('coorientador', tcc.coorientador) is not None:
                tcc.coorientador = Professor.objects.get(id=request.data.get('coorientador', tcc.coorientador))
            tcc.save()
            return Response({'status': 'success', 'message': 'TCC atualizado com sucesso.'})

        # Se o usuário não tiver permissão
        return Response({'status': 'error', "message": "Você não tem permissão para editar este TCC."}, status=status.HTTP_403_FORBIDDEN)


class DetalhesTCCView(CustomAPIView):
    """
    API para visualizar os detalhes de um TCC.

    Métodos:
        get(request, tccid, format=None): Retorna os detalhes de um TCC.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, tccid, format=None):
        """
        Retorna os detalhes de um TCC.

        Args:
            request (Request): A requisição HTTP.
            tccid (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP com os detalhes do TCC ou mensagem de erro.
        """
        bancas = []
        users_banca = []
        try:
            tcc = Tcc.objects.get(id=tccid)
        except Tcc.DoesNotExist:
            return Response({'status': 'error', "message": "TCC não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        if Sessao.objects.filter(tcc=tcc).exists():
            sessoes = Sessao.objects.filter(tcc=tcc)
            for sessao in sessoes:
                if Banca.objects.filter(sessao=sessao).exists():
                    bancas.append(Banca.objects.get(sessao=sessao))
            for banca in bancas:
                for professor in banca.professores.all():
                        users_banca.append(professor.user)
        user = request.user
        coord = Coordenador.objects.filter(user=user)
        if (str(user) == 'admin') or (user == tcc.autor.user) or (user == tcc.orientador.user) or (
                tcc.coorientador and user == tcc.coorientador.user) or (coord.exists()) or (user in users_banca):
            serializer = TccSerializer(tcc)
            return Response(serializer.data)
        else:
            return Response({'status': 'alert', "message": "Você não tem permissão para visualizar este TCC."},
                            status=status.HTTP_403_FORBIDDEN)
            
class TCCsPublicadosView(CustomAPIView):
    """
    API para listar todos os TCCs aprovados.

    Métodos:
        get(request): Retorna todos os TCCs aprovados.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """
        Retorna todos os TCCs aprovados.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os TCCs aprovados ou mensagem de erro.
        """
        tccs = Tcc.objects.filter(tccstatus__status=StatusTccEnum.APROVADO)
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)

class TemasSugeridosView(CustomAPIView):
    """
    API para listar todos os temas sugeridos.

    Métodos:
        get(request): Retorna todos os temas sugeridos.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os temas sugeridos.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os temas sugeridos ou mensagem de erro.
        """
        temas = Tema.objects.all()
        serializer = TemaSerializer(temas, many=True)
        return Response(serializer.data)

class MeusTemasSugeridosView(CustomAPIView):
    """
    API para listar todos os temas sugeridos por um professor.

    Métodos:
        get(request): Retorna todos os temas sugeridos pelo professor autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os temas sugeridos pelo professor autenticado.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com todos os temas sugeridos pelo professor ou mensagem de erro.
        """
        professor = Usuario.objects.get(user=request.user)
        temas = Tema.objects.filter(professor = professor)
        serializer = TemaSerializer(temas, many=True)
        return Response(serializer.data)
    
class CriarTemaView(CustomAPIView):
    """
    API para criar um novo tema.

    Métodos:
        post(request): Cria um novo tema.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Cria um novo tema.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP confirmando a criação ou mensagem de erro.
        """
        perfil = request.user.perfil
        if isinstance(perfil, Coordenador) or isinstance(perfil, Professor):
            usuario_id = request.user.id
        else:
            return Response({'status': 'error', "message": "Usuário não autorizado para criar um tema."}, status=status.HTTP_400_BAD_REQUEST)

class AtualizarTemaView(CustomAPIView):
    """
    API para atualizar um tema existente.

    Métodos:
        put(request, pk): Atualiza um tema existente.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        """
        Atualiza um tema existente.

        Args:
            request (Request): A requisição HTTP.
            pk (int): ID do tema.

        Retorna:
            Response: Resposta HTTP confirmando a atualização ou mensagem de erro.
        """
        try:
            tema = Tema.objects.get(pk=pk)
        except Tema.DoesNotExist:
            return Response({'status': 'error', "message": "Erro no servidor ao tentar encontrar tema."}, status=status.HTTP_404_NOT_FOUND)

        if tema.professor.user != request.user and not isinstance(request.user.perfil, Coordenador):
            return Response({'status': 'error', "message": "Usuário não autorizado.", "usuario": request.user}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = TemaSerializer(tema, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExcluirTemaView(CustomAPIView):
    """
    API para excluir um tema existente.

    Métodos:
        delete(request, pk): Exclui um tema existente.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        """
        Exclui um tema existente.

        Args:
            request (Request): A requisição HTTP.
            pk (int): ID do tema.

        Retorna:
            Response: Resposta HTTP confirmando a exclusão ou mensagem de erro.
        """
        try:
            tema = Tema.objects.get(pk=pk)
        except Tema.DoesNotExist:
            return Response({'status': 'error', "message": "Tema não encontrado no sistema."}, status=status.HTTP_404_NOT_FOUND)

        if tema.professor.user != request.user and not isinstance(request.user.perfil, Coordenador):
            return Response({'status': 'error', "message": "Usuário não autorizado."}, status=status.HTTP_401_UNAUTHORIZED)

        tema.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
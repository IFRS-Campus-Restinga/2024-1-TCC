from app.enums import StatusTccEnum
from app.models import Coordenador, Estudante, Usuario, ProfessorInterno, ProfessorExterno, StatusCadastro, Curso


class UsuarioService:
    """
    Serviço para gerenciar usuários.
    """

    def criarUsuario(self, usuario, serializer):
        """
        Cria um novo usuário com base nos dados fornecidos.
        """
        print(serializer.validated_data)
        # 1) Se for Coordenador, não usaremos cpf/identidade/diploma/etc.
        if (serializer.validated_data['isCoordenador']):
            return Coordenador.objects.create(
                nome=serializer.validated_data['nome'],
                email=usuario.email,  # ou serializer.validated_data['email'] se preferir
                # cpf NÃO é obrigatório -> se quiser salvar mesmo assim:
                # cpf=serializer.validated_data.get('cpf', ''), 
                user=usuario
            )

        # 2) Lógica para Professor Externo
        if (serializer.validated_data['isProfessor']
            and not self.IsInterno(usuario.email)):
            status = StatusCadastro.objects.create(aprovacao=False)
            return ProfessorExterno.objects.create(
                nome=serializer.validated_data['nome'],
                cpf=serializer.validated_data['cpf'],
                email=usuario.email,
                avatar=serializer.validated_data['avatar'],
                area_atuacao=serializer.validated_data['area_atuacao'],
                titulo=serializer.validated_data['titulo'],
                area_interesse=serializer.validated_data['area_interesse'],
                identidade=serializer.validated_data.get('identidade'),
                diploma=serializer.validated_data.get('diploma'),
                status=status,
                user=usuario
            )

        # 3) Lógica para Professor Interno
        if serializer.validated_data['isProfessor']:
            status = StatusCadastro.objects.create(aprovacao=False)
            return ProfessorInterno.objects.create(
                nome=serializer.validated_data['nome'],
                cpf=serializer.validated_data['cpf'],
                email=usuario.email,
                avatar=serializer.validated_data['avatar'],
                area_atuacao=serializer.validated_data['area_atuacao'],
                titulo=serializer.validated_data['titulo'],
                area_interesse=serializer.validated_data['area_interesse'],
                matricula=serializer.validated_data['matricula'],
                status=status,
                user=usuario
            )

        # 4) Caso contrário, Estudante
        curso_id = serializer.validated_data.get('curso')
        curso = None
        if curso_id:
            # Se você precisa instanciar o objeto:
            curso = Curso.objects.get(pk=curso_id)
        
        return Estudante.objects.create(
            nome=serializer.validated_data['nome'],
            cpf=serializer.validated_data['cpf'],
            email=usuario.email,
            avatar=serializer.validated_data['avatar'],
            matricula=serializer.validated_data.get('matricula', ''),
            curso=curso,
            user=usuario
        )

    def IsInterno(self, email):
        """
        Verifica se o email é de um domínio interno.
        """
        emailsInternos = ["@restinga.ifrs.edu.br", "@aluno.restinga.ifrs.edu.br"]
        return any(email.endswith(dominio) for dominio in emailsInternos)
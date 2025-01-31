from app.enums import StatusTccEnum
from app.models import Professor, Estudante, Usuario, ProfessorInterno, ProfessorExterno, StatusCadastro


class UsuarioService:
    """
    Serviço para gerenciar usuários.

    Métodos:
        criarUsuario(usuario, serializer): Cria um novo usuário com base nos dados fornecidos.
        IsInterno(email): Verifica se o email é de um domínio interno.
    """
    
    def criarUsuario(self, usuario, serializer):
        """
        Cria um novo usuário com base nos dados fornecidos.

        Args:
            usuario (Usuario): A instância do usuário a ser criada.
            serializer (Serializer): Serializer contendo os dados validados para criar o usuário.

        Raises:
            Exception: Para erros ao criar o usuário.
        """

        if(serializer.validated_data['isProfessor']):
            status = StatusCadastro.objects.create(aprovacao = False)

        if(not self.IsInterno(usuario.email)):
            status = StatusCadastro.objects.create(aprovacao=False)
            return ProfessorExterno.objects.create(
                nome = serializer.validated_data['nome'],
                cpf= serializer.validated_data['cpf'], 
                email = usuario.email,
                avatar = serializer.validated_data['avatar'],
                area_atuacao = serializer.validated_data['area_atuacao'],
                titulo = serializer.validated_data['titulo'],
                area_interesse = serializer.validated_data['area_interesse'],
                identidade = serializer.validated_data.get('identidade', None),
                diploma = serializer.validated_data.get('diploma', None),
                status = status,
                user = usuario
            )

        if(serializer.validated_data['isProfessor']):
            print("User :", usuario)
            print("Email User :", usuario.email)
            status = StatusCadastro.objects.create(aprovacao=False)
            return ProfessorInterno.objects.create(
                nome = serializer.validated_data['nome'],
                cpf = serializer.validated_data['cpf'], 
                email = str(usuario.email),
                avatar = serializer.validated_data['avatar'],
                area_atuacao = serializer.validated_data['area_atuacao'],
                titulo = serializer.validated_data['titulo'],
                area_interesse = serializer.validated_data['area_interesse'],
                matricula = serializer.validated_data['matricula'],
                status = status,
                user = usuario
            )
        
        return Estudante.objects.create(
            nome = serializer.validated_data['nome'],
            cpf = serializer.validated_data['cpf'], 
            email = usuario.email,
            avatar = serializer.validated_data['avatar'], 
            matricula = serializer.validated_data['matricula'],
            user = usuario
        )

    def IsInterno(self, email):
        """
        Verifica se o email é de um domínio interno.

        Args:
            email (str): O email a ser verificado.
        """
        emailsInternos = ["@restinga.ifrs.edu.br", "@aluno.restinga.ifrs.edu.br"]
        return any(email.endswith(emails) for emails in emailsInternos)
        
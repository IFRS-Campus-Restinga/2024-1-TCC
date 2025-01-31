from rest_framework import serializers
from app.models import Usuario, Estudante, Professor, ProfessorInterno, ProfessorExterno, Coordenador, StatusCadastro, Curso
from rest_polymorphic.serializers import PolymorphicSerializer
from app.enums import AreaInteresseEnum
from django.core.exceptions import ValidationError

class StatusCadastroSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo StatusCadastro.

    Atributos:
        status_text (SerializerMethodField): Campo que utiliza um método para obter o texto de status.

    Métodos:
        get_status_text(obj): Retorna o texto de status com base na aprovação e justificativa.
    """
    status_text = serializers.SerializerMethodField()

    class Meta:
        model = StatusCadastro
        fields = ['aprovacao', 'justificativa', 'dataStatus', 'status_text']

    def get_status_text(self, obj):
        """
        Retorna o texto de status com base na aprovação e justificativa.

        Args:
            obj (StatusCadastro): A instância do modelo StatusCadastro.
        """
        if not obj.aprovacao:
            if not obj.justificativa:
                return "Pendente"
            return "Reprovado"
        return "Aprovado"


class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Usuario.

    Atributos:
        tipo (CharField): Tipo de usuário.
        status_cadastro (StatusCadastroSerializer): Serializer aninhado para o status de cadastro.
        area_interesse (JSONField): Campo JSON para áreas de interesse.
    """
    tipo = serializers.CharField(source='tipoString', read_only=True)
    status_cadastro = StatusCadastroSerializer(source='status', read_only=True)
    area_interesse = serializers.JSONField(required=False, allow_null=True)

    class Meta:
        model = Usuario
        fields = '__all__'
        read_only_fields = ['email', 'user']


class EstudanteSerializer(UsuarioSerializer):
    """
    Serializer para o modelo Estudante.

    Atributos:
        area_interesse (JSONField): Campo JSON para áreas de interesse.

    Métodos:
        validate_area_interesse(value): Valida se a área de interesse é uma lista e contém escolhas válidas.
    """
    area_interesse = serializers.JSONField(required=False, allow_null=True)

    def validate_area_interesse(self, value):
        """
        Valida se a área de interesse é uma lista e contém escolhas válidas.

        Args:
            value (list): Valor da área de interesse.

        Raises:
            serializers.ValidationError: Se a área de interesse não for uma lista ou contiver escolhas inválidas.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("A área de interesse deve ser uma lista.")
        choices = {choice.name for choice in AreaInteresseEnum}  # Ensure using the name part of the enum
        if not all(item in choices for item in value):
            raise serializers.ValidationError("Uma ou mais áreas de interesse são inválidas.")
        return value

    class Meta:
        model = Estudante
        fields = '__all__'


class EstudanteNomeSerializer(UsuarioSerializer):
    """
    Serializer para nome do Estudante.
    """
    class Meta:
        model = Estudante
        fields = ['id', 'nome']

class ProfessorSerializer(UsuarioSerializer):
    """
    Serializer para o modelo Professor.

    Atributos:
        area_interesse (JSONField): Campo JSON para áreas de interesse.
        status (StatusCadastroSerializer): Serializer aninhado para o status de cadastro.

    Métodos:
        get_status_details(obj): Retorna os detalhes do status de cadastro.
        validate_area_interesse(value): Valida se a área de interesse é uma lista e contém escolhas válidas.
    """
    area_interesse = serializers.JSONField(required=False, allow_null=True)
    status = StatusCadastroSerializer(read_only=True)

    class Meta:
        model = Professor
        fields = '__all__'

    def get_status_details(self, obj):
        """
        Retorna os detalhes do status de cadastro.

        Args:
            obj (Professor): A instância do modelo Professor.
        """
        if obj.status:
            return StatusCadastroSerializer(obj.status).data
        return None

    def validate_area_interesse(self, value):
        """
        Valida se a área de interesse é uma lista e contém escolhas válidas.

        Args:
            value (list): Valor da área de interesse.

        Raises:
            serializers.ValidationError: Se a área de interesse não for uma lista ou contiver escolhas inválidas.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("A área de interesse deve ser uma lista.")
        choices = {choice.name for choice in AreaInteresseEnum}  # Ensure using the name part of the enum
        if not all(item in choices for item in value):
            raise serializers.ValidationError("Uma ou mais áreas de interesse são inválidas.")
        return value

class ProfessorNomeSerializer(UsuarioSerializer):
    """
    Serializer para nome do Professor.
    """
    class Meta:
        model = Professor
        fields = ['id', 'nome']

class ProfessorInternoSerializer(UsuarioSerializer):
    """
    Serializer para o modelo ProfessorInterno.
    """
    class Meta:
        model = ProfessorInterno
        fields = '__all__'

class ProfessorExternoSerializer(UsuarioSerializer):
    """
    Serializer para o modelo ProfessorExterno.
    """
    class Meta:
        model = ProfessorExterno
        fields = '__all__'

class CoordenadorSerializer(UsuarioSerializer):
    """
    Serializer para o modelo Coordenador.
    """
    class Meta:
        model = Coordenador
        fields = '__all__'

class UsuarioPolymorphicSerializer(PolymorphicSerializer):
    """
    Serializer polimórfico para os modelos de usuário.

    Atributos:
        model_serializer_mapping (dict): Mapeamento dos serializers para cada modelo.
    """
    model_serializer_mapping = {
        Usuario: UsuarioSerializer,
        Estudante: EstudanteSerializer,
        Professor: ProfessorSerializer,
        ProfessorInterno: ProfessorInternoSerializer,
        ProfessorExterno: ProfessorExternoSerializer,
        Coordenador: CoordenadorSerializer,
    }


def validate_cpf(value):
    """
    Valida CPF, garantindo que ele seja válido segundo o algoritmo de dígitos verificadores.

    Args:
        value (str): Valor do CPF.

    Raises:
        ValidationError: Se o CPF for inválido.
    """
    if not value.isdigit():
        raise ValidationError("CPF deve conter apenas números.")

    if len(value) != 11:
        raise ValidationError("CPF deve ter 11 dígitos.")

    if value in [s * 11 for s in "0123456789"]:
        raise ValidationError("CPF inválido.")

    def calculate_digit(digs):
        """
        Calcula um dígito verificador com base em uma sequência de dígitos.

        Args:
            digs (str): Sequência de dígitos.
        """
        s = 0
        qtd = len(digs) + 1
        for i in range(len(digs)):
            s += int(digs[i]) * (qtd - i)
        res = 11 - s % 11
        return '0' if res > 9 else str(res)

    # Calcula o primeiro dígito verificador.
    first_digit = calculate_digit(value[:9])
    # Calcula o segundo dígito verificador.
    second_digit = calculate_digit(value[:9] + first_digit)

    # Verifica se os dígitos calculados conferem com os informados.
    if value[-2:] != first_digit + second_digit:
        raise ValidationError("CPF inválido.")

    return True



def validate_unique_email(value):
    """
    Valida se o email é único no banco de dados.

    Args:
        value (str): Valor do email.

    Raises:
        serializers.ValidationError: Se o email já estiver registrado.
    """
    if Usuario.objects.filter(email=value).exists():
        raise serializers.ValidationError("Um usuário com este email já está registrado.")
    
def validate_file_extension(value):
    """
    Valida a extensão do arquivo.

    Args:
        value (File): Arquivo a ser validado.

    Raises:
        ValidationError: Se a extensão do arquivo não for suportada.
    """
    import os
    ext = os.path.splitext(value.name)[1]  # Captura a extensão do arquivo
    valid_extensions = ['.pdf', '.png', '.jpg', '.jpeg']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Tipo de arquivo não suportado.')



class CriarUsuarioSerializer(serializers.Serializer):
    """
    Serializer para criação de usuário.
    """

    # Campos básicos
    nome = serializers.CharField()
    cpf = serializers.CharField(
        required=False,           # Torna opcional
        allow_blank=True,         # Permite string vazia
        validators=[validate_cpf] # Mantém a validação de CPF caso seja fornecido
    )
    email = serializers.EmailField(validators=[validate_unique_email])
    avatar = serializers.CharField(required=True)

    # Flags / perfis
    isProfessor = serializers.BooleanField(required=False, default=False)
    isInterno = serializers.BooleanField(required=False, default=False)
    isCoordenador = serializers.BooleanField(required=False, default=False)

    # Demais campos (apenas quando for professor / estudante)
    matricula = serializers.CharField(required=False, allow_blank=True)
    area_atuacao = serializers.CharField(required=False, allow_blank=True)
    titulo = serializers.CharField(required=False, allow_blank=True)
    area_interesse = serializers.CharField(required=False, allow_blank=True)
    identidade = serializers.FileField(
        required=False, 
        validators=[validate_file_extension]
    )
    diploma = serializers.FileField(
        required=False, 
        validators=[validate_file_extension]
    )
    curso = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, data):
        """
        Se for Coordenador, só exigimos nome e email.
        Caso contrário, mantemos as validações já existentes para professor/estudante.
        """
        is_coordenador = data.get('isCoordenador', False)
        is_interno = data.get('isInterno', False)
        is_professor = data.get('isProfessor', False)

        # 1) Se é COORDENADOR, exigimos APENAS nome e email.
        if is_coordenador:
            # Nome
            if not data.get('nome'):
                raise serializers.ValidationError({
                    "nome": "Nome deve ser preenchido para Coordenador."
                })
            # Email
            if not data.get('email'):
                raise serializers.ValidationError({
                    "email": "Email deve ser preenchido para Coordenador."
                })
            # Não valida cpf, matricula, etc.
            return data

        # 2) Caso NÃO seja Coordenador, segue suas regras antigas:
        # Professor interno
        if is_interno and is_professor:
            if not data.get('matricula'):
                raise serializers.ValidationError({
                    "matricula": "Matrícula deve ser preenchida para professores internos."
                })
            if not data.get('titulo'):
                raise serializers.ValidationError({
                    "titulo": "Título deve ser preenchido para professores internos."
                })
            if not data.get('area_atuacao'):
                raise serializers.ValidationError({
                    "area_atuacao": "Área de atuação deve ser preenchida para professores internos."
                })

        # Professor externo
        elif not is_interno and is_professor:
            if not data.get('titulo'):
                raise serializers.ValidationError({
                    "titulo": "Título deve ser preenchido para professores externos."
                })
            if not data.get('area_atuacao'):
                raise serializers.ValidationError({
                    "area_atuacao": "Área de atuação deve ser preenchida para professores externos."
                })
            if not data.get('identidade'):
                raise serializers.ValidationError({
                    "identidade": "Identidade deve ser enviada para professores externos."
                })
            if not data.get('diploma'):
                raise serializers.ValidationError({
                    "diploma": "Diploma deve ser enviado para professores externos."
                })

        # Estudante interno
        elif is_interno and not is_professor:
            if not data.get('matricula'):
                raise serializers.ValidationError({
                    "matricula": "Matrícula deve ser preenchida para estudantes."
                })

            # Verifica curso
            if not data.get('curso'):
                raise serializers.ValidationError({
                    "curso": "Curso deve ser selecionado para estudantes."
                })
            # Se usar instância de Curso, você pode resolver no create/update.
            # Ou checar se existe com: Curso.objects.get(pk=...) etc.

        return data


class FileSerializer(serializers.ModelSerializer):
    """
    Serializer para arquivos.
    """
    class Meta:
        model = ProfessorExterno  # O modelo que você usa para armazenar arquivos
        fields = "__all__"





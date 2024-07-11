from rest_framework import serializers
from app.models import Usuario, Estudante, Professor, ProfessorInterno, ProfessorExterno, Coordenador, StatusCadastro
from rest_polymorphic.serializers import PolymorphicSerializer
from app.enums import AreaInteresseEnum
from django.core.exceptions import ValidationError

class StatusCadastroSerializer(serializers.ModelSerializer):
    status_text = serializers.SerializerMethodField()

    class Meta:
        model = StatusCadastro
        fields = ['aprovacao', 'justificativa', 'dataStatus', 'status_text']

    def get_status_text(self, obj):
        if not obj.aprovacao:
            if not obj.justificativa:
                return "Pendente"
            return "Reprovado"
        return "Aprovado"


class UsuarioSerializer(serializers.ModelSerializer):
    tipo = serializers.CharField(source='tipoString', read_only=True)
    status_cadastro = StatusCadastroSerializer(source='status', read_only=True)

    class Meta:
        model = Usuario
        fields = '__all__'


class EstudanteSerializer(UsuarioSerializer):
    class Meta:
        model = Estudante
        fields = '__all__'

class EstudanteNomeSerializer(UsuarioSerializer):
    class Meta:
        model = Estudante
        fields = ['id', 'nome']

class ProfessorSerializer(UsuarioSerializer):
    area_interesse = serializers.JSONField(required=False, allow_null=True)
    status = StatusCadastroSerializer(read_only=True)

    class Meta:
        model = Professor
        fields = '__all__'

    def get_status_details(self, obj):
        if obj.status:
            return StatusCadastroSerializer(obj.status).data
        return None

    def validate_area_interesse(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("A área de interesse deve ser uma lista.")
        choices = {choice.value for choice in AreaInteresseEnum.choices}
        if not all(item in choices for item in value):
            raise serializers.ValidationError("Uma ou mais áreas de interesse são inválidas.")
        return value

class ProfessorNomeSerializer(UsuarioSerializer):
    class Meta:
        model = Professor
        fields = ['id', 'nome']

class ProfessorInternoSerializer(UsuarioSerializer):
    class Meta:
        model = ProfessorInterno
        fields = '__all__'

class ProfessorExternoSerializer(UsuarioSerializer):
    class Meta:
        model = ProfessorExterno
        fields = '__all__'

class CoordenadorSerializer(UsuarioSerializer):
    class Meta:
        model = Coordenador
        fields = '__all__'

class UsuarioPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Usuario: UsuarioSerializer,
        Estudante: EstudanteSerializer,
        Professor: ProfessorSerializer,
        ProfessorInterno: ProfessorInternoSerializer,
        ProfessorExterno: ProfessorExternoSerializer,
        Coordenador: CoordenadorSerializer,
    }


def validate_cpf(value):
    """ Valida CPF, garantindo que ele seja válido segundo o algoritmo de dígitos verificadores. """
    if not value.isdigit():
        raise ValidationError("CPF deve conter apenas números.")

    if len(value) != 11:
        raise ValidationError("CPF deve ter 11 dígitos.")

    if value in [s * 11 for s in "0123456789"]:
        raise ValidationError("CPF inválido.")

    def calculate_digit(digs):
        """ Calcula um dígito verificador com base em uma sequência de dígitos. """
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
    if Usuario.objects.filter(email=value).exists():
        raise serializers.ValidationError("Um usuário com este email já está registrado.")
    
def validate_file_extension(value):
    import os
    ext = os.path.splitext(value.name)[1]  # Captura a extensão do arquivo
    valid_extensions = ['.pdf', '.png', '.jpg', '.jpeg']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Tipo de arquivo não suportado.')



class CriarUsuarioSerializer(serializers.Serializer):
    nome = serializers.CharField()
    cpf = serializers.CharField(validators=[validate_cpf])
    email = serializers.EmailField(validators=[validate_unique_email])
    avatar = serializers.CharField(required=True)
    isProfessor = serializers.BooleanField()
    IsInterno = serializers.BooleanField(required=False, default=False)
    matricula = serializers.CharField(required=False, allow_blank=True)
    area_atuacao = serializers.CharField(required=False, allow_blank=True)
    titulo = serializers.CharField(required=False, allow_blank=True)
    area_interesse = serializers.CharField(required=False, allow_blank=True)
    identidade = serializers.FileField(required=False, validators=[validate_file_extension])
    diploma = serializers.FileField(required=False, validators=[validate_file_extension])


    def validate(self, data):
        is_interno = data.get('IsInterno', False)  # Usa get com um valor padrão False
        is_professor = data.get('isProfessor', False)

        # Validações para professores internos
        if is_interno and is_professor:
            if not data.get('matricula'):
                raise serializers.ValidationError({"matricula": "Matrícula deve ser preenchida para professores internos."})
            if not data.get('grau'):
                raise serializers.ValidationError({"grau": "Grau deve ser preenchido para professores internos."})
            if not data.get('area'):
                raise serializers.ValidationError({"area": "Área deve ser preenchida para professores internos."})

        # Validações para professores externos
        elif not is_interno and is_professor:
            if not data.get('grau'):
                raise serializers.ValidationError({"grau": "Grau deve ser preenchido para professores externos."})
            if not data.get('area'):
                raise serializers.ValidationError({"area": "Área deve ser preenchida para professores externos."})
            if not data.get('identidade'):
                raise serializers.ValidationError({"identidade": "Identidade deve ser enviada para professores externos."})
            if not data.get('diploma'):
                raise serializers.ValidationError({"diploma": "Diploma deve ser enviado para professores externos."})

        # Validação para estudantes
        elif is_interno and not is_professor:
            if not data.get('matricula'):
                raise serializers.ValidationError({"matricula": "Matrícula deve ser preenchida para estudantes."})

        return data


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorExterno  # O modelo que você usa para armazenar arquivos
        fields = "__all__"





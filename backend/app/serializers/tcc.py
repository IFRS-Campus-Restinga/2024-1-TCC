from rest_framework import serializers
from ..models import Tcc,TccStatus, SessaoPrevia, SessaoFinal, Sessao, Tema, Usuario
from app.enums import StatusTccEnum, UsuarioTipoEnum
from ..serializers import UsuarioPolymorphicSerializer, TccStatusSerializer, SessaoPolymorphicSerializer, FileDetailSerializer, EstudanteNomeSerializer, ProfessorNomeSerializer, SemestreSerializer

class TccSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Tcc.

    Atributos:
        autor (UsuarioPolymorphicSerializer): Serializer aninhado para o autor do TCC.
        orientador (UsuarioPolymorphicSerializer): Serializer aninhado para o orientador do TCC.
        coorientador (UsuarioPolymorphicSerializer): Serializer aninhado para o coorientador do TCC.
        semestre (SemestreSerializer): Serializer aninhado para o semestre do TCC.
        documentoTCC (FileDetailSerializer): Serializer aninhado para o documento do TCC.
        autorizacaoPublicacao (FileDetailSerializer): Serializer aninhado para a autorização de publicação do TCC.
        status (SerializerMethodField): Campo que utiliza um método para serializar os status do TCC.
        sessoes (SerializerMethodField): Campo que utiliza um método para serializar as sessões do TCC.

    Métodos:
        get_status(obj): Retorna os dados serializados dos status associados ao TCC.
        get_sessoes(obj): Retorna os dados serializados das sessões associadas ao TCC.
    """
    autor = UsuarioPolymorphicSerializer()
    orientador = UsuarioPolymorphicSerializer()
    coorientador = UsuarioPolymorphicSerializer()
    semestre = SemestreSerializer()
    documentoTCC = FileDetailSerializer()
    autorizacaoPublicacao = FileDetailSerializer()
    status = serializers.SerializerMethodField(method_name='get_status')
    sessoes = serializers.SerializerMethodField(method_name='get_sessoes')

    def get_status(self, obj):
        """
        Retorna os dados serializados dos status associados ao TCC.

        Args:
            obj (Tcc): A instância do modelo Tcc.
        """
        status_objects = TccStatus.objects.filter(tcc=obj)
        return TccStatusSerializer(status_objects, many=True).data

    def get_sessoes(self, obj):
        """
        Retorna os dados serializados das sessões associadas ao TCC.

        Args:
            obj (Tcc): A instância do modelo Tcc.
        """
        sessoes_objects = Sessao.objects.filter(tcc=obj)
        return SessaoPolymorphicSerializer(sessoes_objects, many=True).data

    class Meta:
        model = Tcc
        fields = '__all__'

class TccPublicSerializer(serializers.ModelSerializer):
    """
    Serializer público para o modelo Tcc.

    Este serializer é usado para retornar apenas os dados públicos dos TCCs
    que foram aprovados. Ele não inclui informações sensíveis ou detalhes
    relacionados às bancas e arquivos do TCC.

    Atributos:
        autor (CharField): Retorna o nome do autor do TCC.
        orientador (CharField): Retorna o nome do orientador do TCC.
        coorientador (SerializerMethodField): Retorna o nome do coorientador, se existir.
        tema (CharField): O tema do TCC.
        id (IntegerField): O identificador único do TCC.
    
    Métodos:
        get_coorientador(obj): Retorna o nome do coorientador, se existir. Caso contrário, retorna None.
    """

    autor = serializers.CharField(source='autor.nome')
    orientador = serializers.CharField(source='orientador.nome')
    coorientador = serializers.SerializerMethodField()

    def get_coorientador(self, obj):
        """
        Retorna o nome do coorientador, se existir.

        Args:
            obj (Tcc): A instância do modelo Tcc.

        Retorna:
            str ou None: O nome do coorientador, ou None se o TCC não tiver um coorientador.
        """
        return obj.coorientador.nome if obj.coorientador else None

    class Meta:
        model = Tcc
        fields = ['id', 'tema', 'autor', 'orientador', 'coorientador']

class DetalhesTccPublicSerializer(serializers.ModelSerializer):
    """
    Serializer público para o modelo Tcc.

    Este serializer retorna dados básicos e limitados dos TCCs, incluindo informações adicionais,
    como o resumo, o período do semestre, a data da sessão final e o último status.

    Atributos:
        id (IntegerField): Identificador único do TCC.
        tema (CharField): Tema do TCC.
        autor (CharField): Nome do autor do TCC.
        orientador (CharField): Nome do orientador do TCC.
        coorientador (SerializerMethodField): Nome do coorientador, se existir.
        resumo (CharField): Resumo do TCC.
        documentoTCC (FileDetailSerializer): Detalhes do documento do TCC.
        semestre (CharField): Período do semestre em que o TCC foi desenvolvido.
        sessao_final (SerializerMethodField): Data da sessão final do TCC.
        status (SerializerMethodField): Último status do TCC.
    """

    autor = serializers.CharField(source='autor.nome')
    orientador = serializers.CharField(source='orientador.nome')
    coorientador = serializers.SerializerMethodField()
    semestre = serializers.CharField(source='semestre.periodo')
    sessao_final = serializers.SerializerMethodField()
    documentoTCC = FileDetailSerializer()
    status = serializers.SerializerMethodField()

    def get_coorientador(self, obj):
        """
        Retorna o nome do coorientador, se existir.

        Args:
            obj (Tcc): A instância do modelo Tcc.

        Retorna:
            str ou None: Nome do coorientador ou None se não houver.
        """
        return obj.coorientador.nome if obj.coorientador else None

    def get_sessao_final(self, obj):
        """
        Retorna a data da sessão final associada ao TCC.

        Args:
            obj (Tcc): A instância do modelo Tcc.

        Retorna:
            str ou None: Data da sessão final ou None se não houver.
        """
        sessao_final = Sessao.objects.filter(tcc=obj).order_by('-data_inicio').first()
        return sessao_final.data_inicio if sessao_final else None

    def get_status(self, obj):
        """
        Retorna o último status do TCC.

        Args:
            obj (Tcc): A instância do modelo Tcc.

        Retorna:
            dict ou None: Último status do TCC, incluindo status, mensagem e data.
        """
        ultimo_status = TccStatus.objects.filter(tcc=obj).order_by('-dataStatus').first()
        if ultimo_status:
            return {
                'status': ultimo_status.status,
                'statusMensagem': ultimo_status.statusMensagem,
                'dataStatus': ultimo_status.dataStatus,
            }
        return None

    class Meta:
        model = Tcc
        fields = [
            'id', 'tema', 'autor', 'orientador', 'coorientador',
            'resumo', 'documentoTCC', 'semestre', 'sessao_final', 'status'
        ]


class TccCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para a criação de um TCC.
    """
    class Meta:
        model = Tcc
        fields = "tema", "resumo", "orientador", "coorientador"

class TccEditSerializer(serializers.ModelSerializer):
    """
    Serializer para a edição de um TCC.

    Este serializer valida os campos que podem ser editados por diferentes tipos de usuários.
    """

    class Meta:
        model = Tcc
        fields = ["tema", "resumo", "orientador", "coorientador"]

    def validate(self, data):
        """
        Valida se o usuário tem permissão para editar os campos fornecidos.
        """
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError({"erro_permissao": ["Requisição não encontrada no contexto."]})

        try:
            usuario = Usuario.objects.get(user=request.user)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError({"erro_permissao": ["Perfil de usuário não encontrado."]})

        tcc = self.instance

        # Autores e Orientadores podem editar apenas "tema" e "resumo"
        if usuario.id == tcc.autor.id or usuario.id == tcc.orientador.id:
            # Verifica se apenas os campos permitidos estão sendo enviados
            restricted_fields = [field for field in data.keys() if field not in ["tema", "resumo"]]
            if restricted_fields:
                raise serializers.ValidationError({"erro_permissao": ["Você não tem permissão para editar esses campos."]})
            return data  # Retorna os dados se tudo estiver correto

        # Coordenadores podem editar todos os campos
        elif usuario.tipo == UsuarioTipoEnum.COORDENADOR:
            return data

        # Caso o usuário não tenha permissão
        raise serializers.ValidationError({"erro_permissao": ["Você não tem permissão para editar este TCC."]})

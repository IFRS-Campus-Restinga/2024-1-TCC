from rest_framework import serializers
from ..models import Tcc,TccStatus, SessaoPrevia, SessaoFinal, Sessao, Tema
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

class TccCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para a criação de um TCC.
    """
    class Meta:
        model = Tcc
        fields = "tema", "resumo", "orientador", "coorientador"
from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from ..serializers import BancaSerializer, AvaliacaoSerializer, FileDetailSerializer
from ..models import SessaoPrevia, SessaoFinal, Sessao, Banca

class SessaoSerializer(serializers.ModelSerializer):
    banca = serializers.SerializerMethodField(method_name='get_banca')
    tipo = serializers.CharField(source='get_tipo')
    documentoTCCSessao = FileDetailSerializer()

    class Meta:
        model = Sessao
        fields = '__all__'

    def get_banca(self, obj):
        banca_object = Banca.objects.get(sessao=obj)
        return BancaSerializer(banca_object).data

class SessaoPreviaSerializer(SessaoSerializer):
    class Meta:
        model = SessaoPrevia
        fields = '__all__'

class SessaoFinalSerializer(SessaoSerializer):
    avaliacao = AvaliacaoSerializer()
    class Meta:
        model = SessaoFinal
        fields = '__all__'

class SessaoPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Sessao: Sessao,
        SessaoFinal: SessaoFinalSerializer,
        SessaoPrevia: SessaoPreviaSerializer,
    }
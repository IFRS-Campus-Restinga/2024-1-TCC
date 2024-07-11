from rest_framework import serializers
from ..models import Avaliacao
from ..serializers import FileDetailSerializer

class AvaliacaoSerializer(serializers.ModelSerializer):
    tcc_definitivo = FileDetailSerializer()
    ficha_avaliacao = FileDetailSerializer()
    class Meta:
        model = Avaliacao
        fields = '__all__'
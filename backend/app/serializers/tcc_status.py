from rest_framework import serializers
from app.models import TccStatus
from app.enums import StatusTccEnum

class TccStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = TccStatus
        fields = ['status', 'statusMensagem', 'dataStatus']

class TccStatusAlterarSerializer(serializers.ModelSerializer):

    def validate_status(self, value):
        enum = StatusTccEnum(value)
        if enum.justificativa_obrigatoria():
            if 'justificativa' not in self.initial_data:
                raise serializers.ValidationError("Justificativa é obrigatória para este status")
        return value

    class Meta:
        model = TccStatus
        fields = ['status', 'justificativa', 'dataStatus']

class TccStatusResponderPropostaSerializer(serializers.Serializer):
    aprovar = serializers.BooleanField()
    justificativa = serializers.CharField(required=False)

    def validate_aprovar(self, value):
        if not value:
            if 'justificativa' not in self.initial_data:
                raise serializers.ValidationError("Justificativa é obrigatória para este status")
        return value
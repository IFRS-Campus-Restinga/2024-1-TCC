from django.db import models
from polymorphic.models import PolymorphicModel
from datetime import datetime
from . import Tcc

class Sessao(PolymorphicModel):
    local = models.CharField(max_length=255)
    forma_apresentacao = models.CharField(max_length=255)
    # TODO - Verificar propriedades dos atributos "parecer_orientador" e "parecer_coordenador"
    parecer_orientador = models.TextField(null=True, blank=True)
    parecer_coordenador = models.TextField(null=True, blank=True)
    data_inicio = models.DateTimeField()
    data_termino = models.DateTimeField()
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT)
    documentoTCCSessao = models.FileField(upload_to='sessao/documento', null=True, blank=True)
    prazoEntregaDocumento = models.DateTimeField(default=datetime.now, null=True, blank=True)
    validacaoOrientador = models.BooleanField(default=False)
    validacaoCoordenador = models.BooleanField(default=False)

    @property
    def get_tipo(self):
        return {
            'SessaoPrevia': 'Sessão Prévia',
            'SessaoFinal': 'Sessão Final',
        }[self.__class__.__name__]
    
    def getSessoesFuturas():
        data_consulta = datetime.today().date()
        sessoes = Sessao.objects.filter(
            data_inicio__gt=data_consulta,
            validacaoOrientador=True
            ).order_by(
                'validacaoCoordenador',
                'data_inicio'
            )
        if sessoes.exists():
            return sessoes
        else:
            return None

    

    class Meta:
        abstract = False
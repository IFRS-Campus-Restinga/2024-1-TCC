from django.db import models
from .base import BaseModel
from .estudante import Estudante
from .professor import Professor

class Tcc(BaseModel):
    autor = models.ForeignKey(Estudante, on_delete=models.PROTECT)
    orientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='orientador')
    coorientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='coorientador')
    tema = models.CharField(max_length=255)
    resumo = models.TextField
    dataSubmissaoProposta = models.DateTimeField(auto_now_add=True)
    documentoTCC = models.FileField(upload_to='tcc/documento')
    autorizacaoPublicacao = models.FileField(upload_to='tcc/autorizacaoPublicacao')
    #TODO - mudar caminho dos arquivos
    dataInicio = models.DateTimeField
    prazoEntregaPrevia = models.DateTimeField
    prazoEntregaFinal = models.DateTimeField

    class Meta:
        abstract = False
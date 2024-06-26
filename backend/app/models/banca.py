from .base import BaseModel
from django.db import models
from . import Sessao, Professor, Usuario

class Banca(BaseModel):
    sessao = models.ForeignKey(Sessao, on_delete=models.PROTECT)
    professores = models.ManyToManyField(Professor, related_name='banca_professores', null=True, blank=True)
    professoresSugeridos = models.ManyToManyField(Professor, related_name='banca_professores_sugeridos', null=True, blank=True)
    autorSugestao = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    dataSugestao = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        abstract = False
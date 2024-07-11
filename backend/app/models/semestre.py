from .base import BaseModel
from django.db import models
from django.db.models import Q
#from .semestreCoordenador import SemestreCoordenador
from datetime import datetime  

class Semestre(BaseModel):
    periodo = models.CharField(max_length=255, verbose_name="Período", default="2024/1")
    dataAberturaSemestre = models.DateField(default=datetime.today)
    dataFechamentoSemestre = models.DateField(default=datetime.today)
    dataAberturaPrazoPropostas = models.DateField(default=datetime.today)
    dataFechamentoPrazoPropostas = models.DateField(default=datetime.today)

    class Meta:
        abstract = False

    def semestre_atual():
        data_consulta = datetime.today().date()
        
        semestres = Semestre.objects.filter(
            Q(dataAberturaSemestre__lte=data_consulta) &
            Q(dataFechamentoSemestre__gte=data_consulta)
        )
        
        #TODO: Pensar sobre a possibilidade de não haver semestres ativos (página de submissão recebe erro 404f)
        if semestres.exists():
            return semestres.first()
        else:
            return None
        
    def consulta_envio_propostas(self):
        data_hoje = datetime.today().date()
        return ((self.dataAberturaPrazoPropostas<=data_hoje) and (self.dataFechamentoPrazoPropostas>=data_hoje))
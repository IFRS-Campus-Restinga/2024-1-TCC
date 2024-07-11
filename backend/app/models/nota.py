from django.db import models
from .base import BaseModel
from app.enums import CriteriosEnum
from datetime import datetime
from . import Professor, Avaliacao

class Nota(BaseModel):
    avaliacao = models.ForeignKey(Avaliacao, on_delete=models.CASCADE)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    criterio = models.CharField(choices=CriteriosEnum.choices, max_length=50)
    nota = models.FloatField()

    class Meta:
        unique_together = ('avaliacao', 'professor', 'criterio')
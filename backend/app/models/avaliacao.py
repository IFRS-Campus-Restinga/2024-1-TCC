from .base import BaseModel
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Avaliacao(BaseModel):
    nota_orientador = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    nota_avaliador1 = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    nota_avaliador2 = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    comentarios_orientador = models.TextField(null=True, blank=True)
    comentarios_avaliador1 = models.TextField(null=True, blank=True)
    comentarios_avaliador2 = models.TextField(null=True, blank=True)
    ajuste = models.BooleanField(default=False)
    descricao_ajuste = models.TextField(null=True, blank=True)
    data_entrega_ajuste = models.DateTimeField(null=True, blank=True)
    media_final = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    tcc_definitivo = models.FileField(upload_to='tcc/documento', null=True, blank=True)
    ficha_avaliacao = models.FileField(upload_to='avaliacoes/fichas', null=True, blank=True)
    data_avaliacao = models.DateTimeField(null=True, blank=True)
    parecer_orientador = models.TextField(null=True, blank=True)

    class meta:
        abstract = False
from django.db import models
from . import Usuario
from .curso import Curso

class Estudante(Usuario):
    """
    Modelo que representa um Estudante, herdando do modelo Usuario.

    Atributos:
        matricula (CharField): Número de matrícula do estudante. Comprimento máximo de 255 caracteres.
        area_interesse (TextField): Área de interesse do estudante. Pode ser null ou blank.
        curso (ForeignKey): Curso no qual o estudante está matriculado. Relacionamento com o modelo Curso.
    """
    matricula = models.CharField(max_length=255, verbose_name="Matrícula")
    area_interesse = models.TextField(null=True, blank=True, verbose_name="Área de Interesse")
    curso = models.ForeignKey(
        Curso,
        on_delete=models.PROTECT,
        related_name="estudantes",
        verbose_name="Curso"
    )

    class Meta:
        abstract = False

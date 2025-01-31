from django.db import models
from . import Usuario

class Estudante(Usuario):
    """
    Modelo que representa um Estudante, herdando do modelo Usuario.

    Atributos:
        matricula (CharField): Número de matrícula do estudante. Comprimento máximo de 255 caracteres.
        area_interesse (TextField): Área de interesse do estudante. Pode ser null ou blank.
    """
    matricula = models.CharField(max_length=255)
    area_interesse = models.TextField(null=True, blank=True)

    class Meta:
        abstract = False
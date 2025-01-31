from django.db import models
from . import Usuario

class Coordenador(Usuario):
    """
    Modelo que representa um Coordenador(ADMIN MASTER).
    """

    class Meta:
        abstract =False
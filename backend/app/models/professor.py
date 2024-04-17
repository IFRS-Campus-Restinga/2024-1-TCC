from django.db import models
from . import Usuario, StatusCadastro
from app.enums import GrauAcademicoEnum

class Professor(Usuario):

    area = models.CharField(max_length=255, null=True, blank=True)
    grau_academico = models.CharField(choices=GrauAcademicoEnum.choices, max_length=255, null=True, blank=True)
    # TODO - Verificar se é melhor usar um campo de texto ou um campo de array
    titulos = models.TextField(max_length=255, null=True, blank=True)
    status = models.OneToOneField(StatusCadastro, related_name="status_cadastro", on_delete=models.CASCADE)

    class Meta:
        abstract = False
from django.db import models
from . import Usuario, Curso

class Coordenador(Usuario):
    """
    Modelo que representa um Coordenador, responsável por gerenciar as atividades acadêmicas de um curso específico. Herda do modelo Usuario.

    Atributos:
        curso (ForeignKey): Curso associado ao coordenador. Relacionamento com o modelo Curso. Excluído em cascata caso o curso seja removido.
    """
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='coordenadores', null=True)


    class Meta:
        abstract = False

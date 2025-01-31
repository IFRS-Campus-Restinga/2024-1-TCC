from django.db import models
from .curso import Curso
from .professorInterno import ProfessorInterno


class HistoricoCoordenadorCurso(models.Model):
    """
    Modelo que registra o histórico de coordenadores de um curso.

    Atributos:
        curso (ForeignKey): Curso associado ao registro.
        coordenador (ForeignKey): Coordenador associado ao curso.
        data_alteracao (DateTimeField): Data de alteração do coordenador.
    """

    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="historico_coordenadores",
        verbose_name="Curso"
    )
    coordenador = models.ForeignKey(
        ProfessorInterno,
        on_delete=models.PROTECT,
        related_name="historico_cursos_coordenados",
        verbose_name="Coordenador"
    )
    data_alteracao = models.DateTimeField(auto_now_add=True, verbose_name="Data de alteração")

    class Meta:
        verbose_name = "Histórico de Coordenadores por Curso"
        verbose_name_plural = "Histórico de Coordenadores por Curso"

    def __str__(self):
        return f"{self.curso.nome} - {self.coordenador.nome} ({self.data_alteracao.strftime('%d/%m/%Y')})"

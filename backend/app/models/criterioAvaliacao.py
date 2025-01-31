from django.db import models
from .templateAvaliacao import TemplateAvaliacao


class CriterioAvaliacao(models.Model):
    """
    Modelo que representa um critério de avaliação.

    Atributos:
        template (ForeignKey): Template de avaliação associado ao critério.
        nome (CharField): Nome do critério.
        nota_maxima (FloatField): Nota máxima atribuível ao critério.
        area (CharField): Área do critério (ex: Trabalho Escrito, Apresentação).
    """

    template = models.ForeignKey(
        TemplateAvaliacao,
        on_delete=models.CASCADE,
        related_name="criterios",
        verbose_name="Template de Avaliação"
    )
    nome = models.CharField(max_length=255, verbose_name="Nome do critério")
    nota_maxima = models.FloatField(verbose_name="Nota máxima")
    area = models.CharField(
        max_length=255,
        verbose_name="Área de avaliação (ex: Trabalho Escrito, Apresentação)"
    )

    class Meta:
        verbose_name = "Critério de Avaliação"
        verbose_name_plural = "Critérios de Avaliação"

    def __str__(self):
        return f"{self.nome} ({self.template.curso.nome})"

from .base import BaseModel
from django.db import models
from . import Sessao, Avaliacao
from django.db.models.signals import post_save
from django.dispatch import receiver

class SessaoFinal(Sessao):

    avaliacao = models.OneToOneField(Avaliacao, on_delete=models.PROTECT, null=True, blank=True)

    class Meta:
        abstract = False

@receiver(post_save, sender=SessaoFinal)
def create_avaliacao(sender, instance, created, **kwargs):
    if created:
        avaliacao = Avaliacao.objects.create()
        instance.avaliacao = avaliacao
        instance.save()
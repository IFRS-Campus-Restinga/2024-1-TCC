from django.db import models
from .base import BaseModel
from datetime import datetime  
from . import Estudante, Professor, Semestre

class Tcc(BaseModel):
    """
    Modelo que representa um Trabalho de Conclusão de Curso (TCC).

    Atributos:
        autor (ForeignKey): Relacionamento com o estudante autor do TCC. Protegido contra exclusão.
        orientador (ForeignKey): Relacionamento com o professor orientador do TCC. Protegido contra exclusão. Relacionado com 'orientador'.
        coorientador (ForeignKey): Relacionamento com o professor coorientador do TCC. Pode ser null ou blank. Protegido contra exclusão. Relacionado com 'coorientador'.
        semestre (ForeignKey): Relacionamento com o semestre no qual o TCC está sendo realizado. Protegido contra exclusão.
        tema (CharField): Tema do TCC. Comprimento máximo de 255 caracteres.
        resumo (TextField): Resumo do TCC.
        dataSubmissaoProposta (DateTimeField): Data e hora de submissão da proposta do TCC. Atribuído automaticamente na criação do registro.
        documentoTCC (FileField): Documento do TCC. O arquivo é enviado para o diretório 'tcc/documento'. Pode ser null ou blank.
        autorizacaoPublicacao (FileField): Autorização para publicação do TCC. O arquivo é enviado para o diretório 'tcc/autorizacaoPublicacao'. Pode ser null ou blank.
        dataInicio (DateTimeField): Data e hora de início do TCC. Valor padrão é a data e hora atuais. Pode ser null ou blank.
    """
    autor = models.ForeignKey(Estudante, on_delete=models.PROTECT)
    orientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='orientador')
    coorientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='coorientador', null=True, blank=True)
    semestre = models.ForeignKey(Semestre, on_delete=models.PROTECT)
    tema = models.CharField(max_length=255)
    resumo = models.TextField()
    dataSubmissaoProposta = models.DateTimeField(auto_now_add=True)
    documentoTCC = models.TextField(null=True, blank=True)
    autorizacaoPublicacao = models.FileField(upload_to='tcc/autorizacaoPublicacao', null=True, blank=True)
    #TODO - mudar caminho dos arquivos
    dataInicio = models.DateTimeField(default=datetime.now, null=True, blank=True)

    class Meta:
        abstract = False
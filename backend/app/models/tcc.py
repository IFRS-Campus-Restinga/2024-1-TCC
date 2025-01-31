from django.db import models
from .base import BaseModel
from django.utils.timezone import now 
from . import Estudante, Professor, Semestre, Curso
from ..enums import RegraSessaoPublicaEnum

class Tcc(BaseModel):
    """
    Modelo que representa um Trabalho de Conclusão de Curso (TCC).

    Atributos:
        autor (ForeignKey): Relacionamento com o estudante autor do TCC. Protegido contra exclusão.
        orientador (ForeignKey): Relacionamento com o professor orientador do TCC. Protegido contra exclusão. Relacionado com 'tccsOrientados'.
        coorientador (ForeignKey): Relacionamento com o professor coorientador do TCC. Pode ser null ou blank. Protegido contra exclusão. Relacionado com 'tccsCoorientados'.
        semestre (ForeignKey): Relacionamento com o semestre no qual o TCC está sendo realizado. Protegido contra exclusão. Relacionado com 'tccsDoSemestre'.
        curso (ForeignKey): Relacionamento com o curso associado ao TCC. Protegido contra exclusão.
        tema (CharField): Tema do TCC. Comprimento máximo de 255 caracteres.
        resumo (TextField): Resumo do TCC.
        dataSubmissaoProposta (DateTimeField): Data e hora de submissão da proposta do TCC. Atribuído automaticamente na criação do registro.
        documentoTCC (FileField): Documento do TCC. O arquivo é enviado para o diretório 'tcc/documento'. Pode ser null ou blank.
        autorizacaoPublicacao (FileField): Autorização para publicação do TCC. O arquivo é enviado para o diretório 'tcc/autorizacaoPublicacao'. Pode ser null ou blank.
        dataInicio (DateTimeField): Data e hora de início do TCC. Valor padrão é a data e hora atuais. Pode ser null ou blank.
        previa_obrigatoria (property): Indica se a prévia é obrigatória, consultando a regra do curso associado.
        possui_previa (property): Indica se o TCC terá uma prévia, considerando a regra do curso associado.
    """
    autor = models.ForeignKey(Estudante, on_delete=models.PROTECT, related_name='tccsDoEstudante')
    orientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='tccsOrientados')
    coorientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='tccsCoorientados', null=True, blank=True)
    semestre = models.ForeignKey(Semestre, on_delete=models.PROTECT, related_name='tccsDoSemestre')
    curso = models.ForeignKey(Curso, on_delete=models.PROTECT, related_name='tccsDoCurso')
    tema = models.CharField(max_length=255)
    resumo = models.TextField()
    dataSubmissaoProposta = models.DateTimeField(auto_now_add=True)
    documentoTCC = models.TextField(null=True, blank=True)
    autorizacaoPublicacao = models.FileField(upload_to='tcc/autorizacaoPublicacao', null=True, blank=True)
    #TODO - mudar caminho dos arquivos
    dataInicio = models.DateTimeField(default=now, null=True, blank=True)

    @property
    def previa_obrigatoria(self):
        """
        Retorna um booleano indicando se a prévia é obrigatória, consultando a regra do curso associado.

        Retorna:
            bool: True se a prévia for obrigatória, False caso contrário.
        """
        return self.curso.regra_sessao_publica == RegraSessaoPublicaEnum.OBRIGATORIO.value

    @property
    def possui_previa(self):
        """
        Retorna um booleano indicando se o TCC terá uma prévia, considerando a regra do curso associado.

        Retorna:
            bool: True se o curso permitir ou exigir prévia, False caso contrário.
        """
        return self.curso.regra_sessao_publica != RegraSessaoPublicaEnum.DESABILITAR.value

    class Meta:
        abstract = False

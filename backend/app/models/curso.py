from django.db import models
from django.utils.timezone import now
from .professorInterno import ProfessorInterno
from app.enums import RegraSessaoPublicaEnum


class Curso(models.Model):
    """
    Modelo que representa um curso no sistema.

    Atributos:
        nome (CharField): Nome completo do curso.
        sigla (CharField): Sigla do curso (ex: ADS, ENG).
        descricao (TextField): Breve descrição do curso.
        ultima_atualizacao (DateTimeField): Data da última atualização do registro.
        data_criacao (DateTimeField): Data de criação do registro.
        limite_orientacoes (IntegerField): Limite de orientações por professor.
        regra_sessao_publica (CharField): Regras para sessões públicas.
        visible (BooleanField): Se o curso está ativo ou não.
        prazo_propostas_inicio (DateField): Data de início do prazo para envio de propostas.
        prazo_propostas_fim (DateField): Data de fim do prazo para envio de propostas.
        professores (ManyToManyField): Professores associados ao curso.
        template_avaliacao (OneToOneField): Template de avaliação associado ao curso.
        historico_coordenadores (Reverse Relationship): Histórico de coordenadores associados ao curso.

    Métodos:
        get_coordenador_atual():
            Retorna o coordenador atual do curso com base no histórico de coordenadores.

        is_prazo_propostas_aberto():
            Retorna um booleano indicando se o período para envio de propostas está aberto.

        get_template_avaliacao():
            Retorna o template de avaliação associado ao curso. Retorna None caso não exista um template.

        get_historico_coordenadores():
            Retorna o histórico completo de coordenadores do curso, incluindo o nome e a data de alteração, ordenados do mais recente ao mais antigo.

        __str__():
            Retorna uma representação em string do curso com o nome e a sigla.
    """

    nome = models.CharField(max_length=255, verbose_name="Nome do curso")
    sigla = models.CharField(max_length=3, verbose_name="Sigla do curso")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")
    ultima_atualizacao = models.DateTimeField(auto_now=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    limite_orientacoes = models.IntegerField(
        verbose_name="Limite de orientações por professor", default=5
    )
    regra_sessao_publica = models.CharField(
        max_length=20,
        choices=RegraSessaoPublicaEnum.choices(),
        default=RegraSessaoPublicaEnum.OPCIONAL.value,
        verbose_name="Regra para sessões públicas"
    )
    visible = models.BooleanField(verbose_name="Visibilidade do Curso", default=True)
    prazo_propostas_inicio = models.DateField(
        verbose_name="Início do prazo para envio de propostas"
    )
    prazo_propostas_fim = models.DateField(
        verbose_name="Fim do prazo para envio de propostas"
    )

    professores = models.ManyToManyField(
        ProfessorInterno,
        related_name="cursos",
        verbose_name="Professores associados ao curso",
    )

    def __str__(self):
        """
        Retorna uma representação em string do curso com o nome e a sigla.

        Exemplo:
            "Análise e Desenvolvimento de Sistemas (ADS)"
        """
        return f"{self.nome} ({self.sigla})"


    def get_coordenador_atual(self):
        """
        Retorna o coordenador atual do curso com base no histórico de coordenadores.

        Retorna:
            ProfessorInterno: Coordenador atual do curso ou None, se não houver.
        """
        historico = self.historico_coordenadores.order_by('-data_alteracao').first()
        return historico.coordenador if historico else None
    
    def get_historico_coordenadores(self):
        """
        Retorna o histórico completo de coordenadores do curso.

        Retorna:
            list[dict]: Lista de dicionários contendo 'nome' do coordenador e 'data_alteracao',
                        ordenada do mais recente ao mais antigo.
        """
        historico = self.historico_coordenadores.order_by('-data_alteracao')
        return [
            {
                "nome": item.coordenador.nome,
                "data_alteracao": item.data_alteracao.strftime('%d/%m/%Y')
            }
            for item in historico
        ]


    def is_prazo_envio_propostas_aberto(self):
        """
        Verifica se o período para envio de propostas está aberto.

        Retorna:
            bool: True se o período estiver aberto, False caso contrário.
        """
        hoje = now().date()
        return self.prazo_propostas_inicio <= hoje <= self.prazo_propostas_fim

    def get_template_avaliacao(self):
        """
        Retorna o template de avaliação associado ao curso.

        Retorna:
            TemplateAvaliacao: O template de avaliação do curso.
            None: Caso o curso não tenha um template associado.
        """
        return getattr(self, 'template_avaliacao', None)
    


    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"    


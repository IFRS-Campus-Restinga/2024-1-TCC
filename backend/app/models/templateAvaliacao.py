from django.db import models
from .curso import Curso

class TemplateAvaliacao(models.Model):
    """
    Modelo que representa o template de avaliação de um curso.

    Atributos:
        curso (OneToOneField): Curso associado ao template.
        numero_avaliadores (IntegerField): Número de avaliadores do TCC (excluindo o orientador).
        nota_minima (FloatField): Nota mínima necessária para aprovação.
        peso_orientador (FloatField): Peso atribuído à nota do orientador na média final.
        peso_avaliadores (FloatField): Peso atribuído à nota de cada avaliador na média final.
        data_criacao (DateTimeField): Data em que o template foi criado.
        ultima_atualizacao (DateTimeField): Data da última modificação do template.
        criterios (RelatedName): Lista de critérios de avaliação associados a este template.

    Métodos:
        calcular_peso_total(): Retorna o peso total do template, considerando orientador e avaliadores.
        validar_criterios(): Verifica se todos os critérios associados são válidos (nome e área não podem estar em branco, e nota máxima deve ser maior que zero).
        get_template_completo(): Retorna um dicionário com os detalhes do template e critérios organizados por área.
        calcular_media(notas_avaliadores): Calcula a média final da avaliação com base nas notas fornecidas pelos avaliadores e orientador, considerando seus respectivos pesos.
    """

    curso = models.OneToOneField(
        Curso,
        on_delete=models.CASCADE,
        related_name="template_avaliacao",
        verbose_name="Curso"
    )
    numero_avaliadores = models.IntegerField(verbose_name="Número de avaliadores")
    nota_minima = models.FloatField(verbose_name="Nota mínima para aprovação")
    peso_orientador = models.FloatField(verbose_name="Peso da nota do orientador")
    peso_avaliadores = models.FloatField(verbose_name="Peso das notas dos avaliadores")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de criação")
    ultima_atualizacao = models.DateTimeField(auto_now=True, verbose_name="Última atualização")

    class Meta:
        verbose_name = "Template de Avaliação"
        verbose_name_plural = "Templates de Avaliação"

    def __str__(self):
        return f"Template - {self.curso.nome}"

    def calcular_peso_total(self):
        """
        Retorna o peso total considerando o peso do orientador e dos avaliadores.

        Retorna:
            float: Peso total.
        """
        return self.peso_orientador + (self.peso_avaliadores * self.numero_avaliadores)

    def validar_criterios(self):
        """
        Verifica se os critérios associados ao template são válidos.

        Retorna:
            bool: True se todos os critérios forem válidos, False caso contrário.
        """
        criterios = self.criterios.all()
        return all(
            criterio.nota_maxima > 0 and criterio.nome.strip() and criterio.area.strip()
            for criterio in criterios
        )

    def get_template_completo(self):
        """
        Retorna o template de avaliação com todos os seus critérios organizados por área.

        Retorna:
            dict: Dicionário contendo as informações do template e critérios organizados por área.
        """
        criterios = self.criterios.all()
        template_completo = {
            "curso": self.curso.nome,
            "numero_avaliadores": self.numero_avaliadores,
            "nota_minima": self.nota_minima,
            "peso_orientador": self.peso_orientador,
            "peso_avaliadores": self.peso_avaliadores,
            "data_criacao": self.data_criacao,
            "ultima_atualizacao": self.ultima_atualizacao,
            "criterios": {}
        }
        for criterio in criterios:
            if criterio.area not in template_completo["criterios"]:
                template_completo["criterios"][criterio.area] = []
            template_completo["criterios"][criterio.area].append({
                "nome": criterio.nome,
                "nota_maxima": criterio.nota_maxima,
            })
        return template_completo

    
    def calcular_media(self, notas_avaliadores):
        """
        Calcula a média final de uma avaliação considerando os pesos.

        Args:
            notas_avaliadores (dict): Dicionário com as notas atribuídas pelo orientador e avaliadores.
                Exemplo:
                {
                'orientador': {'Estrutura do Trabalho': 1.0, ...},
                'avaliador1': {...},
                'avaliador2': {...}
                }

        Retorna:
            float: Média final calculada.

        Lança:
            ValueError: Caso as notas estejam incompletas ou o número de avaliadores não corresponda ao template.
        """
        # Verifica se a nota do orientador está presente
        if 'orientador' not in notas_avaliadores:
            raise ValueError("Nota do orientador não encontrada.")

        # Verifica o número de avaliadores
        avaliadores = [key for key in notas_avaliadores.keys() if key != 'orientador']
        if len(avaliadores) != self.numero_avaliadores:
            raise ValueError("Número de avaliadores incorreto.")

        # Calcula a soma das notas ponderadas
        total_peso = self.calcular_peso_total()
        soma_ponderada = sum(
            self.peso_orientador * sum(notas_avaliadores['orientador'].values())
        )
        for avaliador in avaliadores:
            soma_ponderada += self.peso_avaliadores * sum(notas_avaliadores[avaliador].values())

        # Calcula a média final
        media_final = soma_ponderada / total_peso
        return media_final

from django.db import models

class CriteriosEnum(models.TextChoices):
    ESTRUTURA_TRABALHO = 'Estrutura do Trabalho',
    RELEVANCIA_ORIGINALIDADE_QUALIDADE = 'Relevância, Originalidade e Qualidade',
    GRAU_CONHECIMENTO = 'Grau de Conhecimento',
    BIBLIOGRAFIA_APRESENTADA = 'Bibliografia Apresentada',
    UTILIZACAO_RECURSOS_DIDATICOS = 'Utilização de Recursos Didáticos',
    CONTEUDO_APRESENTACAO = 'Conteúdo da Apresentação',
    UTILIZACAO_TEMPO_SINTESE = 'Utilização do Tempo e Síntese'

    def __str__(self):
        return self.label
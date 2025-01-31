from enum import Enum

class RegraSessaoPublicaEnum(Enum):
    """
    Enum que representa as regras para sessões públicas de TCC.

    Valores:
        DESABILITAR: Sessões públicas desabilitadas.
        OPCIONAL: Sessões públicas opcionais.
        OBRIGATORIO: Sessões públicas obrigatórias.
    """
    DESABILITAR = "Desabilitar"
    OPCIONAL = "Opcional"
    OBRIGATORIO = "Obrigatório"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

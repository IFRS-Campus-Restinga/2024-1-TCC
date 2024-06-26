from django.contrib import admin

from .models import Avaliacao, Banca, BancaPrioridade, Configuracoes, Coordenador, Estudante, Professor, HorarioAtendimento, ProfessorExterno, ProfessorInterno, Sessao, SessaoFinal, SessaoPrevia, StatusCadastro, TccStatus, Tcc, Tema, Usuario, Semestre, Convite, SemestreCoordenador

# Register your models here.
admin.site.register((
    Usuario,
    Estudante,
    Professor,
    HorarioAtendimento,
    ProfessorInterno,
    ProfessorExterno,
    Tcc,
    Avaliacao,
    Sessao,
    SessaoFinal,
    SessaoPrevia,
    Banca,
    BancaPrioridade,
    Configuracoes,
    Coordenador,
    StatusCadastro,
    TccStatus,
    Tema,
    Semestre,
    Convite,
    SemestreCoordenador,
))
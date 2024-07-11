from django.contrib import admin

from .models import Avaliacao, Banca, Coordenador, Estudante, Professor, HorarioAtendimento, ProfessorExterno, ProfessorInterno, Sessao, SessaoFinal, SessaoPrevia, StatusCadastro, TccStatus, Tcc, Tema, Usuario, Semestre, Convite, SemestreCoordenador, Mensagem, Nota

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
    Coordenador,
    StatusCadastro,
    TccStatus,
    Tema,
    Semestre,
    Convite,
    SemestreCoordenador,
    Mensagem,
    Nota
))
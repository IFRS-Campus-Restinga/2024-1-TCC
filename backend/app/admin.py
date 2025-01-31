from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import Avaliacao, Banca, Coordenador, Curso, Estudante, Professor, HorarioAtendimento, ProfessorExterno, ProfessorInterno, Sessao, SessaoFinal, SessaoPrevia, StatusCadastro, TccStatus, Tcc, Tema, Usuario, Semestre, SemestreCoordenador, Mensagem, Nota, SuperAdmin, HistoricoCoordenadorCurso

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
    SemestreCoordenador,
    Mensagem,
    Nota,
    SuperAdmin,
    Curso,
    HistoricoCoordenadorCurso
))
from django.urls import path, include
from . import views


urlpatterns = [
    path('professores', views.GetProfessores.as_view(), name='professor-list-create'),
    path('criar-tcc', views.CriarTCView.as_view(), name='criar-tcc'),
    path('criar-usuario', views.CriarUsuarioView.as_view(), name='criar-usuario'),
    path('autenticar', views.ObterTokenView.as_view(), name='autenticar-usuario'),
    path('proposta-submetida', views.PropostaSubmetidaView.as_view(), name='proposta-submetida'),
    path('atualizar-datas-propostas', views.AtualizarDatasPropostasView.as_view(), name='atualizar-datas-propostas'),
    path('professores-pendentes', views.ProfessoresPendentesListAPIView.as_view(), name='professores-pendentes'),
    path('detalhes-usuario', views.DetalhesUsuario.as_view(), name='detalhes-usuario'),
    path('listar-usuarios', views.ListarUsuarios.as_view(), name='listar-usuarios'),
]


from django.urls import path, include
from . import views
from .views.semestre import *
from .views.sessao import *
from .views.curso import *
from django.conf import settings
from django.conf.urls.static import static
from .views.search import SearchView

urlpatterns = [
    path('cursos-simplificados', CursosSimplificadosView.as_view(), name='listar-cursos-simplificados'),
    path('cursos', CursosView.as_view(), name='listar-cursos'),
    path('gerenciar-curso/<int:curso_id>/', GerenciarCursosView.as_view(), name='gerenciar-curso'),
    path('gerenciar-curso', GerenciarCursosView.as_view(), name='criar-curso'),
    path('professores', views.GetProfessores.as_view(), name='professor-list-create'),
    path('professores-internos', views.GetProfessoresInternos.as_view(), name='professores-internos'),
    path('criar-tcc', views.CriarTCCView.as_view(), name='criar-tcc'),
    path('editar-tcc/<int:tccid>/', views.EditarTCCView.as_view(), name='editar-tcc'),
    path('criar-usuario', views.CriarUsuarioView.as_view(), name='criar-usuario'),
    path('autenticar', views.ObterTokenView.as_view(), name='autenticar-usuario'),
    path('semestre-atual', SemestreAtualView.as_view(), name='semestre_atual'),
    path('semestres', SemestresView.as_view(), name='semestres'),
    path('semestre/<int:semestreid>', SemestreView.as_view(), name='semestre'),
    path('coordenadores-semestre/<int:semestreid>', SemestreCoordenadoresView.as_view(), name='coordenadores-semestre'),
    path('criar-semestre', CriarSemestreView.as_view(), name='criar-semestre'),
    path('historico-coordenadores', SemestreAtualCoordenadoresView.as_view(), name='historico-coordenadores'),
    path('atualizar-datas-propostas', views.AtualizarDatasPropostasView.as_view(), name='atualizar-datas-propostas'),
    path('alterar-coordenador', views.AlterarCoordenadorSemestre.as_view(), name='alterar-coordenador'),
    path('coordenador', views.CoordenadorAtualView.as_view(), name='coordenador'),
    path('sessoes-futuras', SessoesFuturasView.as_view(), name='sessoes-futuras'),
    path('sessoes-futuras-orientador', SessoesFuturasOrientadorView.as_view(), name='sessoes-futuras-orientador'),
    path('editar-sessao', SessaoEditView.as_view(), name='editar-sessao'),
    path('editar-sessao-orientador', SessaoEditOrientadorView.as_view(), name='editar-sessao-orientador'),
    path('professores-pendentes', views.ProfessoresPendentesListAPIView.as_view(), name='professores-pendentes'),
    path('aprovar-professor/<int:idProfessor>', views.AprovarProfessorAPIView.as_view(), name='aprovar-professor'),
    path('recusar-professor/<int:idProfessor>', views.RecusarProfessorAPIView.as_view(), name='recusar-professor'),
    path('detalhes-usuario', views.DetalhesUsuario.as_view(), name='detalhes-usuario'),
    path('listar-usuarios', views.ListarUsuarios.as_view(), name='listar-usuarios'),
    path('detalhes-tcc/<int:tccid>/', views.DetalhesTCCView.as_view(), name='detalhes_tcc'),
    path('listar-tccs-pendente', views.ListarTccPendente.as_view(), name='listar-tccs'),
    path('tccs-by-aluno', views.TCCsByAluno.as_view(), name='tccs-by-aluno'),
    path('tccs-by-orientador', views.TCCsByOrientador.as_view(), name='tccs-by-orientador'),
    path('tccs-coordenacao', views.TCCs.as_view(), name='tccs-coordenacao'),
    path('possui-proposta', views.PossuiProposta.as_view(), name='possui-proposta'),
    path('responder-proposta/<int:tccId>', views.TccStatusResponderPropostaView.as_view(), name='responder-proposta'),
    path('upload/professor-externo/', views.FileUploadView.as_view(), name='file-upload-externo'),
    path('notificacoes', views.ListarNotificacoesNaoLidas.as_view(), name='notificacoes'),
    path('limpar-notificacoes', views.MarcarNotificacoesComoLidas.as_view(), name='limpar-notificacoes'),
    path('upload-autorizacao-publicacao/<int:tccId>/', views.UploadAutorizacaoPublicacaoView.as_view(), name='upload_autorizacao_publicacao'),
    path('upload-documento-tcc/<int:tccId>/', views.UploadDocumentoTCCView.as_view(), name='upload-documento-tcc'),
    path('upload-documento-sessao/<int:sessaoId>/', views.UploadDocumentoSessaoView.as_view(), name='upload-documento-sessao'),
    path('excluir-documento-tcc/<int:tccId>/', views.ExcluirDocumentoTCCView.as_view(), name='excluir-documento-tcc'),
    path('excluir-documento-sessao/<int:sessaoId>/', views.ExcluirDocumentoSessaoView.as_view(), name='excluir-documento-sessao'),
    path('download-documento-tcc/<int:tccId>/', views.DownloadDocumentoTCCView.as_view(), name='download-documento-tcc'),
    path('download-documento-sessao/<int:sessaoId>/', views.DownloadDocumentoSessaoView.as_view(), name='download-documento-sessao'),
    path('download-ficha-avaliacao/<int:avaliacaoId>/', views.DownloadFichaAvaliacaoView.as_view(), name='download-ficha-avaliacao'),
    path('upload-ficha-avaliacao/<int:avaliacaoId>/', views.UploadFichaAvaliacaoView.as_view(), name='upload-ficha-avaliacao'),
    path('excluir-ficha-avaliacao/<int:avaliacaoId>/', views.ExcluirFichaAvaliacaoView.as_view(), name='excluir-ficha-avaliacao'),
    path('download-documento-ajuste/<int:avaliacaoId>/', views.DownloadDocumentoAjusteView.as_view(), name='download-documento-ajuste'),
    path('upload-documento-ajuste/<int:avaliacaoId>/', views.UploadDocumentoAjusteView.as_view(), name='upload-documento-ajuste'),
    path('excluir-documento-ajuste/<int:avaliacaoId>/', views.ExcluirDocumentoAjusteView.as_view(), name='excluir-documento-ajuste'),
    path('download-ficha-avaliacao-preenchida/<int:avaliacaoId>/', views.DownloadFichaAvaliacaoPreenchidaView.as_view(), name='download-ficha-avaliacao-preenchida'),
    path('avaliar/<int:sessaoId>/', views.Avaliar.as_view(), name='avaliar'),
    path('avaliar-ajustes/<int:avaliacaoId>/', views.AvaliarAjustes.as_view(), name='avaliar-ajustes'),
    path('avaliar-previa/<int:sessaoId>/', AvaliarPreviaView.as_view(), name='avaliar-previa'),
    path('semestre-datas', SemestreDatasView.as_view(), name='semestre-datas'),
    path('nova-sessao', SessaoCreateView.as_view(), name='nova-sessao'),
    path('tccs-publicados', views.TCCsPublicadosView.as_view(), name='tccs-publicados'),
    path('atualizar-perfil', views.AtualizarPerfil.as_view(), name='atualizar-perfil'),
    path('perfil/<int:id>/', views.PerfilByIdView.as_view(), name='perfil-by-id'),
    path('tccs-by-usuario/<int:id>/', views.TccsByUsuarioView.as_view(), name='tccs-by-usuario-id'),
    path('temas-sugeridos', views.TemasSugeridosView.as_view(), name='temas-sugeridos'),
    path('meus-temas-sugeridos', views.MeusTemasSugeridosView.as_view(), name='temas-sugeridos'),
    path('criar-tema', views.CriarTemaView.as_view(), name='criar-tema'),
    path('atualizar-tema/<int:pk>/', views.AtualizarTemaView.as_view(), name='atualizar-tema'),
    path('excluir-tema/<int:pk>/', views.ExcluirTemaView.as_view(), name='excluir-tema'),
    path('search', SearchView.as_view(), name='search'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# py manage.py shell
# >>> exec(open('script_inicial.py').read())

from django.contrib.auth.models import User
from app.models import TccStatus, Tcc, Semestre, ProfessorInterno, Estudante, StatusCadastro, Coordenador, ProfessorExterno, SemestreCoordenador, Mensagem, Tema
from datetime import datetime


# Criando usuário admin
superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")
notifyuser = User.objects.create_user(
    username="notifyuser",
    email="sistema.tcc@restinga.ifrs.edu.br",
    password="123"
)

# Cria Status André
status = StatusCadastro.objects.create(
    aprovacao = True
)
status2 = StatusCadastro.objects.create(
    aprovacao = False
)
status3 = StatusCadastro.objects.create(
    aprovacao = False,
    justificativa="Justificativa exemplo"
)

status4 = StatusCadastro.objects.create(
    aprovacao = True
)

status6 = StatusCadastro.objects.create(
    aprovacao = True
)
status5 = StatusCadastro.objects.create(
    aprovacao = False,
    justificativa="Justificativa exemplo"
)

# Cria um professor interno
andreUser = User.objects.create_user("andre@restinga.ifrs.edu.br", "andre@restinga.ifrs.edu.br", "151515")
andre = ProfessorInterno.objects.create(nome="André Schneider", 
                         cpf="12345678911", 
                         email="andre@restinga.ifrs.edu.br",
                         area_atuacao = "CIENCIA DA COMPUTACAO",
                         titulo="DOUTORADO",
                         area_interesse='["ESTRUTURA"]',
                         matricula="1994000401",
                         status = status,
                         user = andreUser,
                         avatar="https://primefaces.org/cdn/primereact/images/organization/walter.jpg"
                        )

ProfInterUser = User.objects.create_user("cleitin@restinga.ifrs.edu.br", "cleitin@restinga.ifrs.edu.br", "05156413231")
cleitin = ProfessorInterno.objects.create(nome="Cleitin da Silva", 
                         cpf="05156413231", 
                         email="cleitin@restinga.ifrs.edu.br",
                         area_atuacao = "CIENCIA DA COMPUTACAO",
                         titulo="DOUTORADO",
                         area_interesse='["ESTRUTURA"]',
                         matricula="1994000402",
                         status = status4,
                         user = ProfInterUser
                        )

ProfInter2User = User.objects.create_user("interno@restinga.ifrs.edu.br", "interno@restinga.ifrs.edu.br", "05156413232")
adastolfo = ProfessorInterno.objects.create(nome="Adastolfo", 
                         cpf="05156413232", 
                         email="interno@restinga.ifrs.edu.br",
                         area_atuacao = "CIENCIA DA COMPUTACAO",
                         titulo="DOUTORADO",
                         area_interesse='["ESTRUTURA"]',
                         matricula="1994000402",
                         status = status5,
                         user = ProfInter2User
                        )

ProfInter3User = User.objects.create_user("iurito@restinga.ifrs.edu.br", "iurito@restinga.ifrs.edu.br", "15828000402")
iuri = ProfessorInterno.objects.create(nome="Iuri", 
                         cpf="039058047012", 
                         email="interno@restinga.ifrs.edu.br",
                         area_atuacao = "CIENCIA DA COMPUTACAO",
                         titulo="DOUTORADO",
                         area_interesse="Prog",
                         matricula="15828000402",
                         status = status6,
                         user = ProfInter3User
                        )

# Adiciona professor como atual coordenador
# Cria usuario estudante
estudanteUser = User.objects.create_user("estudante@gmail.com", "estudante@gmail.com", "12345678912")
estudante = Estudante.objects.create(nome="Estudante", 
                      cpf="12345678912", 
                      email="estudante@gmail.com",
                      user=estudanteUser)

coordenadorUser = User.objects.create_user("coordenador@gmail.com", "coordenador@gmail.com", "151515")
coordenador = Coordenador.objects.create(nome="Coordenador", cpf="151515", email="coordenador@gmail.com", user = coordenadorUser)

ProfExternoUser = User.objects.create_user("externo@gmail.com", "externo@gmail.com", "98765432153")
ProfExterno = ProfessorExterno.objects.create(
                        nome="ProfExterno",
                        cpf="98765432153", 
                        email="externo@gmail.com",
                        area_atuacao = "CIENCIA DA COMPUTACAO",
                        titulo="DOUTORADO",
                        area_interesse='["ESTRUTURA"]',
                        status = status3,
                        user = ProfExternoUser
                        )

ProfExterno2User = User.objects.create_user("externo2@gmail.com", "externo2@gmail.com", "98765432154")
ProfExterno = ProfessorExterno.objects.create(
                        nome="ProfExterno2",
                        cpf="98765432154", 
                        email="externo2@gmail.com",
                        area_atuacao = "CIENCIA DA COMPUTACAO",
                        titulo="DOUTORADO",
                        area_interesse='["ESTRUTURA"]',
                        status = status2,
                        user = ProfExterno2User
                        )

semestre1 = Semestre.objects.create(
        periodo='2024/1',
        dataAberturaSemestre='2024-01-01',
        dataFechamentoSemestre='2024-06-30',
        dataAberturaPrazoPropostas='2024-03-20',
        dataFechamentoPrazoPropostas='2024-04-15',
    )

semestre2 = Semestre.objects.create(
        periodo='2023/2',
        dataAberturaSemestre='2023-07-01',
        dataFechamentoSemestre='2023-12-31',
        dataAberturaPrazoPropostas='2023-07-15',
        dataFechamentoPrazoPropostas='2023-08-22',
    )

coordSemestre = SemestreCoordenador.objects.create(
    coordenador=andre,
    semestre = semestre1
)

tcc = Tcc.objects.create(
        autor= estudante,
        orientador= cleitin,
        semestre= semestre1,
        tema='Pesquisa sobre o porquê o Tiririca é tão bom deputado',
        resumo='Este trabalho apresenta uma pesquisa sobre o porquê o Tiririca é tão bom deputado.'
    )

tcc2 = Tcc.objects.create(
        autor= estudante,
        orientador= cleitin,
        semestre= semestre2,
        tema='Desenvolvimento de um Sistema de Gerenciamento de Tarefas',
        resumo='Este trabalho apresenta o desenvolvimento de um sistema web para gerenciamento de tarefas, utilizando Django como framework.'
    )

tcc_status = TccStatus.objects.create(
                        status= "REPROVADO_PREVIA",
                        dataStatus= datetime.today(),
                        tcc= tcc                                

)

tcc_status = TccStatus.objects.create(
                        status= "PROPOSTA_ANALISE_PROFESSOR",
                        dataStatus= datetime.today(),
                        tcc= tcc2                                

)

# Temas para propostas de tcc
tema1 = Tema.objects.create(
    titulo='Pesquisa sobre o porquê o Tiririca é tão bom deputado',
    descricao='Este trabalho apresenta uma pesquisa sobre o porquê o Tiririca é tão bom deputado.',
    professor=adastolfo,
)

tema2 = Tema.objects.create(
    titulo='Desenvolvimento de um Sistema de Gerenciamento de Tarefas',
    descricao='Este trabalho apresenta o desenvolvimento de um sistema web para gerenciamento de tarefas, utilizando Django como framework.',
    professor=cleitin,
)

tema3 = Tema.objects.create(
    titulo='Análise de Algoritmos de Machine Learning',
    descricao='Este trabalho apresenta uma análise comparativa de diferentes algoritmos de machine learning.',
    professor=andre,
)

tema4 = Tema.objects.create(
    titulo='Sistema de Recomendação para E-commerce',
    descricao='Este trabalho apresenta o desenvolvimento de um sistema de recomendação utilizando técnicas de machine learning para e-commerce.',
    professor=cleitin,
)

tema5 = Tema.objects.create(
    titulo='Desenvolvimento de um Chatbot para Atendimento ao Cliente',
    descricao='Este trabalho apresenta o desenvolvimento de um chatbot utilizando processamento de linguagem natural para atendimento ao cliente.',
    professor=andre,
)

tema6 = Tema.objects.create(
    titulo='Aplicação de Blockchain em Sistemas de Votação',
    descricao='Este trabalho apresenta uma aplicação da tecnologia blockchain para melhorar a segurança e transparência em sistemas de votação.',
    professor=iuri,
)

mensagem1 = Mensagem.objects.create(
        identificador= "PROP001",
        assunto = "[Meus TCCs - Restinga] Nova solicitação de orientação",
        mensagem="""Olá {ORIENTADOR_NOME},

Você recebeu uma nova solicitação de orientação no sistema Meus TCCs. Seguem os detalhes:

    • Estudante: {ESTUDANTE_NOME}
    • Tema: {TCC_TEMA}
    • Resumo: {TCC_RESUMO}

Por favor, acesse o sistema para revisar a solicitação e tomar as devidas ações.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
        descricao="Notificação de nova proposta para o orientador",
        url_destino="/proposta-pendente",
        notificacao="Você recebeu uma solicitação de orientação"
    )

mensagem2 = Mensagem.objects.create(
        identificador= "PROP002",
        assunto = "[Meus TCCs - Restinga] Nova solicitação de coorientação",
        mensagem="""Olá {COORIENTADOR_NOME},

Você recebeu uma nova solicitação de coorientação no sistema Meus TCCs. Seguem os detalhes:

    • Estudante: {ESTUDANTE_NOME}
    • Tema: {TCC_TEMA}
    • Resumo: {TCC_RESUMO}

Por favor, acesse o sistema para revisar a solicitação e tomar as devidas ações.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
        descricao="Notificação de nova proposta para o coorientador",
        url_destino="/proposta-pendente",
        notificacao="Você recebeu uma solicitação de coorientação"
    )

mensagem3 = Mensagem.objects.create(
        identificador= "CAD001",
        assunto = "[Meus TCCs - Restinga] Nova solicitação de cadastro",
        mensagem="""Olá {COORDENADOR_NOME},

Gostaríamos de informar que há uma nova solicitação de cadastro no sistema Meus TCCs aguardando sua aprovação. 

Por favor, acesse o sistema para revisar a solicitação e tomar as devidas ações.

Detalhes das solicitações pendentes:

  • Nome do Solicitante: {PROFESSOR_NOME}
  • E-mail do Solicitante: {PROFESSOR_EMAIL}
  • Tipo do Registro: {PROFESSOR_VINCULO}

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
        descricao="Notificação de novo cadastro para o coordenador",
        url_destino="/atualizar-permissoes",
        notificacao="Há uma nova solicitação de cadastro aguardando aprovação"
    )

mensagem4 = Mensagem.objects.create(
        identificador= "CAD002",
        assunto = "[Meus TCCs - Restinga] Solicitação de cadastro aprovada",
        mensagem="""Olá {PROFESSOR_NOME},

É com prazer que informamos que seu cadastro no sistema Meu TCC Restinga foi aprovado com sucesso!          

Agora você pode acessar todas as funcionalidades disponíveis para realizar o acompanhamento do seu TCC.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
        descricao="Notificação de cadastro aprovado para o professor",
        url_destino=None,
        notificacao=None
    )

mensagem5 = Mensagem.objects.create(
        identificador= "CAD003",
        assunto = "[Meus TCCs - Restinga] Solicitação de cadastro negada",
        mensagem="""Olá {PROFESSOR_NOME},

Lamentamos informar que seu cadastro no sistema Meus TCCs foi negado. Abaixo está a justificativa para a negativa:

    • {JUSTIFICATIVA}

Por favor, verifique as informações fornecidas e tente novamente.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
        descricao="Notificação de cadastro negado para o professor",
        url_destino=None,
        notificacao=None
    )

mensagem6 = Mensagem.objects.create(
        identificador= "SESSAO002",
        assunto = "[Meus TCCs - Restinga] Nova {SESSAO_TIPO} agendada",
        mensagem="""Olá {PROFESSOR_NOME},

Temos o prazer de informar que a {SESSAO_TIPO} do TCC {TCC_TEMA} do aluno {ESTUDANTE_NOME} foi agendada.

Detalhes do agendamento:

    • Data: {SESSAO_DATA}
    • Hora: {SESSAO_HORA}
    • Local: {SESSAO_LOCAL}

Por favor, confirme sua presença e prepare-se para a avaliação do trabalho.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
        descricao="Notificação de agendamento de sessão para banca",
        url_destino="/detalhes-tcc/{id}",
        notificacao="Uma nova {SESSAO_TIPO} foi agendada"
    )

mensagem7 = Mensagem.objects.create(
        identificador= "SESSAO003",
        assunto = "[Meus TCCs - Restinga] Nova {SESSAO_TIPO} agendada",
        mensagem="""Olá {ESTUDANTE_NOME},

Temos o prazer de informar que A {SESSAO_TIPO} do TCC {TCC_TEMA} foi agendada.

Detalhes do agendamento:

    • Data: {SESSAO_DATA}
    • Hora: {SESSAO_HORA}
    • Local: {SESSAO_LOCAL}

Por favor, esteja preparado para a apresentação e verifique todos os detalhes necessários com antecedência.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
        descricao="Notificação de agendamento de sessão para o estudante",
        url_destino="/detalhes-tcc/{id}",
        notificacao="Uma nova {SESSAO_TIPO} foi agendada"
    )

mensagem8 = Mensagem.objects.create(
    identificador="LEMBRETE001",
    assunto="[Meus TCCs - Restinga] Lembrete: {SESSAO_TIPO} agendada para daqui a uma semana",
    mensagem="""Olá {PROFESSOR_NOME},

Este é um lembrete de que a {SESSAO_TIPO} do TCC {TCC_TEMA} do aluno {ESTUDANTE_NOME} está agendada para daqui a uma semana.

Detalhes do agendamento:

    • Data: {SESSAO_DATA}
    • Hora: {SESSAO_HORA}
    • Local: {SESSAO_LOCAL}

Por favor, confirme sua presença e prepare-se para a avaliação do trabalho.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
    descricao="Lembrete de agendamento de sessão para o professor, uma semana antes",
    url_destino="/detalhes-tcc/{id}",
    notificacao="Lembrete: {SESSAO_TIPO} agendada para daqui a uma semana"
)

mensagem9 = Mensagem.objects.create(
    identificador="LEMBRETE002",
    assunto="[Meus TCCs - Restinga] Lembrete: {SESSAO_TIPO} agendada para daqui a uma semana",
    mensagem="""Olá {ESTUDANTE_NOME},

Este é um lembrete de que a {SESSAO_TIPO} do TCC {TCC_TEMA} está agendada para daqui a uma semana.

Detalhes do agendamento:

    • Data: {SESSAO_DATA}
    • Hora: {SESSAO_HORA}
    • Local: {SESSAO_LOCAL}

Por favor, verifique todos os detalhes e prepare-se para a apresentação.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
    descricao="Lembrete de agendamento de sessão para o estudante, uma semana antes",
    url_destino="/detalhes-tcc/{id}",
    notificacao="Lembrete: {SESSAO_TIPO} agendada para daqui a uma semana"
)

mensagem10 = Mensagem.objects.create(
    identificador="LEMBRETE003",
    assunto="[Meus TCCs - Restinga] Lembrete final: {SESSAO_TIPO} agendada para amanhã",
    mensagem="""Olá {PROFESSOR_NOME},

Este é um lembrete final de que a {SESSAO_TIPO} do TCC {TCC_TEMA} do aluno {ESTUDANTE_NOME} está agendada para amanhã.

Detalhes do agendamento:

    • Data: {SESSAO_DATA}
    • Hora: {SESSAO_HORA}
    • Local: {SESSAO_LOCAL}

Por favor, confirme sua presença e prepare-se para a avaliação do trabalho.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
    descricao="Lembrete final de agendamento de sessão para o professor, um dia antes",
    url_destino="/detalhes-tcc/{id}",
    notificacao="Lembrete final: {SESSAO_TIPO} agendada para amanhã"
)

mensagem11 = Mensagem.objects.create(
    identificador="LEMBRETE004",
    assunto="[Meus TCCs - Restinga] Lembrete final: {SESSAO_TIPO} agendada para amanhã",
    mensagem="""Olá {ESTUDANTE_NOME},

Este é um lembrete final de que a {SESSAO_TIPO} do TCC {TCC_TEMA} está agendada para amanhã.

Detalhes do agendamento:

    • Data: {SESSAO_DATA}
    • Hora: {SESSAO_HORA}
    • Local: {SESSAO_LOCAL}

Por favor, assegure-se de estar preparado e de que todos os detalhes estejam em ordem para a sua apresentação.

Atenciosamente,

Equipe Meus TCCs - Campus Restinga

---

Este é um e-mail automático, por favor, não responda.""",
    descricao="Lembrete de agendamento de sessão para o estudante, um dia antes",
    url_destino="/detalhes-tcc/{id}",
    notificacao="Lembrete final: {SESSAO_TIPO} agendada para amanhã"
)

print("Usuários criados com sucesso!")
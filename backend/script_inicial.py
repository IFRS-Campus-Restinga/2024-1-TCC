# py manage.py shell
# >>> exec(open('script_inicial.py').read())

from django.contrib.auth.models import User
from app.models import TccStatus, Tcc, Semestre, ProfessorInterno, Estudante, StatusCadastro, Coordenador, ProfessorExterno, SemestreCoordenador, Mensagem, Tema, Curso, SuperAdmin
from datetime import datetime

# Criação de um SuperAdmin de teste
superadmin = SuperAdmin.objects.create_superuser(
    email="matheusmachado77@gmail.com",
    password="admin123"
)

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
from datetime import datetime
from app.models import Curso

# Criação do curso ADS armazenado no objeto `ads`
ads = Curso.objects.create(
    nome="Tecnologia em Análise e Desenvolvimento de Sistemas",
    sigla="ADS",
    descricao="Curso técnico focado no desenvolvimento de sistemas computacionais.",
    ultima_atualizacao=datetime.today(),
    data_criacao=datetime.today(),
    limite_orientacoes=3,
    regra_sessao_publica="OBRIGATORIO",
    prazo_propostas_inicio=datetime.today(),
    prazo_propostas_fim=datetime.today()
)

# Criação dos outros cursos
cursos = [
    {
        "nome": "Licenciatura em Letras Português e Espanhol",
        "sigla": "LPE",
        "descricao": "Curso voltado à formação de professores de Língua Portuguesa e Espanhol.",
    },
    {
        "nome": "Tecnologia em Agroecologia",
        "sigla": "TAG",
        "descricao": "Curso voltado ao desenvolvimento de técnicas sustentáveis na agroecologia.",
    },
    {
        "nome": "Tecnologia em Eletrônica Industrial",
        "sigla": "TEI",
        "descricao": "Curso técnico voltado à eletrônica aplicada no setor industrial.",
    },
    {
        "nome": "Tecnologia em Gestão Desportiva e de Lazer",
        "sigla": "GDL",
        "descricao": "Curso voltado à gestão de atividades esportivas e de lazer.",
    },
    {
        "nome": "Tecnologia em Processos Gerenciais",
        "sigla": "TPG",
        "descricao": "Curso técnico voltado à administração e gerenciamento de processos.",
    },
    {
        "nome": "Engenharia de Software",
        "sigla": "ESW",
        "descricao": "Curso voltado ao desenvolvimento de softwares de alta qualidade.",
    },
    {
        "nome": "Ciência da Computação",
        "sigla": "CCO",
        "descricao": "Curso voltado ao estudo dos fundamentos teóricos e práticos da computação.",
    },
    {
        "nome": "Banco de Dados",
        "sigla": "BD",
        "descricao": "Curso especializado em gerenciamento e administração de bancos de dados.",
    },
    {
        "nome": "Inteligência Artificial",
        "sigla": "IA",
        "descricao": "Curso voltado ao estudo de algoritmos e tecnologias de inteligência artificial.",
    },
]

# Cria os outros cursos no banco de dados
for curso in cursos:
    Curso.objects.create(
        nome=curso["nome"],
        sigla=curso["sigla"],
        descricao=curso["descricao"],
        ultima_atualizacao=datetime.today(),
        data_criacao=datetime.today(),
        limite_orientacoes=3,
        regra_sessao_publica="OBRIGATORIO",
        prazo_propostas_inicio=datetime.today(),
        prazo_propostas_fim=datetime.today()
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
andre.cursos.set([ads])

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


# Temas para propostas de tcc

tema3 = Tema.objects.create(
    titulo='Análise de Algoritmos de Machine Learning',
    descricao='Este trabalho apresenta uma análise comparativa de diferentes algoritmos de machine learning.',
    professor=andre,
)

tema5 = Tema.objects.create(
    titulo='Desenvolvimento de um Chatbot para Atendimento ao Cliente',
    descricao='Este trabalho apresenta o desenvolvimento de um chatbot utilizando processamento de linguagem natural para atendimento ao cliente.',
    professor=andre,
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

# Atualizar os cursos com o novo campo "visible"
ads.visible = True
ads.save()

cursos = Curso.objects.exclude(sigla="ADS")
for i, curso in enumerate(cursos):
    curso.visible = i % 2 == 0  # Alterna entre True e False
    curso.save()

# Criar 12 professores internos para o curso ADS
nomes_professores = [
    "Carlos Silva", "Ana Paula", "Marcos Souza", "Fernanda Lima", "João Pedro",
    "Paula Oliveira", "Roberto Costa", "Mariana Rocha", "Lucas Almeida", "Cláudia Mendes",
    "Ricardo Santos", "Patrícia Duarte"
]

for i, nome in enumerate(nomes_professores):
    user = User.objects.create_user(
        username=f"prof_interno_{i+1}",
        email=f"prof_interno_{i+1}@restinga.ifrs.edu.br",
        password="senha123"
    )
    status_professor = StatusCadastro.objects.create(aprovacao=True)
    professor = ProfessorInterno.objects.create(
        nome=nome,
        cpf=f"123456789{i:02}",
        email=f"prof_interno_{i+1}@restinga.ifrs.edu.br",
        area_atuacao="CIENCIA DA COMPUTACAO",
        titulo="DOUTORADO",
        area_interesse='["ESTRUTURA"]',
        matricula=f"19940004{i+1:02}",
        status=status_professor,
        user=user,
        avatar="https://primefaces.org/cdn/primereact/images/organization/walter.jpg"
    )
    professor.cursos.set([ads])

# Criar 20 estudantes, 2 para cada curso
nomes_estudantes = [
    "Lucas Martins", "Julia Santos", "Pedro Henrique", "Isabela Costa", "Gabriel Souza",
    "Ana Clara", "Rafael Oliveira", "Mariana Silva", "João Vitor", "Laura Almeida",
    "Felipe Rocha", "Camila Mendes", "Thiago Santos", "Fernanda Duarte", "Vinícius Lima",
    "Beatriz Santos", "Gustavo Costa", "Sofia Almeida", "André Silva", "Larissa Rocha"
]

cursos = Curso.objects.all()
for i, curso in enumerate(cursos):
    for j in range(2):
        index = i * 2 + j
        user = User.objects.create_user(
            username=f"estudante_{curso.sigla}_{j+1}",
            email=f"estudante_{curso.sigla}_{j+1}@restinga.ifrs.edu.br",
            password="senha123"
        )
        Estudante.objects.create(
            nome=nomes_estudantes[index],
            cpf=f"123456789{index:02}",
            email=f"estudante_{curso.sigla}_{j+1}@restinga.ifrs.edu.br",
            curso=curso,
            user=user
        )

# Criar 10 coordenadores sem atribuir cursos
for i, curso in enumerate(cursos):
    user = User.objects.create_user(
        username=f"coord_{curso.sigla}",
        email=f"{curso.sigla.lower()}@restinga.ifrs.edu.br",
        password="senha123"
    )
    Coordenador.objects.create(
        nome=f"Coordenador {curso.sigla}",
        cpf=f"123456789{i+10}",
        email=f"{curso.sigla.lower()}@restinga.ifrs.edu.br",
        user=user,
        curso=None  # Campo nullable
    )

print("Atualizações realizadas com sucesso!")

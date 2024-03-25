# 2024/1 - TCC


## Como iniciar
### Front-end
Para iniciar o front-end é preciso ter instalado em seu computador o nodejs (>= 18) e o npm. Com eles instalado, rode o comando para instalar as dependencias
```sh
npm i
```

Em seguida rode o comando para iniciar o projeto
```sh
npm run dev
```

### Back-end
Para iniciar o back-end é preciso ter instalado em seu computador o python e o pip. Com eles instalado, rode o comando para instalar as dependencias
```sh
pip install Django==4.2.6 django-cors-headers==4.3.1 djangorestframework==3.15.1
```

Em seguida rode o comando para atualizar as migrations
```sh
py manage.py makemigrations
py manage.py migrate
```

Na primeira vez que estiver rodando, execute o script inicial para popular as tabelas.
```sh
py manage.py shell < script_inicial.py
```

Em seguida rode o comando para iniciar o projeto
```sh
py manage.py runserver
```
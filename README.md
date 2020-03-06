# YungasTasks
Desafio técnico da empresa Yungas.
Que consiste em um frontend em JAVASCRIPT e um backend em um servidor REST PYTHON em FLASK.

Para rodar o servidor flask localmente é necessario ter o Python3 instalado junto com seus requerimentos (requirements.txt)
Após isso, utilizar o comando: python3 run.py
O servidor flask deverá estar rodando em http://127.0.0.1:5000/
Após isso, é necessario instalar a extensão CORS para o problema de Cross Origin do navegador (Tanto Firefox quanto Google Chrome possuem extensões que funcionam corretamente).
Assim, abrir o arquivo index.html dentro da pasta templates em seu navegador para acessar a aplicação Web.

Caso deseje reiniciar o banco de dados, é possivel indo até a pasta raiz do projeto e fazer o seguinte:
Abrir o terminal de comando e abrir o python3.
E executar:
-from run import db
-db.create_all()
Assim, um arquivo crud.sqlite deverá ser criado com o banco de dados.




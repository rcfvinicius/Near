# Plataforma Educacional

<img src="https://user-images.githubusercontent.com/67292388/204522105-94787a49-6439-458a-9298-b25818cac1cb.png" height="130">

## Projeto de uma aplicação para uma instituição educacional.

<p float="left">
  <img src="https://user-images.githubusercontent.com/67292388/204526092-84a6ea2f-42c6-4075-a642-56375cfb4332.gif" width="360px" />
  <img src="https://user-images.githubusercontent.com/67292388/204532789-8bef10c4-0e03-4309-a1c0-8893e08870ab.gif" width="360px" /> 
</p>


## Principais tecnologias usadas:
> HTML, CSS, JS<br>
React.js<br>
Node.js<br>
Express.js<br>
PostgreSQL<br>
MongoDB


<br>

# A ideia

### A ideia surgiu ainda da épca da faculdade e tinha como objetivo aproximar os alunos dos comerciantes locais. Porém, o projeto mudou totalmente, mantendo somente o nome e se tornando uma plataforma educacional capaz de oferecer cursos, videos, exercícios e mais.

<br><br>

## Modelagem lógica:

<img src="https://user-images.githubusercontent.com/67292388/204520411-38a4816b-c31e-4259-a2f8-1b1856252031.png" width="100%">

<br>

## Modelagem física (PostgreSQL):

~~~~sql
create table usuario(
	id serial primary key,
	nome VARCHAR(50) not null,
	email VARCHAR(70) unique not null,
	senha varchar(100) not null,
	role varchar(9),
	email_confirm boolean DEFAULT false,
	data_criacao bigint
);

create table curso(
	id serial primary key,
	id_usuario int not null,
	titulo varchar(30) not null,
	titulo_longo varchar(80),
	descricao varchar(1000),
	preco INTEGER DEFAULT 0,
	categoria varchar(20),
	data_criacao BIGINT not null,
	ordem text,
	aprendizado text,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);
create table adquire_curso(
	id_usuario int,
	id_curso int,
	data_compra bigint,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id),
	FOREIGN KEY (id_curso) REFERENCES curso(id)
);


create table video_aula(
	id serial primary key,
	id_curso int not null,
	nome varchar(40) not null,
	cod varchar(20) not null,
	FOREIGN KEY (id_curso) REFERENCES curso(id)
);

create table comentario_aula(
	id serial primary key,
	id_video_aula int not null,
	id_usuario int not null,
	comentario varchar(300) not null,
	data_comentario BIGINT not null
);

create table exercicio(
	id serial primary key,
	id_curso int not null,
	data_criacao BIGINT not null,
	pergunta varchar(1200),
	resposta1 varchar(350),
	resposta2 varchar(350),
	resposta3 varchar(350),
	resposta4 varchar(350),
	resposta_correta char(2),
	FOREIGN KEY (id_curso) REFERENCES curso(id)
);


create table faz_exercicio(
	id_usuario int not null,
	id_exercicio int not null,
	resposta char(2) not null,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id),
	FOREIGN KEY (id_exercicio) REFERENCES exercicio(id)
);
~~~~


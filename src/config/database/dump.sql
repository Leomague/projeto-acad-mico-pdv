create database pdv;

create table usuarios (
  id serial primary key,
  nome text,
  email varchar(255) unique not null,
  senha text not null
);

create table categorias (
  id serial primary key,
  descricao text not null
);

insert into categorias (descricao)
values
('informatica'),
('celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
  id serial primary key,
  descricao text not null,
  quantidade_estoque integer not null,
  valor numeric(10,2) not null,
  categoria_id integer references categorias(id) not null
);

create table clientes (
  id serial primary key,
  nome text not null,
  email varchar(255) unique not null,
  cpf text unique not null,
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  estado text
);

create database pdv;

create table usuarios (
  id serial primary key,
  nome text,
  email text unique not null,
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

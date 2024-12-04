CREATE DATABASE Empreendedorismo;

USE Empreendedorismo;

CREATE TABLE Cliente (
    Cliente_ID INT PRIMARY KEY AUTO_INCREMENT,
    Cliente_nome VARCHAR(255),
    Cliente_email VARCHAR(255),
    Cliente_endereco VARCHAR(255),
    Cliente_telefone VARCHAR(50),
    Cliente_senha VARCHAR(50)
);

CREATE TABLE Produto_Servico (
    OS_ID INT PRIMARY KEY AUTO_INCREMENT,
    Cliente_ID INT,
    OS_data_abertura DATE,
    OS_data_fechamento DATE,
    OS_status VARCHAR(50),
    OS_solucao VARCHAR(255),
    OS_descricao_problema VARCHAR(255),
    FOREIGN KEY (Cliente_ID) REFERENCES Cliente(Cliente_ID)
);

CREATE TABLE Carrinho (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Produto_Servico INT,
    Cliente_ID INT, -- Relaciona o carrinho com o cliente
    FOREIGN KEY (Produto_Servico) REFERENCES Produto_Servico(OS_ID),
    FOREIGN KEY (Cliente_ID) REFERENCES Cliente(Cliente_ID)
);

CREATE TABLE Funcionario (
    Tecnico_ID INT PRIMARY KEY AUTO_INCREMENT,
    Tecnico_nome VARCHAR(255),
    Tecnico_telefone VARCHAR(50),
    Tecnico_comissao DECIMAL(10, 2)
);

CREATE TABLE Cargo (
    Salario_ID INT PRIMARY KEY AUTO_INCREMENT,
    Tecnico_ID INT,
    Salario_valor DECIMAL(10, 2),
    FOREIGN KEY (Tecnico_ID) REFERENCES Funcionario(Tecnico_ID)
);

CREATE TABLE Recebimento_Pagamento (
    Pagamento_ID INT PRIMARY KEY AUTO_INCREMENT,
    FormaPagamento_ID INT,
    Valor DECIMAL(10, 2),
    data_pagamento DATE,
    OS_ID INT,
    FOREIGN KEY (OS_ID) REFERENCES Produto_Servico(OS_ID)
);

CREATE TABLE Modalidade_Transacao (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Atividade VARCHAR(255),
    Data_Inicio DATE
);

CREATE TABLE Tipo_Pagamento_Recebimento (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Descricao VARCHAR(255),
    Pix_Cartao_Especie VARCHAR(50)
);

CREATE TABLE Plano_Negocio (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Empresa VARCHAR(255)
);

CREATE TABLE Plano_Financeiro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(255),
    tipo_plano VARCHAR(50),
    status VARCHAR(50)
);

CREATE TABLE Receitas_Despesas_DRE (
    Id_DRE INT PRIMARY KEY AUTO_INCREMENT,
    Valor DECIMAL(10, 2),
    Receita_Despesa VARCHAR(255)
);

CREATE TABLE Fluxo_Caixa (
    id INT PRIMARY KEY,
    data DATE,
    Descricao VARCHAR(255),
    Tipo_Transacao VARCHAR(50)
);

CREATE TABLE Entrega (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Data_Entrega DATE
);

CREATE TABLE Plano_Operacional (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(255),
    responsavel_plano VARCHAR(255)
);

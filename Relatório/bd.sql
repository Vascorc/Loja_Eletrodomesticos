-- 1. Tabela de Categorias (Ex: Frigoríficos, Máquinas de Lavar)
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- 2. Tabela de Produtos (Eletrodomésticos)
CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    preco DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    eficiencia_energetica VARCHAR(10), -- Ex: A+++, B
    categoria_id INTEGER REFERENCES categoria(id) ON DELETE SET NULL
);

-- 3. Tabela de Utilizadores (Clientes e Admins)
CREATE TABLE utilizador (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENTE' -- Pode ser 'ADMIN' ou 'CLIENTE'
);

-- 4. Tabela de Vendas (O "cabeçalho" da compra)
CREATE TABLE venda (
    id SERIAL PRIMARY KEY,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2) NOT NULL,
    utilizador_id INTEGER REFERENCES utilizador(id) ON DELETE CASCADE
);

-- 5. Tabela de Itens da Venda (Os produtos específicos dentro de cada venda)
CREATE TABLE item_venda (
    id SERIAL PRIMARY KEY,
    venda_id INTEGER REFERENCES venda(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produto(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL -- Preço fixado no momento da venda
);
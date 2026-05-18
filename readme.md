
# Trabalho Prático 2 - Sistemas Distribuídos
**Tema (T1): Loja de Eletrodomésticos**

Este projeto consiste no desenvolvimento de uma aplicação web (Frontend + Backend) para uma loja online de eletrodomésticos. O projeto visa aplicar conceitos de arquitetura cliente-servidor através de APIs REST.

---

## 🎯 Funcionalidades Principais

A aplicação tem as seguintes funcionalidades:

### 1. Gestão de Catálogo e Produtos
- Catálogo de eletrodomésticos organizado de forma estruturada por **Categorias**.
- Suporte a operações **CRUD** (Criar, Ler, Atualizar, Apagar) sobre produtos e categorias.
- Diferentes tipos de pesquisa e consulta de produtos.

### 2. Clientes e Segurança
- Registo de novos clientes.
- Autenticação e mecanismos de **gestão de sessões** de utilizadores.
- Validação de dados e controlo de acessos baseado em perfis (Cliente vs. Admin).

### 3. Vendas e Faturação
- Realização de compras online exclusivas para clientes registados.
- Gestão de vendas e controlo automático de **stocks**.
- Emissão de uma **fatura** por cada venda efetuada.

### 4. Estatísticas da Loja (Dashboard)
Disponibilização de métricas de negócio essenciais:
- Produtos mais e menos vendidos.
- Melhores clientes (com maior volume de compras).
- Valor faturado filtrado por período (dia, semana, mês).

---

## 📂 Estrutura do Projeto

O projeto encontra-se dividido em dois componentes principais (pastas separadas):

1. **[`frontend/`](./frontend/readme.md)**: Contém o código da interface Web.
2. **[`loja-online/` (Backend) ](./loja-online/readme.md)**: Contém a aplicação Backend Spring Boot (API RESTful) e os scripts de inicialização da base de dados PostgreSQL.

Cada uma destas pastas contém o seu próprio ficheiro `readme.md` mais detalhado, focado nas respetivas tecnologias, arquiteturas e instruções de execução.

---

## 🚀 Como Iniciar

Para executar a aplicação localmente no seu ambiente de desenvolvimento, recomendamos a seguinte ordem:

1. **Configurar a Base de Dados e Backend**: Entre na pasta `loja-online/` e siga as [instruções do Backend](./loja-online/readme.md) para criar a base de dados relacional e iniciar a API REST em Spring Boot.
2. **Iniciar o Frontend**: Entre na pasta `frontend/` e siga as [instruções do Frontend](./frontend/readme.md) para instalar as dependências e iniciar o servidor de desenvolvimento da interface web.

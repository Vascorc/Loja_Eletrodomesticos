# Frontend - Loja Online de Eletrodomésticos

Este diretório contém a interface web desenvolvida para a loja online de eletrodomésticos. É responsável por consumir a API RESTful disponibilizada pelo Backend e apresentar uma interface interativa e responsiva aos utilizadores.

---

## 🎯 Funcionalidades da Interface

- **Catálogo de Eletrodomésticos**: Navegação organizada por categorias, visualização de detalhes, eficiência energética e stock disponível.
- **Autenticação**: Páginas de Login e Registo para clientes.
- **Carrinho e Compras**: Gestão do carrinho de compras e checkout para clientes registados.
- **Dashboard (Estatísticas)**: Visualização dos produtos mais/menos vendidos, melhores clientes e volume de faturação.

---

## 🚀 Instruções de Instalação e Execução

### Pré-requisitos
- Node.js (v16 ou superior recomendado)
- Gestor de pacotes npm (ou yarn)

### 1. Iniciar o Frontend
1. Navegue até esta pasta (`frontend/`): `cd frontend`
2. Instale as dependências necessárias do projeto: 
   ```bash
   npm install
   ```
3. Inicie o servidor local de desenvolvimento: 
   ```bash
   npm run dev
   ```
4. A aplicação ficará disponível no seu navegador (ex: `http://localhost:5173`).

### 2. Ligação ao Backend
Certifique-se de que o **Backend** está também em execução (normalmente em `http://localhost:8080`) para que a aplicação frontend consiga realizar os pedidos à API de forma correta. Se precisar de instruções sobre o backend, consulte o ficheiro [loja-online/readme.md](../loja-online/readme.md).

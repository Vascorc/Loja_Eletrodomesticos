# Backend - Loja Online de Eletrodomésticos

Este diretório contém a API RESTful desenvolvida para a loja online de eletrodomésticos. Foi implementada com a **Spring Framework** (Java), garantindo a persistência de dados num sistema de gestão de bases de dados (SGBD) relacional (PostgreSQL).

---

## 🏗 Arquitetura da Base de Dados

A persistência de dados está assegurada por um modelo relacional focado no domínio de Eletrodomésticos:

1. **`categoria`**: Armazena as categorias de eletrodomésticos (ex: Frigoríficos, Máquinas de Lavar).
2. **`produto`**: Eletrodomésticos disponíveis para venda (com preço, stock atual, eficiência energética). Relaciona-se com `categoria`.
3. **`utilizador`**: Registo de clientes e administradores, guardando as credenciais para autenticação.
4. **`venda`**: Cabeçalho de uma compra efetuada por um utilizador, guardando a data e o valor total.
5. **`item_venda`**: Detalhe da compra. Associa os produtos à respetiva venda, registando a quantidade e fixando o **preço unitário** do momento da compra.

---

## 📂 Estrutura do Projeto Backend

O código-fonte do Backend (Spring Boot) e os scripts da base de dados estão organizados da seguinte forma:

```text
loja-online/
├── src/main/java/com/trabalho/sd/loja_online/
│   ├── config/       # Configurações globais (CORS, Segurança)
│   ├── controller/   # Endpoints REST (ex: ProdutoController, VendaController, EstatisticasController)
│   ├── dto/          # Objetos de transferência de dados (esconde a estrutura interna da BD)
│   ├── exception/    # Tratamento de erros e validações de input
│   ├── model/        # Entidades JPA (Produto, Utilizador, Venda...)
│   ├── repository/   # Comunicação com a Base de Dados (Spring Data JPA)
│   ├── security/     # Lógica de Autenticação e Gestão de Sessões
│   └── service/      # Regras de negócio (ex: atualizar stock após venda, cálculo de estatísticas)
└── scripts_db/       # Scripts SQL para criação e inicialização das tabelas da base de dados
```

---

## 🚀 Instruções de Instalação e Execução (Ambiente Local)

### Pré-requisitos
- Java 17+ (ou versão correspondente)
- SGBD instalado (PostgreSQL)

### 1. Configurar a Base de Dados
1. Crie uma base de dados no seu SGBD local chamada `loja_online_eletrodomesticos`.
2. O Spring Data/Hibernate irá gerar automaticamente as tabelas baseadas nas entidades. Opcionalmente, pode executar os scripts em `scripts_db` (se existirem) para popular dados iniciais.

### 2. Iniciar o Backend (Spring Boot)
1. Navegue até a esta pasta (`loja-online/`): `cd loja-online`
2. Configure as credenciais da base de dados no ficheiro `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/loja_online_eletrodomesticos
   spring.datasource.username=seu_user
   spring.datasource.password=sua_password
   ```
3. Execute o projeto usando o Maven Wrapper:
   - Linux/Mac: `./mvnw spring-boot:run`
   - Windows: `mvnw.cmd spring-boot:run`
4. A API ficará disponível em `http://localhost:8080`.

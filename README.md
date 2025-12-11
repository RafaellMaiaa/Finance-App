# Finance Flow 🌊

> **Gestão Financeira Inteligente com Assistente IA**

Bem-vindo ao **Finance Flow**, uma aplicação *full-stack* moderna destinada à gestão de finanças pessoais. Construída sobre uma arquitetura Cliente-Servidor desacoplada (MERN Stack), esta aplicação combina a simplicidade de registo financeiro com a análise de dados avançada através de Inteligência Artificial.

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Perfil
* **Login Sem Passwords:** Autenticação segura e rápida via **Google OAuth 2.0**.
* **Gestão de Sessão:** Sistema *stateless* seguro utilizando JSON Web Tokens (JWT).
* **Preferência de Moeda:** Escolha a sua moeda base (EUR, USD, BRL, etc.).
    * *Nota de Integridade:* Para garantir a consistência dos dados, a alteração da moeda executa uma limpeza automática do histórico, evitando erros de câmbio antigos.

### 💸 Gestão de Transações
* **CRUD Completo:** Adicione ganhos e despesas com descrição, valor, categoria e notas.
* **Histórico Detalhado:** Visualize as suas transações com a **data específica** da ocorrência, permitindo um controlo temporal exato.
* **Categorias Personalizadas:** Crie, edite e elimine as suas próprias categorias (ex: "Jantares", "Freelance").

### 🔄 Transações Recorrentes Inteligentes (Novo)
* **Periodicidade Flexível:** Configure despesas ou ganhos fixos com frequência personalizada:
    * Diária, Semanal, Mensal, Semestral ou Anual.
* **Lógica Anti-Duplicação:** O sistema possui um algoritmo de verificação que impede que a mesma transação recorrente seja criada duas vezes no mesmo período, garantindo a integridade do saldo.
* **Processamento Automático:** Verificação automática de datas para lançar transações pendentes.

### 🤖 Assistente Financeiro IA ("Flow")
* **Integração Google Gemini:** Um *chatbot* integrado que conhece os seus dados financeiros.
* **Perguntas em Linguagem Natural:** Pergunte *"Quanto gastei em restaurantes este mês?"* ou *"Como posso poupar mais?"*.
* **Contexto Real:** A IA analisa as suas transações e orçamentos em tempo real para dar respostas precisas e formatadas.

### 📊 Relatórios e Visualização
* **Dashboard Interativo:** Resumo imediato de saldo, receitas e despesas.
* **Orçamentos Visuais:** Barras de progresso para acompanhar limites de gastos por categoria.
* **Filtros Temporais:** Filtre por "Este Mês", "Mês Passado" ou intervalos de datas personalizados.
* **Exportação Profissional:** Gere relatórios completos em **PDF** (via jsPDF) com tabelas detalhadas do período selecionado.
* **Gráficos Dinâmicos:** Visualização da distribuição de gastos (Recharts).

### 📧 Notificações
* **Integração SendGrid:** Receba lembretes por email sobre transações recorrentes ou avisos importantes.

## 🚀 Tecnologias Utilizadas

### Frontend (Cliente)
* **Core:** React.js (Vite)
* **UI/UX:** Material-UI (MUI), Lucide React (Ícones)
* **Dados & Gráficos:** Axios, Recharts
* **Utilitários:** jsPDF (Relatórios), Date-fns

### Backend (Servidor)
* **Runtime:** Node.js & Express.js
* **Base de Dados:** MongoDB & Mongoose (ODM)
* **Segurança:** Passport.js (Google Strategy), JWT, CORS
* **Serviços Externos:**
    * Google Generative AI SDK (Gemini)
    * SendGrid Mail SDK

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (v18+)
* MongoDB (Local ou Atlas)
* Conta Google Cloud (para OAuth e Gemini API)
* Conta SendGrid (opcional, para emails)

### 1. Configuração do Backend
```bash
cd backend
npm install
Crie um ficheiro .env na raiz da pasta backend:

Fragmento do código

PORT=3001
MONGODB_URI=sua_connection_string_mongodb
JWT_SECRET=seu_segredo_super_seguro
FRONTEND_URL=http://localhost:5173

# Google Auth & AI
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GEMINI_API_KEY=sua_chave_api_gemini

# Email (Opcional)
SENDGRID_API_KEY=sua_chave_sendgrid
SENDGRID_FROM_EMAIL=seu_email_verificado
Inicie o servidor:

Bash

npm run dev
2. Configuração do Frontend
Bash

cd frontend
npm install
Inicie a aplicação:

Bash

npm run dev
Aceda a http://localhost:5173.

🔮 Roadmap & Notas
Privacidade da IA: Atualmente, o assistente utiliza a API Cloud do Google Gemini. Em versões futuras (produção), planeia-se a migração para um LLM Local (ex: Llama) para garantir soberania total dos dados.

Open Banking: Planeada a integração com APIs bancárias para importação automática de transações.

Desenvolvido por Rafael Maia no âmbito do Projeto de Programação de Sistemas de Informação - ESTGA/UA.
MONGODB_URI=mongodb://127.0.0.1:27017/finance-app-db
PORT=3001
SENDGRID_API_KEY=SG.SUA_CHAVE_SENDGRID
SENDGRID_FROM_EMAIL=SEU_EMAIL_VERIFICADO_SENDGRID
---

Desenvolvido por **Rafael Maia**.

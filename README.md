# Finance Flow 🌊

Bem-vindo ao Finance Flow, uma aplicação de finanças pessoais moderna, construída com o MERN stack e integrada com a API Gemini da Google para uma análise inteligente das suas despesas e receitas.

## ✨ Funcionalidades

- **Gestão de Transações:** Adicione, visualize e apague os seus ganhos e gastos.
- **Autenticação Segura:** Sistema de login seguro e sem password com o Google OAuth 2.0.
- **Assistente IA:** Faça perguntas em linguagem natural sobre as suas finanças e obtenha respostas instantâneas.
- **Gestão de Perfil:** Atualize os seus dados de utilizador.
- **Interface Moderna:** Design limpo e responsivo com modos claro e escuro.

## 🚀 Tecnologias Utilizadas

**Frontend:**
- React.js
- Vite
- Material-UI (MUI)
- React Router
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB com Mongoose
- JSON Web Tokens (JWT) para sessões
- Passport.js com a estratégia Google OAuth 2.0
- Google Gemini API

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js
- MongoDB instalado localmente ou uma conta no MongoDB Atlas

### Backend
1. Navegue para a pasta `backend`: `cd backend`
2. Instale as dependências: `npm install`
3. Crie um ficheiro `.env` na raiz do `backend` e preencha as seguintes variáveis:

GEMINI_API_KEY=
JWT_SECRET=
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MONGODB_URI=mongodb://127.0.0.1:27017/finance-app-db
PORT=3001

4. Inicie o servidor: `npm run dev`

### Frontend
1. Navegue para a pasta `frontend` noutro terminal: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie a aplicação: `npm run dev`
4. Abra `http://localhost:5173` no seu navegador.
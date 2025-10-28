# Finance Flow 🌊

Bem-vindo ao **Finance Flow**, uma aplicação moderna e inteligente de finanças pessoais! Construída com o robusto MERN stack (MongoDB, Express, React, Node.js), esta aplicação permite-lhe gerir as suas transações, definir orçamentos, analisar os seus gastos com gráficos interativos e obter *insights* personalizados através de um assistente IA integrado com a API Gemini da Google.

## ✨ Funcionalidades Principais

* **Autenticação Segura e Simples:** Login rápido e sem password através do **Google OAuth 2.0**.
* **Gestão Completa de Transações:**
    * Adicione ganhos e gastos com descrição, valor, tipo, categoria e notas opcionais.
    * **Suporte Multi-Moeda:** Insira valores na sua moeda local (EUR, USD, GBP, BRL) - a aplicação converte automaticamente para a moeda base (EUR).
    * Visualize um histórico detalhado das suas transações.
    * Apague transações facilmente.
* **Categorias Personalizadas:** Crie, edite e apague as suas próprias categorias.
* **Orçamentos Mensais:**
    * Defina limites de gastos mensais por categoria.
    * Visualize o seu progresso com barras de progresso.
* **Transações Recorrentes:**
    * Crie "modelos" para despesas ou receitas mensais.
    * Gere manualmente as transações reais do mês com base nestes modelos.
    * **Lembretes por Email:** Ative uma verificação manual para receber emails de lembrete sobre transações recorrentes por pagar/receber nos próximos dias (requer configuração de um serviço de email como SendGrid).
* **Assistente Financeiro IA ("Flow"):**
    * Faça perguntas em linguagem natural sobre as suas finanças.
    * O assistente "Flow" (Gemini API) analisa os seus dados reais e responde de forma amigável e formatada.
    * Resposta personalizada sobre o criador da aplicação.
* **Relatórios Detalhados:**
    * Visualize resumos de ganhos, gastos e saldo para o período selecionado.
    * **Filtros Avançados:** Filtre por "Este Mês", "Mês Passado", "Tudo" ou escolha um **intervalo de datas personalizado**.
    * **Gráficos Interativos:** Analise a distribuição dos seus gastos e ganhos com gráficos circulares.
    * **Exportar para PDF:** Descarregue um relatório completo do período selecionado em formato PDF.
* **Interface Moderna e Personalizável:**
    * Design limpo e responsivo (Material-UI).
    * **Modo Claro / Escuro**.
    * Layout persistente com cabeçalho e menu lateral.
    * **Feedback ao Utilizador:** Notificações (Snackbars), indicadores de "a carregar" e validação de formulários clara.
* **Gestão de Perfil:** Atualize o seu nome e escolha a sua **moeda preferida**.

## 🚀 Tecnologias Utilizadas

* **Frontend:** React (Vite), React Router, Material-UI, Axios, Recharts, jsPDF, jsPDF-AutoTable
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Passport.js (Google OAuth 2.0), Google Generative AI SDK, SendGrid Mail SDK
* **Base de Dados:** MongoDB
* **Serviço de Email:** SendGrid (para lembretes)

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (v18+)
* NPM
* MongoDB a correr localmente ou Atlas connection string
* Credenciais Google Cloud (Client ID & Secret)
* Chave API Google Gemini
* Chave API SendGrid ("Full Access") e Email Verificado ("Single Sender")

### Backend
1.  `cd backend`
2.  `npm install`
3.  Crie `.env` e preencha as variáveis (veja exemplo abaixo).
4.  `npm run dev`

### Frontend
1.  `cd frontend` (noutro terminal)
2.  `npm install`
3.  `npm run dev`
4.  Abra `http://localhost:5173`

### Exemplo `.env` (backend)
```env
GEMINI_API_KEY=SUA_CHAVE_GEMINI
JWT_SECRET=SEU_SEGREDO_JWT
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=SEU_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=SEU_GOOGLE_CLIENT_SECRET
MONGODB_URI=mongodb://127.0.0.1:27017/finance-app-db
PORT=3001
SENDGRID_API_KEY=SG.SUA_CHAVE_SENDGRID
SENDGRID_FROM_EMAIL=SEU_EMAIL_VERIFICADO_SENDGRID
---

Desenvolvido por **Rafael Maia**.
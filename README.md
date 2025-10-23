# Finance Flow 🌊

Bem-vindo ao **Finance Flow**, uma aplicação moderna e inteligente de finanças pessoais! Construída com o robusto MERN stack (MongoDB, Express, React, Node.js), esta aplicação permite-lhe gerir as suas transações, definir orçamentos, analisar os seus gastos com gráficos interativos e obter *insights* personalizados através de um assistente IA integrado com a API Gemini da Google.


## ✨ Funcionalidades Principais

* **Autenticação Segura e Simples:** Login rápido e sem password através do **Google OAuth 2.0**.
* **Gestão Completa de Transações:**
    * Adicione ganhos e gastos com descrição, valor, tipo, categoria e notas opcionais.
    * **Suporte Multi-Moeda:** Insira valores na sua moeda local (EUR, USD, GBP, BRL) - a aplicação converte automaticamente para a moeda base para consistência.
    * Visualize um histórico detalhado das suas transações.
    * Apague transações facilmente.
* **Categorias Personalizadas:** Crie, edite e apague as suas próprias categorias de ganhos e gastos para organizar as suas finanças à sua maneira.
* **Orçamentos Mensais:**
    * Defina limites de gastos mensais para cada uma das suas categorias.
    * Visualize o seu progresso com **barras de progresso** intuitivas.
* **Transações Recorrentes:**
    * Crie "modelos" para despesas ou receitas que se repetem mensalmente (ex: Salário, Renda, Netflix).
    * Gere manualmente as transações reais do mês com base nestes modelos.
    * **Lembretes por Email (Opcional):** Ative uma verificação para receber emails de lembrete sobre transações recorrentes por pagar/receber (requer configuração de um serviço de email como Resend ou SendGrid).
* **Assistente Financeiro IA ("Flow"):**
    * Faça perguntas em linguagem natural sobre as suas finanças (ex: "Quanto gastei em comida este mês?", "Qual o meu saldo?").
    * O assistente "Flow", integrado com a **API Gemini**, analisa os seus dados reais e responde de forma amigável, usando emojis e formatação para facilitar a leitura.
    * Resposta personalizada sobre o criador da aplicação (Rafael Maia!).
* **Relatórios Detalhados:**
    * Visualize resumos de ganhos, gastos e saldo para o período selecionado.
    * **Filtros Avançados:** Filtre os seus dados por "Este Mês", "Mês Passado", "Tudo" ou escolha um **intervalo de datas personalizado**.
    * **Gráficos Interativos:** Analise a distribuição dos seus gastos e a origem dos seus ganhos com gráficos circulares (Pie Charts).
    * **Exportar para PDF:** Descarregue um relatório completo do período selecionado em formato PDF.
* **Interface Moderna e Personalizável:**
    * Design limpo e responsivo construído com **Material-UI**.
    * **Modo Claro / Escuro:** Alterne facilmente entre os temas.
    * Layout persistente com cabeçalho e menu lateral para navegação fácil.
    * **Feedback ao Utilizador:** Notificações (Snackbars) e indicadores de "a carregar" para uma experiência mais fluida.
    * **Validação de Formulários:** Mensagens de erro claras e integradas.
* **Gestão de Perfil:** Veja e atualize o seu nome e escolha a sua **moeda preferida** para visualização.

## 🚀 Tecnologias Utilizadas

* **Frontend:** React (com Vite), React Router, Material-UI (MUI), Axios, Recharts, jsPDF, jsPDF-AutoTable
* **Backend:** Node.js, Express.js, MongoDB (com Mongoose), JSON Web Tokens (JWT), Passport.js (Google OAuth 2.0), Google Generative AI SDK
* **Base de Dados:** MongoDB (local ou Atlas)
* **Serviço de Email (Opcional):** Resend ou SendGrid (para lembretes)

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (v18 ou superior recomendado)
* NPM
* MongoDB instalado e a correr localmente (ou uma connection string do MongoDB Atlas)
* Credenciais da Google Cloud (Client ID & Client Secret) para o OAuth 2.0
* Uma chave API para a Google Gemini
* (Opcional) Uma chave API do Resend ou SendGrid para os lembretes por email

### Backend
1.  Navegue para a pasta `backend`: `cd backend`
2.  Instale as dependências: `npm install`
3.  Crie um ficheiro `.env` na raiz do `backend` e preencha as seguintes variáveis com as suas chaves:
    ```env
    GEMINI_API_KEY="SUA_CHAVE_GEMINI"
    JWT_SECRET="SEU_SEGREDO_JWT"
    FRONTEND_URL="http://localhost:5173" # Ou a porta que o seu frontend usar
    GOOGLE_CLIENT_ID="SEU_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="SEU_GOOGLE_CLIENT_SECRET"
    MONGODB_URI="mongodb://127.0.0.1:27017/finance-app-db" # Ou a sua string do Atlas
    PORT=3001
    # RESEND_API_KEY="SUA_CHAVE_RESEND_SE_USAR" # Opcional
    # SENDGRID_API_KEY="SUA_CHAVE_SENDGRID_SE_USAR" # Opcional
    # SENDGRID_FROM_EMAIL="SEU_EMAIL_VERIFICADO_SENDGRID" # Opcional
    ```
4.  Inicie o servidor: `npm run dev`

### Frontend
1.  Navegue para a pasta `frontend` noutro terminal: `cd frontend`
2.  Instale as dependências: `npm install`
3.  Inicie a aplicação: `npm run dev`
4.  Abra o endereço fornecido (geralmente `http://localhost:5173`) no seu navegador.

## 💡 Próximos Passos (Roadmap)

* [ ] Implementar validação de dados mais robusta no backend.
* [ ] Tornar a geração de transações recorrentes e o envio de lembretes automáticos (Cron Jobs).
* [ ] Adicionar testes automatizados.
* [ ] Permitir anexar ficheiros (recibos) às transações.
* [ ] Melhorar a IA com mais contexto e histórico de conversas.
* [ ] Deployment para a web (Vercel/Render).

---

Desenvolvido por **Rafael Maia**.
# 📊 Sistema Administrativo Fullstack

Painel administrativo moderno para gerenciamento de usuários, produtos e promoções, desenvolvido com foco em segurança, escalabilidade e arquitetura limpa.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** (Vite) com **TypeScript**
- **React Router** (Navegação de rotas)
- **Tailwind CSS** & **shadcn/ui** (Estilização e Componentes)
- **Axios** (Consumo de API HTTP)
- **Sonner** (Notificações Toast)

### Backend
- **Node.js** & **Express** (API REST)
- **Prisma ORM** (Modelagem de dados)
- **PostgreSQL** (Banco de dados relacional)
- **Zod** (Validação estrita de payloads)
- **Bcrypt** (Criptografia de senhas)
- **JWT** (Autenticação baseada em tokens)
- **Express Rate Limit** (Proteção contra força bruta)

---

## 🛠️ Arquitetura e Funcionalidades Chave

- **Controle de Acesso Baseado em Funções (RBAC):** Telas e rotas protegidas por nível de perfil (`ADMIN` vs `FUNCIONARIO`).
- **Arquitetura em Camadas (Backend):** Separação clara de responsabilidades entre Rotas, Controllers, Services (Regras de negócio) e Middlewares.
- **Atualização Otimista (Frontend):** Sincronização do estado local do React após operações CRUD para evitar recarregamentos (refresh) desnecessários de página.
- **Cálculo de Preço no Cliente:** Processamento dinâmico de regras de descontos fixos/percentuais diretamente no frontend para mitigar overhead de rede.

---

## 📦 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Instância do PostgreSQL rodando

### 1. Configurando o Backend
```bash
cd backend
npm install
# Copie o arquivo de exemplo e preencha suas variáveis
cp .env.example .env
# Rode as migrações do Prisma para criar o banco
npx prisma migrate dev
# Inicie o servidor
npm run dev

# Sistema de Agendamento — Salão de Sobrancelhas

Sistema de agendamento online mobile-first para salão de sobrancelhas. Clientes agendam diretamente pelo celular. A profissional gerencia tudo por um painel administrativo com notificações automáticas via WhatsApp.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Vue.js 3 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Banco de dados | MongoDB + Mongoose |
| WhatsApp | Evolution API |
| Testes | Playwright + Vitest |

## Estrutura

```
Sistema-Sobrancelhas/
├── frontend/    → Vue.js SPA
└── backend/     → API REST Node.js + Express
```

## Configuração local

### Pré-requisitos
- Node.js 24+
- MongoDB Community instalado e rodando
- Git

### Frontend
```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

### Backend
```bash
cd backend
cp .env.example .env   # preencha as variáveis
npm install
npm run dev
# API rodando em: http://localhost:3001
```

## Fases do projeto

1. ✅ Ambiente de desenvolvimento
2. ✅ Git + GitHub
3. ⬜ Banco de dados (schemas MongoDB)
4. ⬜ Frontend Vue.js (mobile-first)
5. ⬜ Backend Express (API REST)
6. ⬜ WhatsApp (Evolution API)
7. ⬜ Testes com cliente
8. ⬜ Deploy em produção

## Convenções de commit

```
feat: nova funcionalidade
fix: correção de bug
chore: atualização de dependência
docs: documentação
style: formatação, sem lógica
refactor: refatoração sem nova funcionalidade
test: adição de testes
```

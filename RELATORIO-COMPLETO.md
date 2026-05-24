# Relatório Completo — Sistema de Agendamento Déborah Cristhiany

> **Material de estudo para NotebookLM**
> Este documento explica TUDO sobre o sistema de agendamento construído para o salão "Déborah Cristhiany Designer de Sobrancelhas".
> O objetivo é ensinar como cada parte funciona, desde a arquitetura até linhas específicas de código.
> Construído por Helom Ramos com Claude Code, entre Maio de 2026.

---

## ÍNDICE

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Glossário Técnico](#2-glossário-técnico)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Stack Tecnológica Explicada](#4-stack-tecnológica-explicada)
5. [Banco de Dados: MongoDB Atlas](#5-banco-de-dados-mongodb-atlas)
6. [Backend: Node.js + Express](#6-backend-nodejs--express)
7. [Frontend: Vue.js 3](#7-frontend-vuejs-3)
8. [Integração WhatsApp: Evolution API](#8-integração-whatsapp-evolution-api)
9. [Autenticação: JWT + bcrypt](#9-autenticação-jwt--bcrypt)
10. [Deploy: Railway + Docker](#10-deploy-railway--docker)
11. [Fluxos do Sistema (Passo a Passo)](#11-fluxos-do-sistema)
12. [Variáveis de Ambiente](#12-variáveis-de-ambiente)
13. [Bugs Enfrentados e Como Foram Resolvidos](#13-bugs-enfrentados-e-como-foram-resolvidos)
14. [Glossário de Comandos Usados](#14-glossário-de-comandos-usados)
15. [Aspectos Financeiros do Projeto](#15-aspectos-financeiros-do-projeto)

---

## 1. VISÃO GERAL DO PROJETO

### O que é o sistema

O sistema é um **site de agendamento online** para um salão de sobrancelhas. Ele tem dois lados:

**Lado público (cliente):**
- Acessa pelo celular
- Vê os serviços (foto, preço, duração)
- Escolhe data e horário disponível
- Faz o agendamento sem precisar criar conta
- Recebe confirmação no WhatsApp
- Recebe lembrete 30 minutos antes do horário

**Lado admin (Déborah):**
- Faz login com email/senha
- Vê o dashboard com agendamentos do dia
- Gerencia agenda, clientes, serviços
- Configura horários de funcionamento
- Recebe notificações automáticas no WhatsApp

### Quem usa

- **Déborah Cristhiany:** dona do salão (admin do sistema)
- **Clientes da Déborah:** marcam atendimento pelo link público
- **Helom Ramos:** desenvolvedor que criou e mantém o sistema

### Por que existe

Antes, a Déborah marcava agendamentos manualmente pelo WhatsApp. Isso dava:
- Confusão com horários
- Esquecimento de marcar lembretes
- Clientes faltando sem avisar
- Tempo perdido respondendo "pode ser tal dia?"

Com o sistema:
- Clientes veem disponibilidade em tempo real
- Não precisam falar com a Déborah para marcar
- Recebem lembretes automáticos
- Confirmam presença ou cancelam pelo WhatsApp
- Déborah recebe notificações automáticas

---

## 2. GLOSSÁRIO TÉCNICO

Antes de entrar nos detalhes, conceitos básicos:

| Termo | O que significa |
|-------|-----------------|
| **Frontend** | A parte que o usuário vê e clica (site no celular/computador) |
| **Backend** | O "cérebro" que processa requisições, salva no banco, envia WhatsApp |
| **API** | "Caminhos" que o frontend usa para falar com o backend (ex: `/api/services`) |
| **Banco de dados** | Onde os dados ficam salvos permanentemente (clientes, agendamentos, etc.) |
| **Endpoint** | Um caminho específico da API (ex: `POST /api/auth/login`) |
| **Request (requisição)** | Quando o frontend pede algo ao backend |
| **Response (resposta)** | O que o backend manda de volta |
| **JSON** | Formato dos dados trocados entre frontend e backend |
| **JWT** | Token seguro que prova que o usuário está logado |
| **Hash** | Senha transformada em código irreversível (bcrypt faz isso) |
| **Webhook** | URL que recebe notificações automáticas (Evolution API manda mensagens recebidas) |
| **Deploy** | Colocar o sistema no ar para ser acessado por todo mundo |
| **Docker** | "Caixa" que empacota o sistema para rodar igual em qualquer máquina |
| **Container** | A "caixa Docker" rodando |
| **Cron job** | Tarefa que roda em horário programado (ex: a cada 1 minuto) |
| **CORS** | Regra que permite ou bloqueia comunicação entre sites diferentes |
| **localStorage** | Espaço no navegador para guardar dados (sobrevive a fechar a aba) |
| **Pinia** | Gerenciador de estado global no Vue.js (compartilha dados entre componentes) |
| **Mongoose** | Biblioteca que facilita trabalhar com MongoDB no Node.js |
| **Atlas** | MongoDB na nuvem (versão gerenciada, sem precisar instalar) |
| **Railway** | Empresa que hospeda nosso site (paga uns R$ 28/mês) |

---

## 3. ARQUITETURA DO SISTEMA

### Diagrama em texto

```
┌──────────────────────────────────────────────────┐
│  CLIENTE (celular)                                │
│  Acessa: sistema-sobrancelhas-production...      │
└───────────────────────┬──────────────────────────┘
                        │ HTTPS
                        ▼
┌──────────────────────────────────────────────────┐
│  RAILWAY — Servidor de Produção                   │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │ Frontend Vue.js (dist/ estático)        │    │
│  │ Servido pelo Express                    │    │
│  └─────────────────────────────────────────┘    │
│                  │                                │
│  ┌─────────────────────────────────────────┐    │
│  │ Backend Express (Node.js)                │    │
│  │ Porta 3001                               │    │
│  │ Rotas: /api/*                            │    │
│  │ Servidor estático para o frontend       │    │
│  └────────────┬────────────────────────────┘    │
│               │                                   │
└───────────────┼───────────────────────────────────┘
                │
                ├──→ MongoDB Atlas (nuvem)
                │    └── Banco "sobrancelhas"
                │        ├── users, services, clients
                │        ├── appointments, settings
                │
                └──→ Evolution API (Railway)
                     └── Conectada ao WhatsApp da Déborah
                         └── Webhook → /api/whatsapp/webhook
```

### Como tudo se conecta

1. **Cliente abre o site** no celular → Carrega o **Frontend** (HTML+JS+CSS) que está no Railway
2. **Cliente escolhe serviço/horário** → Frontend manda requisições para o **Backend** (também no Railway)
3. **Backend salva no banco** → Manda comandos para o **MongoDB Atlas**
4. **Backend manda WhatsApp** → Manda requisições para o **Evolution API** (também no Railway)
5. **Cliente responde no WhatsApp** → Evolution API manda **webhook** para o Backend
6. **Backend processa resposta** → Atualiza banco + manda notificação para a Déborah

---

## 4. STACK TECNOLÓGICA EXPLICADA

### Frontend

**Vue.js 3** — Framework JavaScript para criar sites interativos.
- "Framework" = conjunto de regras e ferramentas prontas
- Permite criar **componentes** (pedaços reutilizáveis de tela)
- Usa **reatividade**: quando dado muda, tela atualiza sozinha
- Versão 3 é a mais nova e usa "Composition API" (sintaxe moderna)

**Vite** — Ferramenta que transforma o código Vue em arquivos prontos para o navegador.
- Roda em desenvolvimento (`npm run dev`)
- Faz build para produção (`npm run build`)
- Muito mais rápido que o Webpack antigo

**Tailwind CSS v4** — Sistema de CSS por classes utilitárias.
- Em vez de escrever CSS, você coloca classes prontas (`bg-zinc-900`, `p-4`, `flex`)
- Visual consistente sem precisar pensar em nomes de classes
- Versão 4 é mais nova, mas tem algumas mudanças (causou bug com `@apply`)

**Pinia** — Estado global da aplicação.
- Permite compartilhar dados entre componentes diferentes
- Usado para guardar o estado de login (`stores/auth.js`)

**Vue Router** — Sistema de páginas/rotas no Vue.
- `/` → HomeView
- `/agendar` → BookingView
- `/login` → LoginView
- `/admin/dashboard` → DashboardView (protegida por login)
- Tem **guards** que bloqueiam acesso se não estiver logado

**Axios** — Biblioteca para fazer requisições HTTP.
- Manda `GET`, `POST`, `PUT`, `DELETE` para a API
- Interceptors automaticamente adicionam o token JWT em toda requisição

### Backend

**Node.js 22** — Permite rodar JavaScript fora do navegador (no servidor).
- Versão 22 LTS (Long Term Support) — estável
- Usa ESM (`import` em vez de `require`)

**Express.js** — Framework minimalista para criar APIs em Node.js.
- Define as rotas (`app.get()`, `app.post()`, etc.)
- Middlewares processam as requisições antes de chegar nas rotas
- Muito simples e flexível

**Mongoose** — ODM (Object Document Mapper) para MongoDB.
- Cria **schemas** que validam os dados antes de salvar
- Traduz comandos JavaScript em comandos MongoDB
- Permite usar `Model.find()`, `Model.create()`, etc.

**bcryptjs** — Biblioteca para criptografar senhas.
- Aplica um "hash" na senha (transformação irreversível)
- Usa "salt rounds" = 12 (12 voltas de embaralhamento)
- Mesmo se o banco vazar, ninguém descobre as senhas

**jsonwebtoken** — Cria e valida tokens JWT.
- Token contém dados do usuário + assinatura secreta
- Pode ser validado sem consultar o banco
- Expira após X tempo (8h normal, 30 dias com "lembrar acesso")

**multer** — Lida com upload de arquivos (fotos dos serviços).
- Salva no diretório `/uploads/`
- Renomeia para evitar conflitos
- Valida tipo (imagem) e tamanho

**node-cron** — Executa tarefas em horários programados.
- No nosso caso, roda a cada 1 minuto
- Verifica agendamentos que precisam de lembrete
- Verifica clientes que não responderam

**helmet** — Adiciona headers de segurança automaticamente.
**cors** — Controla quais sites podem chamar a API.
**morgan** — Log de requisições HTTP no console.

### Banco de Dados

**MongoDB** — Banco de dados NoSQL (não-relacional).
- Em vez de tabelas, usa **collections** (coleções)
- Em vez de linhas, usa **documents** (documentos, em formato JSON)
- Flexível: cada documento pode ter campos diferentes

**MongoDB Atlas** — MongoDB rodando na nuvem.
- M0 free: 512MB grátis para sempre
- Sobrevive a quedas, faz backup, escala
- Conexão via URI (string que contém usuário, senha, servidor)

### WhatsApp

**Evolution API** — API gratuita que controla WhatsApp Web.
- Versão 1.7.4 self-hosted (rodando no nosso Railway)
- Conecta com WhatsApp escaneando QR code
- Permite enviar/receber mensagens via HTTP requests

### Hospedagem

**Railway** — Plataforma de cloud (parecido com Heroku).
- Conecta com GitHub e faz deploy automático
- Suporta Docker, Node.js, MongoDB, etc.
- Plano Hobby: $5/mês de crédito (suficiente para o sistema)

**Docker** — Empacota o app em um "container".
- Garante que rode igual em qualquer máquina
- Usamos um `Dockerfile` que define a imagem do app

---

## 5. BANCO DE DADOS: MONGODB ATLAS

### Estrutura

O banco se chama `sobrancelhas` e tem 5 **collections**:

#### 5.1. users (usuários admin)

```javascript
{
  _id: ObjectId,
  name: "Déborah Cristhiany",
  email: "deborahcristhiany22@gmail.com",
  password: "$2a$12$...(hash bcrypt)...",
  role: "admin",
  createdAt: Date,
  updatedAt: Date
}
```

**Importante:** a senha NUNCA é salva em texto puro. Sempre passa pelo bcrypt antes.

#### 5.2. services (serviços oferecidos)

```javascript
{
  _id: ObjectId,
  name: "Designer + Henna",
  description: "Design completo com aplicação de henna",
  duration: 30,        // em minutos
  price: 35,           // em reais
  image: "/uploads/designer-henna.jpg",
  active: true,
  createdAt: Date
}
```

Serviços atuais:
- Designer de Sobrancelha — R$ 25, 30min
- Designer + Henna — R$ 35, 30min
- Somente Henna — R$ 20, 30min
- Brow Lamination — R$ 60, 60min
- Depilação do Buço — R$ 12, 30min

#### 5.3. clients (clientes que agendaram)

```javascript
{
  _id: ObjectId,
  name: "Maria Silva",
  phone: "5538999991234",  // formato: 55 + DDD + número
  email: "",                // opcional
  notes: "",                // opcional
  createdAt: Date
}
```

O telefone é **único** — se uma cliente agenda de novo, atualiza o nome dela em vez de criar duplicata.

#### 5.4. appointments (agendamentos)

```javascript
{
  _id: ObjectId,
  client: ObjectId,        // referência para clients
  service: ObjectId,       // referência para services
  datetime: ISODate,       // início, em UTC
  endDatetime: ISODate,    // fim (datetime + service.duration)
  status: "confirmed",     // pending|confirmed|cancelled|completed|no_show
  notes: "",
  createdBy: "client",     // client|admin
  confirmation: {
    reminderSent: false,   // mandou o WhatsApp de 30min antes?
    response: null,        // yes|no|no_response
    respondedAt: null
  },
  createdAt: Date
}
```

Status possíveis:
- `pending` — aguardando confirmação
- `confirmed` — confirmado (padrão ao criar)
- `cancelled` — cancelado (via link ou pelo WhatsApp "2")
- `completed` — concluído (cliente compareceu)
- `no_show` — não compareceu

#### 5.5. settings (configurações do salão)

```javascript
{
  _id: ObjectId,
  salonName: "Studio de Sobrancelhas",
  phone: "5538999243577",         // WhatsApp da Déborah
  address: "Av X, número Y",
  instagram: "",
  workingHours: [
    { day: 0, active: false, ... },                                  // Domingo
    { day: 1, active: true, start: "16:00", end: "19:00" },          // Segunda
    { day: 2, active: true, start: "16:00", end: "19:00" },          // Terça
    { day: 3, active: true, start: "16:00", end: "19:00" },          // Quarta
    { day: 4, active: true, start: "16:00", end: "19:00" },          // Quinta
    { day: 5, active: true, start: "10:00", end: "12:00",
                            start2: "15:00", end2: "19:00" },         // Sexta (2 turnos)
    { day: 6, active: true, start: "10:00", end: "12:00",
                            start2: "14:00", end2: "19:00" }          // Sábado (2 turnos)
  ],
  breakBetweenAppointments: 10,   // 10 min de intervalo entre clientes
  advanceBookingDays: 30,         // pode agendar até 30 dias à frente
  reminderMinutesBefore: 30,      // lembrete 30 min antes
  noResponseAlertMinutes: 15      // alerta de "sem resposta" após 15 min
}
```

### Por que MongoDB e não SQL?

- **Flexibilidade:** podemos adicionar campos sem precisar mudar tabelas
- **Estrutura natural:** dados já vêm em JSON, sem traduzir
- **Free tier generoso:** Atlas dá 512MB de graça (suficiente para anos)
- **Aprendizado:** mais comum em projetos modernos com Node.js

---

## 6. BACKEND: NODE.JS + EXPRESS

### Estrutura de pastas

```
backend/
├── src/
│   ├── models/         <- Mongoose schemas
│   ├── routes/         <- definição das rotas/endpoints
│   ├── controllers/    <- lógica complexa que sai das routes
│   ├── middleware/     <- código que roda antes das rotas (ex: autenticação)
│   ├── services/       <- integrações externas (WhatsApp, scheduler)
│   └── seeds/          <- scripts para popular o banco com dados iniciais
├── .env                <- variáveis secretas (não vai pro git)
├── package.json        <- lista de dependências
└── server.js           <- arquivo que sobe o servidor
```

### O fluxo de uma requisição

Quando o frontend faz uma requisição (exemplo: `POST /api/appointments`):

1. **Express recebe** a requisição na porta 3001
2. **Middlewares globais** rodam:
   - `helmet()` — adiciona headers de segurança
   - `cors()` — verifica se o domínio pode chamar
   - `morgan('dev')` — loga no console
   - `express.json()` — converte o body de JSON para objeto JS
3. **Roteamento** verifica qual arquivo atende a rota:
   - `/api/appointments` → `routes/appointments.routes.js`
4. **Middleware de autenticação** (se a rota for protegida):
   - Verifica o JWT no header `Authorization`
   - Se válido, adiciona `req.user`
   - Se inválido, retorna 401
5. **Handler da rota** executa:
   - Valida os dados
   - Consulta/salva no MongoDB via Mongoose
   - Possivelmente chama serviços externos (WhatsApp)
   - Retorna resposta JSON

### Models (schemas Mongoose)

Os models definem a estrutura dos dados. Exemplo:

**`models/User.js`** (linha por linha explicada):

```javascript
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Define a estrutura de um documento User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' }
}, { timestamps: true })  // adiciona createdAt e updatedAt automaticamente

// "Hook" que roda ANTES de salvar
userSchema.pre('save', async function (next) {
  // Se a senha não foi modificada, segue normal
  if (!this.isModified('password')) return next()
  // Senão, faz hash com bcrypt (12 voltas)
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Método para comparar uma senha digitada com o hash salvo
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

// Quando converter para JSON, esconde a senha
userSchema.set('toJSON', {
  transform: (_doc, ret) => { delete ret.password; return ret }
})

export default mongoose.model('User', userSchema)
```

### Routes (endpoints da API)

**`routes/auth.routes.js`** — Login:

```javascript
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body

    // Valida campos
    if (!email || !password)
      return res.status(400).json({ error: 'Email e senha obrigatórios' })

    // Busca usuário no banco
    const user = await User.findOne({ email })

    // Se não existe OU senha errada, retorna 401
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // Cria o JWT
    // rememberMe true → token de 30 dias
    // rememberMe false → token de 8h (padrão)
    const expiresIn = rememberMe ? '30d' : '8h'
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    )

    res.json({ token, user })
  } catch (err) { next(err) }
})
```

### Middleware de autenticação

**`middleware/auth.middleware.js`** — verifica se o usuário está logado:

```javascript
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Token ausente' })

  const token = header.replace('Bearer ', '')
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()  // passa pra próxima função
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}
```

Usado nas rotas admin:
```javascript
router.get('/', requireAuth, async (req, res) => { ... })
```

### Serviços

**`services/whatsapp.service.js`** — manda mensagens via Evolution API:

```javascript
async function send(phone, message) {
  // Se faltar URL ou key, simula em vez de mandar
  if (!BASE_URL || !API_KEY) {
    console.log(`[WhatsApp SIMULADO] → ${phone}: ${message}`)
    return
  }

  // Delay artificial (2-5s) para parecer mais natural
  await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000))

  // POST para a Evolution API
  const res = await fetch(`${BASE_URL}/message/sendText/${INSTANCE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: API_KEY },
    body: JSON.stringify({
      number: formatPhone(phone),
      textMessage: { text: message }
    })
  })

  if (!res.ok) throw new Error(`Evolution API erro: ${res.status}`)
}
```

**`services/scheduler.service.js`** — node-cron que roda a cada minuto:

```javascript
cron.schedule('* * * * *', async () => {
  const now = new Date()
  const settings = await Settings.findOne()
  const reminderWindow = settings.reminderMinutesBefore || 30

  // Busca agendamentos para X minutos no futuro que ainda não receberam lembrete
  const startTime = new Date(now.getTime() + reminderWindow * 60000)
  const endTime = new Date(startTime.getTime() + 60000)  // janela de 1 min

  const appointments = await Appointment.find({
    datetime: { $gte: startTime, $lt: endTime },
    status: { $nin: ['cancelled'] },
    'confirmation.reminderSent': false
  })

  // Manda lembrete para cada um
  for (const appt of appointments) {
    await sendPresenceCheck(appt._id)
  }

  // Também checa quem não respondeu em X minutos
  // ... (lógica similar)
})
```

### Controllers

Quando a lógica fica grande, separamos em controllers:

**`controllers/slots.controller.js`** — calcula horários disponíveis:

```javascript
export async function getAvailableSlots(req, res, next) {
  const { date, serviceId } = req.query

  // Pega serviço e configurações em paralelo
  const [service, settings] = await Promise.all([
    Service.findById(serviceId),
    Settings.findOne()
  ])

  // Descobre o dia da semana (0=Domingo, 6=Sábado)
  const targetDate = new Date(`${date}T00:00:00-03:00`)
  const dayOfWeek = targetDate.getDay()
  const dayConfig = settings.workingHours.find(h => h.day === dayOfWeek)

  // Se dia está fechado, retorna lista vazia
  if (!dayConfig?.active) return res.json([])

  // Monta os turnos (alguns dias têm 2: manhã e tarde)
  const shifts = [{ start: toMinutes(dayConfig.start), end: toMinutes(dayConfig.end) }]
  if (dayConfig.start2 && dayConfig.end2) {
    shifts.push({ start: toMinutes(dayConfig.start2), end: toMinutes(dayConfig.end2) })
  }

  // Gera todos os horários possíveis
  const slotInterval = service.duration + settings.breakBetweenAppointments
  const slots = []
  for (const shift of shifts) {
    for (let m = shift.start; m + service.duration <= shift.end; m += slotInterval) {
      const h = Math.floor(m / 60).toString().padStart(2, '0')
      const min = (m % 60).toString().padStart(2, '0')
      slots.push(`${h}:${min}`)
    }
  }

  // Busca agendamentos já existentes no dia
  const existing = await Appointment.find({
    datetime: { $gte: dayStart, $lte: dayEnd },
    status: { $nin: ['cancelled'] }
  }).populate('service')

  // Remove os horários que conflitam
  const available = slots.filter(slot => {
    // ... lógica de conflito
  })

  res.json(available)
}
```

### Lista completa de endpoints

| Método | Rota | Auth? | Função |
|--------|------|-------|--------|
| POST | `/api/auth/login` | não | Login admin → retorna JWT |
| GET | `/api/services` | não | Lista serviços ativos |
| GET | `/api/services/all` | sim | Lista todos os serviços (admin) |
| POST | `/api/services` | sim | Cria serviço + upload de imagem |
| PUT | `/api/services/:id` | sim | Edita serviço |
| PATCH | `/api/services/:id/toggle` | sim | Ativa/desativa serviço |
| GET | `/api/slots?date&serviceId` | não | Horários disponíveis no dia |
| POST | `/api/appointments` | não | Cliente cria agendamento |
| GET | `/api/appointments?date&status` | sim | Lista agendamentos |
| PATCH | `/api/appointments/:id/status` | sim | Atualiza status |
| GET | `/api/appointments/:id/public` | não | Busca agendamento para cancelar |
| POST | `/api/appointments/:id/cancel` | não | Cancela via link |
| GET | `/api/clients` | sim | Lista clientes |
| GET | `/api/settings` | sim | Configurações |
| PUT | `/api/settings` | sim | Atualiza configurações |
| POST | `/api/whatsapp/webhook` | webhook | Recebe mensagens dos clientes |
| GET | `/api/health` | não | Health check |

---

## 7. FRONTEND: VUE.JS 3

### Estrutura de pastas

```
frontend/
├── src/
│   ├── router/
│   │   └── index.js          <- definição das rotas (URLs)
│   ├── stores/
│   │   └── auth.js           <- estado global de autenticação (Pinia)
│   ├── services/
│   │   └── api.js            <- cliente Axios configurado
│   ├── components/
│   │   ├── AdminLayout.vue   <- layout do admin (sidebar + main)
│   │   └── AppointmentCard.vue <- card de agendamento
│   ├── views/
│   │   ├── public/
│   │   │   ├── HomeView.vue       <- landing page
│   │   │   ├── BookingView.vue    <- fluxo de agendamento
│   │   │   └── CancelView.vue     <- página de cancelamento
│   │   ├── LoginView.vue          <- login admin
│   │   └── admin/
│   │       ├── DashboardView.vue
│   │       ├── AgendaView.vue
│   │       ├── ClientesView.vue
│   │       ├── ServicosView.vue
│   │       └── ConfigView.vue
│   ├── App.vue                <- componente raiz
│   ├── main.js                <- ponto de entrada
│   └── style.css              <- estilos globais (Tailwind)
├── public/
│   └── logo.png              <- logo do salão
├── index.html                <- arquivo HTML único (SPA)
├── package.json
└── vite.config.js
```

### O que é uma SPA?

SPA = **Single Page Application** (aplicação de página única).
- Carrega 1 HTML inicial
- Vue Router troca o conteúdo conforme você navega
- Sem recarregar a página inteira (mais rápido)
- Histórico do navegador (botão voltar) funciona normalmente

### Anatomia de um componente Vue

Cada arquivo `.vue` tem 3 seções:

```vue
<template>
  <!-- HTML do componente -->
  <div class="card">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Clique</button>
  </div>
</template>

<script setup>
// JavaScript com Composition API
import { ref } from 'vue'

const title = ref('Olá Mundo')

function handleClick() {
  console.log('Clicado!')
}
</script>

<style scoped>
/* CSS que só afeta este componente */
.card { padding: 1rem; }
</style>
```

### Reatividade

`ref()` cria uma variável reativa — quando muda, a tela atualiza sozinha:

```javascript
const count = ref(0)
function increment() {
  count.value++  // tela atualiza automaticamente
}
```

`computed()` deriva valor de outros refs:

```javascript
const filteredItems = computed(() =>
  items.value.filter(i => i.active)
)
```

### Vue Router (rotas)

**`router/index.js`** — define as URLs e suas views:

```javascript
const routes = [
  { path: '/', component: HomeView },
  { path: '/agendar', component: BookingView },
  { path: '/cancelar/:id', component: CancelView },
  { path: '/login', component: LoginView },
  {
    path: '/admin/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }   // requer login
  },
  // ... outras rotas admin
]

// Guard: bloqueia acesso a rotas com requiresAuth se não estiver logado
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

### Pinia store (estado global de auth)

**`stores/auth.js`** — guarda o token e usuário logado:

```javascript
export const useAuthStore = defineStore('auth', () => {
  // token vem do localStorage (se já estava salvo)
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email, password, rememberMe = false) {
    const { data } = await api.post('/auth/login', { email, password, rememberMe })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)

    // Se "lembrar acesso", salva email para a próxima vez
    if (rememberMe) {
      localStorage.setItem('savedEmail', email)
    } else {
      localStorage.removeItem('savedEmail')
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, login, logout }
})
```

### Cliente Axios

**`services/api.js`** — toda requisição passa por aqui:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Antes de cada requisição, adiciona o token JWT (se existir)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Se a resposta for 401 (não autorizado), faz logout
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

### Views principais

#### HomeView.vue — Landing page

- Mostra logo, descrição do salão
- Lista os serviços disponíveis (com imagem, preço, duração)
- Botão "Agendar agora" → vai para `/agendar`

#### BookingView.vue — Fluxo de agendamento

Tem 3 passos numa só tela (com `currentStep`):

**Passo 1 — Escolher serviço:**
- Lista cards com os serviços
- Cliente clica em um e avança

**Passo 2 — Escolher data e horário:**
- Calendário com os próximos 30 dias
- Ao escolher data: faz `GET /api/slots?date=...&serviceId=...`
- Backend retorna lista de horários disponíveis
- Cliente escolhe um horário

**Passo 3 — Dados pessoais e confirmação:**
- Campos: nome, telefone, observações
- Botão "Confirmar agendamento"
- Faz `POST /api/appointments`
- Mostra confirmação e link de cancelamento

#### DashboardView.vue — Painel admin

- Mostra resumo do dia (cards com totais)
- Lista de agendamentos de hoje (usando AppointmentCard)
- **Auto-refresh a cada 30 segundos** (corrigido no final do projeto):

```javascript
let refreshTimer = null

onMounted(() => {
  reload()
  refreshTimer = setInterval(silentReload, 30000)
})

onUnmounted(() => clearInterval(refreshTimer))
```

#### AgendaView.vue — Agenda completa

- Calendário com botões ← →
- Filtros: Todos / Pendentes / Confirmados / Cancelados / Concluídos
- Lista de agendamentos do dia escolhido
- Também tem auto-refresh

#### LoginView.vue — Login admin

- Campos: email, senha
- **Checkbox "Lembrar acesso"** (corrigido no final):
  - Marcado → JWT dura 30 dias + email fica salvo
  - Desmarcado → JWT dura 8 horas
- Pré-preenche o email se já foi salvo

---

## 8. INTEGRAÇÃO WHATSAPP: EVOLUTION API

### O que é

Evolution API é um software gratuito que controla o WhatsApp Web. Você roda ela num servidor, escaneia o QR code com o WhatsApp do celular, e ela permite enviar/receber mensagens via requisições HTTP.

### Como conectamos

1. **Subir o Evolution API** no Railway (Docker)
2. **Criar instância** com nome "sobrancelhas":
   ```
   POST /instance/create
   { instanceName: "sobrancelhas", token: "sobrancelhas_evo_key_2025" }
   ```
3. **Gerar QR code:**
   ```
   GET /instance/connect/sobrancelhas
   ```
4. **Déborah escaneia** o QR code com o WhatsApp dela
5. **Conectado!** Agora podemos enviar mensagens em nome dela.

### Configurar webhook

Para receber as respostas dos clientes, dizemos à Evolution API para mandar tudo para o nosso backend:

```
POST /webhook/set/sobrancelhas
{
  url: "https://sistema-sobrancelhas-production.up.railway.app/api/whatsapp/webhook",
  events: ["MESSAGES_UPSERT"]
}
```

### Enviar mensagem

Nosso backend faz:

```javascript
fetch('https://evolution-api-production-b38c.up.railway.app/message/sendText/sobrancelhas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: 'sobrancelhas_evo_key_2025' },
  body: JSON.stringify({
    number: '5538999991234',
    textMessage: { text: 'Olá!' }
  })
})
```

### Receber resposta (webhook)

Quando o cliente responde "1" ou "2", a Evolution API faz:

```
POST /api/whatsapp/webhook
{
  data: {
    key: { remoteJid: "5538999991234@s.whatsapp.net", fromMe: false },
    message: { conversation: "1" }
  }
}
```

Nosso backend processa:
- Pega o telefone
- Acha o cliente com aquele telefone
- Acha o agendamento dele que está pendente
- Se mensagem == "1" → status confirmed + notifica Déborah
- Se mensagem == "2" → status cancelled + notifica Déborah

### Fluxo completo de mensagens

```
[Cliente] Faz agendamento no site
    ↓
[Backend] POST /api/appointments → salva no banco
    ↓
[Backend] Manda WhatsApp para cliente: "Agendamento confirmado..."
[Backend] Manda WhatsApp para Déborah: "Novo agendamento..."
    ↓
... (30 min antes do horário)
    ↓
[Cron] A cada 1 minuto verifica agendamentos próximos
    ↓
[Cron] Manda: "Você vai comparecer? 1=SIM 2=NÃO"
[Cron] Marca confirmation.reminderSent = true
    ↓
[Cliente] Responde "1" no WhatsApp
    ↓
[Evolution API] Manda webhook para nosso backend
    ↓
[Backend] Encontra o agendamento, marca como confirmed
[Backend] Manda WhatsApp para Déborah: "✅ Maria confirmou"
```

---

## 9. AUTENTICAÇÃO: JWT + BCRYPT

### Por que JWT?

JWT (JSON Web Token) é um token criptografado que contém:
- Dados do usuário (ID, role)
- Data de expiração
- Assinatura secreta

Vantagens:
- **Stateless:** não precisa consultar o banco a cada requisição
- **Seguro:** assinatura impede falsificação
- **Padrão da indústria:** funciona em qualquer linguagem

### Anatomia de um JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY...assinatura...
[----- Header -----].[------- Payload --------].[----- Signature -----]
```

Decodificado:
```json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload
{
  "id": "65abc...",
  "role": "admin",
  "iat": 1717488000,   // emitido em (timestamp)
  "exp": 1717516800    // expira em
}

// Signature
HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)
```

### Como funciona no nosso sistema

**1. Login** (`POST /api/auth/login`):

```javascript
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }  // ou '30d' se rememberMe
)
res.json({ token, user })
```

**2. Frontend salva no localStorage:**

```javascript
localStorage.setItem('token', token)
```

**3. Toda requisição inclui o token:**

```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

**4. Backend valida em rotas protegidas:**

```javascript
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = decoded
  next()
}
```

### bcrypt — senhas seguras

**Nunca** salve senhas em texto puro. Use bcrypt para hash:

```javascript
// Salvar
const hash = await bcrypt.hash('senhaDigitada', 12)
// hash = "$2a$12$x7K9zAB...kJ8z9XYZw"

// Verificar
const match = await bcrypt.compare('senhaDigitada', hash)
// match = true ou false
```

O "12" é o "salt rounds" — quanto maior, mais lento (e seguro). 12 leva ~250ms para gerar — bom equilíbrio.

---

## 10. DEPLOY: RAILWAY + DOCKER

### O que aconteceu antes do deploy

Antes do deploy, o sistema rodava só localmente:
- Backend em `http://localhost:3001`
- Frontend em `http://localhost:5173`
- MongoDB local em `localhost:27017`

Mas a Déborah mora em outra cidade — precisava de uma URL pública.

### Etapa 1: Migrar para MongoDB Atlas

Em vez de banco local, criamos um cluster na nuvem:

1. Conta no MongoDB Atlas
2. Criar cluster M0 (free)
3. Usuário com senha
4. Liberar IPs (0.0.0.0/0 para acessar de qualquer lugar)
5. Pegar URI de conexão
6. Mudar `.env` para usar a URI

```javascript
mongoose.connect(process.env.MONGODB_URI)
```

### Etapa 2: Criar conta Railway

Railway é onde hospedamos o servidor.
- Plano Hobby: $5/mês de crédito
- Conecta direto com GitHub
- Detecta automaticamente Node.js, Python, etc.

### Etapa 3: Dockerfile

Criamos um arquivo `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:22-alpine
# Imagem base com Node 22 (versão "alpine" é mais leve)

WORKDIR /app
# Define o diretório de trabalho dentro do container

# Copia e instala dependências do frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copia código do frontend e faz o build
COPY frontend/ ./frontend/
RUN cd frontend && npm run build
# Resultado: frontend/dist/ tem os arquivos estáticos

# Copia e instala dependências do backend (sem dev dependencies)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copia código do backend e uploads
COPY backend/ ./backend/
COPY uploads/ ./uploads/

EXPOSE 3001
# Documenta que o container usa a porta 3001

CMD ["node", "backend/server.js"]
# Comando que roda quando o container inicia
```

### Etapa 4: Servir frontend pelo backend

Quando está em produção, o backend serve os arquivos estáticos do frontend:

```javascript
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')))
}
```

Resultado: o site é acessado em uma URL só. Backend e frontend convivem no mesmo servidor.

### Etapa 5: Variáveis de ambiente no Railway

Configuramos no painel do Railway (também via API):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...@sobrancelhas.bgjjugj.mongodb.net/sobrancelhas
JWT_SECRET=sobrancelhas_jwt_secret_chave_super_segura_2025
JWT_EXPIRES_IN=8h
EVOLUTION_API_URL=https://evolution-api-production-b38c.up.railway.app
EVOLUTION_API_KEY=sobrancelhas_evo_key_2025
EVOLUTION_INSTANCE=sobrancelhas
SALON_PHONE=38999243577
FRONTEND_URL=https://sistema-sobrancelhas-production.up.railway.app
```

### Etapa 6: Deploy Evolution API

Subimos o Evolution API como um SEGUNDO serviço no mesmo projeto Railway:
- Imagem Docker: `atendai/evolution-api:v1.7.4`
- Variáveis específicas (AUTHENTICATION_API_KEY, etc.)
- URL final: `https://evolution-api-production-b38c.up.railway.app`

### Etapa 7: Conectar WhatsApp da Déborah

1. Geramos QR code via API
2. Salvamos como imagem
3. Mostramos para a Déborah por chamada de vídeo
4. Ela escaneou com o WhatsApp do celular dela
5. ✅ Conectado

### Como o Railway atualiza o site

Cada vez que damos `git push origin master`:
1. Railway detecta o push (webhook do GitHub)
2. Inicia um novo build com o `Dockerfile`
3. Quando termina, substitui o container antigo pelo novo
4. URL fica indisponível por ~10 segundos
5. Volta com a nova versão

---

## 11. FLUXOS DO SISTEMA

### Fluxo 1: Cliente faz agendamento

```
1. Cliente abre https://sistema-sobrancelhas-production.up.railway.app
2. Vê a landing page (HomeView)
3. Clica em "Agendar"
4. Vai para BookingView (passo 1)
5. Escolhe um serviço (ex: Designer + Henna)
6. Avança para passo 2
7. Escolhe data no calendário (ex: 24/05/2026)
8. Frontend faz: GET /api/slots?date=2026-05-24&serviceId=...
9. Backend calcula horários disponíveis (considerando duração, intervalo, outros agendamentos)
10. Cliente escolhe horário (ex: 15:00)
11. Avança para passo 3
12. Preenche nome, telefone, observações
13. Clica em "Confirmar"
14. Frontend faz: POST /api/appointments { name, phone, serviceId, date, time }
15. Backend:
    a. Valida campos
    b. Cria ou atualiza cliente (upsert por telefone)
    c. Cria agendamento no banco
    d. Chama sendBookingConfirmation()
16. WhatsApp service:
    a. Manda mensagem para o cliente com detalhes + link de cancelamento
    b. Manda mensagem para a Déborah informando o novo agendamento
17. Frontend mostra tela de sucesso
```

### Fluxo 2: Lembrete automático

```
[Servidor] Cron roda a cada 1 minuto
[Servidor] Busca: agendamentos em ~30min, sem lembrete enviado, status != cancelled
[Servidor] Para cada um:
   - Manda: "Olá [nome]! Seu horário é em 30 minutos.
            Você vai comparecer? 1=SIM 2=NÃO"
   - Marca confirmation.reminderSent = true
```

### Fluxo 3: Cliente responde no WhatsApp

```
[Cliente] Responde "1" no WhatsApp
    ↓
[Evolution API] Detecta nova mensagem
[Evolution API] POST https://.../api/whatsapp/webhook
    body: { data: { key: { remoteJid: "5538...@s.whatsapp.net" },
                    message: { conversation: "1" } } }
    ↓
[Backend webhook]:
   1. Ignora se fromMe = true (mensagem própria)
   2. Responde 200 imediatamente para Evolution não retentar
   3. Processa em segundo plano:
      a. Extrai telefone do remoteJid
      b. Busca cliente com aquele telefone
      c. Busca agendamento pendente dele (próximo)
      d. Texto "1" → confirma: status = confirmed
      e. Texto "2" → cancela: status = cancelled
      f. Chama notifyOwnerOfResponse(): manda mensagem para Déborah
```

### Fluxo 4: Cliente cancela pelo link

```
[Cliente] Clica no link "Para cancelar: .../cancelar/XYZ"
    ↓
[Frontend CancelView] GET /api/appointments/XYZ/public
[Backend] Retorna dados do agendamento
[Frontend] Mostra card com detalhes + botão "Confirmar Cancelamento"
    ↓
[Cliente] Clica "Confirmar"
[Frontend] POST /api/appointments/XYZ/cancel
[Backend]:
   1. Busca agendamento
   2. Valida (não pode estar já cancelado, no passado, etc.)
   3. status = cancelled
   4. await appt.save()
   5. sendCancellationNotification():
      - Manda WhatsApp para cliente confirmando
      - Manda WhatsApp para Déborah avisando
[Frontend] Mostra "Agendamento cancelado"
```

### Fluxo 5: Déborah administra

```
[Déborah] Abre /login
[Déborah] Digita email/senha + marca "Lembrar acesso"
[Frontend] POST /api/auth/login { email, password, rememberMe: true }
[Backend] Valida, cria JWT de 30 dias, retorna
[Frontend] Salva token no localStorage, redireciona para /admin/dashboard
[Déborah] Vê resumo do dia (cards de totais + lista de agendamentos)
   - Cards: Hoje, Pendentes, Confirmados, Cancelados
   - Lista usa AppointmentCard
[Dashboard] Auto-refresh a cada 30s busca novos dados
[Déborah] Pode clicar no select de status para alterar manualmente
[Déborah] Pode ir para Agenda (navega entre dias)
[Déborah] Pode ir para Serviços e adicionar/editar/desativar
[Déborah] Pode ir para Configurações e mudar horários
```

---

## 12. VARIÁVEIS DE AMBIENTE

São configurações que NÃO ficam no código (segurança).
Ficam em arquivo `.env` (gitignored) localmente e no painel do Railway em produção.

| Variável | Função | Exemplo |
|----------|--------|---------|
| `MONGODB_URI` | Endereço do banco | `mongodb+srv://...` |
| `JWT_SECRET` | Chave para assinar JWTs | string aleatória longa |
| `JWT_EXPIRES_IN` | Duração padrão do token | `8h` |
| `PORT` | Porta do servidor | `3001` |
| `NODE_ENV` | Ambiente (dev/prod) | `production` |
| `FRONTEND_URL` | URL para links nos WhatsApps | `https://...` |
| `EVOLUTION_API_URL` | Endereço do Evolution API | `https://evolution-api-production...` |
| `EVOLUTION_API_KEY` | Chave do Evolution | `sobrancelhas_evo_key_2025` |
| `EVOLUTION_INSTANCE` | Nome da instância | `sobrancelhas` |
| `SALON_PHONE` | WhatsApp da Déborah | `38999243577` |

**Importante:** Se mudar uma variável no Railway, precisa **redeploy** para o servidor pegar o novo valor. Foi exatamente o bug que enfrentamos no fim.

---

## 13. BUGS ENFRENTADOS E COMO FORAM RESOLVIDOS

### Bug 1: Build falhando no Railway — "vite not found"

**Sintoma:** Deploy falhava com `sh: vite: not found` durante o `npm run build`.

**Causa:** Quando `NODE_ENV=production`, o npm pula as devDependencies. Vite estava listado como devDependency.

**Solução:** Forçar instalação de tudo no build do frontend:

```dockerfile
RUN cd frontend && npm install --include=dev
```

### Bug 2: "@apply" não funciona no Tailwind v4

**Sintoma:** Build falhava com erro de `@apply text-sm` no `ConfigView.vue`.

**Causa:** Tailwind v4 não suporta `@apply` em `<style scoped>` sem configuração extra.

**Solução:** Substituir por CSS puro:

```css
/* Antes */
.lbl { @apply block text-sm font-medium text-zinc-400 mb-1; }

/* Depois */
.lbl {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #a1a1aa;
  margin-bottom: 0.25rem;
}
```

### Bug 3: Node 20 muito antigo para Vite 8

**Sintoma:** `Vite requires Node.js version >=20.19.0 or >=22.12.0`

**Causa:** Versão do Node no nixpacks era 20.6.1.

**Solução:** Trocar para Dockerfile com `FROM node:22-alpine` (controle total).

### Bug 4: WhatsApp em modo SIMULADO

**Sintoma:** Agendamentos eram criados mas mensagens não chegavam. Logs mostravam:
```
[WhatsApp SIMULADO] → 38999432112: ✅ Agendamento confirmado!
```

**Causa:** O código tinha:
```javascript
const BASE_URL = process.env.EVOLUTION_API_URL  // lê na inicialização
if (!BASE_URL || !API_KEY) {
  console.log('[SIMULADO]')
  return
}
```

As variáveis foram configuradas DEPOIS do servidor iniciar. Mudou no Railway mas o container antigo continuava lendo `undefined`.

**Solução:** Forçar redeploy do backend depois de configurar variáveis.

### Bug 5: Dashboard não mostrava cancelamento

**Sintoma:** Cliente cancelava pelo link, WhatsApp chegava na Déborah, mas o dashboard continuava mostrando o agendamento como ativo.

**Causa:** O DashboardView só carregava dados uma vez (`onMounted`). Se o cancelamento acontecia em outra aba, o dashboard não atualizava.

**Solução:** Adicionar auto-refresh a cada 30 segundos:

```javascript
let refreshTimer = null

onMounted(() => {
  reload()
  refreshTimer = setInterval(silentReload, 30000)
})

onUnmounted(() => clearInterval(refreshTimer))
```

### Bug 6: Mobile com scroll horizontal

**Sintoma:** No celular, vários painéis admin tinham conteúdo cortado pela direita.

**Causa:** Elementos como `<select>` de status nos cards de agendamento eram muito largos para a tela.

**Solução:** Mover o select para baixo do card, com largura total:

```html
<!-- Antes: select ao lado, comprime conteúdo -->
<div class="flex">
  <div class="flex-1">...</div>
  <select class="shrink-0">...</select>
</div>

<!-- Depois: select embaixo, largura total -->
<div>
  <div>...</div>
  <select class="w-full mt-3">...</select>
</div>
```

### Bug 7: Roteador local bloqueia MongoDB Atlas

**Sintoma:** Conexão local com MongoDB Atlas falhava com timeout. Funcionava no Railway.

**Causa:** O roteador da casa bloqueava resolução SRV de DNS.

**Solução:** Usar URI direta (não-SRV) localmente:
```
mongodb://user:pass@shard-00-00...:27017,shard-00-01...:27017/...
```

E URI SRV (`mongodb+srv://...`) no Railway, onde funciona.

---

## 14. GLOSSÁRIO DE COMANDOS USADOS

### Git (versionamento)

```bash
git status              # Ver arquivos modificados
git add arquivo.js      # Adicionar arquivo para commit
git add .               # Adicionar TUDO (cuidado!)
git commit -m "msg"     # Criar commit com mensagem
git push origin dev     # Mandar para o GitHub (branch dev)
git checkout master     # Mudar para branch master
git merge dev           # Trazer mudanças da dev para a atual
git log --oneline       # Ver histórico
git branch -a           # Listar branches
```

### Node/npm

```bash
npm install             # Instalar dependências do package.json
npm install pacote      # Adicionar nova dependência
npm install -D pacote   # Adicionar como dev dependency
npm run dev             # Rodar servidor de desenvolvimento
npm run build           # Fazer build de produção
npm start               # Iniciar (geralmente em produção)
node arquivo.js         # Rodar um script Node
```

### Railway CLI

```bash
railway login           # Autenticar
railway link            # Conectar pasta a um projeto
railway up              # Fazer deploy do diretório atual
railway logs            # Ver logs do servidor
railway variables       # Ver variáveis de ambiente
railway open            # Abrir painel no navegador
```

### MongoDB

```javascript
// No Mongoose
Model.find({ filtro })              // SELECT * WHERE
Model.findOne({ filtro })           // SELECT * WHERE LIMIT 1
Model.findById(id)                  // SELECT por _id
Model.create({ dados })             // INSERT
Model.updateOne({ filtro }, { $set: { campo: valor } })  // UPDATE
Model.deleteOne({ filtro })         // DELETE
Model.findOneAndUpdate({ filtro }, dados, { upsert: true })  // UPSERT
```

---

## 15. ASPECTOS FINANCEIROS DO PROJETO

### Custos mensais

| Item | Valor |
|------|-------|
| Railway (Hobby) | ~$5/mês (~R$ 28) |
| MongoDB Atlas (M0) | Grátis para sempre |
| GitHub privado | Grátis (até 3 colaboradores) |
| Evolution API | Grátis (auto-hospedado no Railway, conta no custo dele) |
| Domínio personalizado | Opcional, ~R$ 40/ano |
| **TOTAL** | **~R$ 28/mês** |

### Receita do Helom

- Cobra R$ 80/mês da Déborah
- Lucro líquido: R$ 80 - R$ 28 = **R$ 52/mês**
- Em 1 ano: R$ 624 (descontando custos)
- Em 5 anos (se manter): R$ 3.120

### Valor para a Déborah

- **Sem o sistema:** perdia 1-2 clientes/mês por confusão (~R$ 50/cliente)
- **Com o sistema:** zero perdas, marketing automático via WhatsApp
- **ROI da Déborah:** paga R$ 80, ganha (estimado) R$ 200+ em clientes recuperados

---

## CONCLUSÃO

O sistema é uma aplicação web completa (full-stack) que:
- Resolve um problema real (agendamentos no salão da Déborah)
- Usa tecnologias modernas e gratuitas
- Está em produção, funcionando, com clientes reais usando
- Foi construído **do zero** por um desenvolvedor iniciante (Helom) com ajuda do Claude Code
- Custa pouco (~R$ 28/mês) e gera receita (R$ 80/mês)

Lições principais para o Helom:
1. **Stack moderno funciona:** Vue + Node + MongoDB cobre 95% dos casos
2. **Variáveis de ambiente são críticas:** sempre verifique se foram aplicadas em produção
3. **Deploy é iterativo:** errar e corrigir é parte do processo
4. **Mobile-first importa:** Brasil é majoritariamente mobile
5. **Auto-refresh > polling manual:** UX melhor para dashboards
6. **WhatsApp é o canal:** no Brasil, qualquer sistema sério tem que mandar WhatsApp

Para aprofundar (se quiser estudar mais):
- Documentação Vue.js: https://vuejs.org/
- Documentação Express: https://expressjs.com/
- Documentação Mongoose: https://mongoosejs.com/
- Documentação Railway: https://docs.railway.app/
- Documentação Evolution API: https://doc.evolution-api.com/

---

**Fim do Relatório.**
**Autor original do código:** Helom Ramos
**Assistente IA:** Claude Code (Anthropic)
**Data de finalização:** 24 de Maio de 2026

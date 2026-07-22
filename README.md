# Nexa Agenda — Backend

API REST responsável pelas regras de negócio, autenticação, disponibilidade de horários e gerenciamento de agendamentos da plataforma **Nexa Agenda**.

O projeto foi desenvolvido como parte de um teste técnico para uma oportunidade de **Desenvolvedor Full Stack Júnior**, demonstrando conhecimentos em Node.js, TypeScript, Express, PostgreSQL, Prisma ORM, autenticação JWT, validação de dados, segurança e arquitetura em camadas.

<p align="center">
  <a href="https://nexa-agenda-backend-production.up.railway.app/api/health">
    <img src="https://img.shields.io/badge/API-Online-success" alt="API online">
  </a>
  <a href="https://nexa-agenda-frontend.vercel.app">
    <img src="https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel" alt="Frontend na Vercel">
  </a>
  <a href="https://nexa-agenda-backend-production.up.railway.app">
    <img src="https://img.shields.io/badge/Backend-Railway-0B0D0E?logo=railway" alt="Backend no Railway">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

---

## Sumário

* [Sobre o projeto](#sobre-o-projeto)
* [Demonstração](#demonstração)
* [Principais destaques](#principais-destaques)
* [Funcionalidades](#funcionalidades)
* [Regras de negócio](#regras-de-negócio)
* [Arquitetura](#arquitetura)
* [Tecnologias](#tecnologias)
* [Banco de dados](#banco-de-dados)
* [Endpoints](#endpoints)
* [Autenticação](#autenticação)
* [Segurança](#segurança)
* [Como executar](#como-executar)
* [Variáveis de ambiente](#variáveis-de-ambiente)
* [Scripts disponíveis](#scripts-disponíveis)
* [Deploy](#deploy)
* [Decisões técnicas](#decisões-técnicas)
* [Melhorias futuras](#melhorias-futuras)
* [Autor](#autor)

---

## Sobre o projeto

O **Nexa Agenda** é uma plataforma Full Stack criada para digitalizar o processo de agendamento e gerenciamento de serviços.

Este repositório contém o backend da aplicação, responsável por:

* disponibilizar os serviços cadastrados;
* calcular horários disponíveis;
* validar conflitos entre agendamentos;
* cadastrar e consultar atendimentos;
* autenticar administradores;
* proteger rotas administrativas;
* fornecer indicadores operacionais;
* controlar o status dos agendamentos;
* persistir as informações em um banco PostgreSQL.

A API foi construída com foco em separação de responsabilidades, consistência dos dados, segurança e facilidade de manutenção.

O frontend que consome esta API está disponível em:

* **Aplicação:** https://nexa-agenda-frontend.vercel.app
* **Repositório:** https://github.com/MaximillionDev1/nexa-agenda-frontend

---

## Demonstração

### Aplicação em produção

| Serviço      | Endereço                                                         |
| ------------ | ---------------------------------------------------------------- |
| Frontend     | https://nexa-agenda-frontend.vercel.app                          |
| Backend      | https://nexa-agenda-backend-production.up.railway.app            |
| Health check | https://nexa-agenda-backend-production.up.railway.app/api/health |

### Credenciais de demonstração

> As credenciais abaixo são destinadas exclusivamente à demonstração e avaliação técnica do projeto.

| Campo  | Valor                  |
| ------ | ---------------------- |
| E-mail | `admin@nexaagenda.com` |
| Senha  | `Admin@123`            |

> Em uma aplicação comercial, credenciais de demonstração não devem ser utilizadas em ambientes com dados reais.

### Fluxo completo

![Demonstração do Nexa Agenda](./docs/images/demo.gif)

### Dashboard administrativo

![Dashboard administrativo](./docs/images/admin-dashboard.png)

### Gestão de agendamentos

![Gestão de agendamentos](./docs/images/admin-appointments.png)

---

## Principais destaques

* API REST desenvolvida com Node.js, Express e TypeScript
* Arquitetura organizada em camadas
* Banco de dados PostgreSQL com Prisma ORM
* Autenticação administrativa utilizando JWT
* Senhas protegidas com hash por meio do bcrypt
* Validação de entradas utilizando Zod
* Cálculo de disponibilidade baseado em horários de funcionamento
* Prevenção de conflitos e sobreposição de agendamentos
* Criação de agendamentos utilizando transação no banco
* Consulta pública protegida por código e telefone
* Rotas administrativas protegidas por middleware
* Tratamento centralizado de erros
* Proteção com Helmet, CORS e rate limiting
* Seed configurado para preparação do ambiente
* Deploy da API e do banco de dados no Railway

---

## Funcionalidades

### Serviços

* Listagem pública de serviços ativos
* Consulta de serviço por identificador
* Cadastro de novos serviços
* Atualização de serviços existentes
* Ativação e desativação de serviços
* Exclusão de serviços

### Disponibilidade

* Consulta de horários disponíveis por data e serviço
* Cálculo baseado na duração de cada serviço
* Respeito ao horário de funcionamento de cada dia
* Intervalos de horários organizados em blocos de 30 minutos
* Exclusão de horários já ocupados
* Desconsideração de agendamentos cancelados
* Consulta do próximo horário disponível

### Agendamentos

* Criação pública de agendamentos
* Geração de código público de identificação
* Consulta de agendamento por código e telefone
* Listagem administrativa de agendamentos
* Consulta individual por identificador
* Filtros por data, status, serviço e cliente
* Atualização do status do atendimento
* Cancelamento de agendamentos
* Exclusão de agendamentos
* Estatísticas dos atendimentos do dia
* Consulta da receita prevista do dia

### Administração

* Login do administrador
* Geração de token JWT
* Validação da sessão autenticada
* Consulta dos dados do administrador autenticado
* Dashboard com indicadores operacionais
* Proteção de rotas privadas

---

## Regras de negócio

A disponibilidade de horários é uma das principais responsabilidades da API.

As regras foram centralizadas no backend para impedir que alterações ou manipulações realizadas no cliente comprometam a consistência dos dados.

### Validação de datas e horários

A API não permite:

* agendamentos em datas passadas;
* horários anteriores ao momento atual;
* agendamentos fora do horário de funcionamento;
* agendamentos utilizando serviços inexistentes;
* agendamentos utilizando serviços inativos;
* reservas que ultrapassem o período de funcionamento;
* reservas que entrem em conflito com atendimentos existentes.

### Horário de funcionamento

O seed inicial configura os seguintes períodos:

| Dia           | Funcionamento  |
| ------------- | -------------- |
| Segunda-feira | 09:00 às 18:00 |
| Terça-feira   | 09:00 às 18:00 |
| Quarta-feira  | 09:00 às 18:00 |
| Quinta-feira  | 09:00 às 18:00 |
| Sexta-feira   | 09:00 às 18:00 |
| Sábado        | 09:00 às 16:00 |
| Domingo       | Fechado        |

Os horários disponíveis são calculados considerando:

1. o dia selecionado;
2. o horário de abertura;
3. o horário de fechamento;
4. a duração do serviço;
5. os agendamentos já cadastrados;
6. o status dos agendamentos existentes;
7. o horário atual, quando a data consultada é o dia corrente.

### Detecção de conflitos

Antes de persistir um agendamento, a API verifica se o intervalo solicitado possui interseção com algum agendamento existente.

A validação considera:

```text
Novo atendimento
├── horário inicial
└── horário final

Atendimento existente
├── horário inicial
└── horário final
```

Existe conflito quando os intervalos se sobrepõem, ainda que os horários iniciais sejam diferentes.

Agendamentos com status `CANCELED` não bloqueiam novos horários.

### Criação transacional

A criação do agendamento utiliza uma transação no banco de dados.

Dentro da operação, a API realiza novamente a verificação de disponibilidade antes da persistência, reduzindo o risco de inconsistências entre a consulta inicial e a confirmação do atendimento.

### Consulta pública

Para consultar um agendamento sem autenticação administrativa, o cliente precisa informar:

* código público do agendamento;
* telefone utilizado no cadastro.

O telefone é normalizado antes da comparação, evitando diferenças causadas por máscaras ou formatações.

---

## Status dos agendamentos

Os agendamentos podem assumir os seguintes estados:

| Status      | Descrição              |
| ----------- | ---------------------- |
| `SCHEDULED` | Atendimento agendado   |
| `CONFIRMED` | Atendimento confirmado |
| `COMPLETED` | Atendimento concluído  |
| `CANCELED`  | Atendimento cancelado  |

O status é utilizado tanto no gerenciamento administrativo quanto no cálculo de disponibilidade.

---

## Arquitetura

A API utiliza uma arquitetura em camadas para separar as responsabilidades do sistema.

```text
HTTP Request
      │
      ▼
    Routes
      │
      ▼
 Controllers
      │
      ▼
   Services
      │
      ▼
Repositories
      │
      ▼
 Prisma ORM
      │
      ▼
 PostgreSQL
```

### Routes

Responsáveis por:

* definir os endpoints;
* associar métodos HTTP;
* aplicar middlewares;
* encaminhar requisições aos controllers.

### Controllers

Responsáveis pela camada HTTP:

* recebem parâmetros, query strings e corpo da requisição;
* acionam os serviços correspondentes;
* retornam a resposta ao cliente;
* encaminham erros ao tratamento centralizado.

### Services

Concentram as regras de negócio da aplicação:

* autenticação;
* disponibilidade;
* criação de agendamentos;
* validação de conflitos;
* atualização de status;
* cálculo de indicadores;
* gerenciamento de serviços.

### Repositories

Responsáveis pela comunicação com o banco de dados através do Prisma ORM.

Essa camada mantém consultas e operações de persistência separadas das regras de negócio.

### Schemas

Utilizam Zod para validar:

* corpo das requisições;
* parâmetros de rota;
* filtros;
* credenciais;
* dados de criação e atualização.

### Middlewares

Aplicam comportamentos compartilhados:

* autenticação JWT;
* tratamento centralizado de erros;
* proteção de rotas;
* segurança da API.

### Utils

Reúnem funções auxiliares, como:

* geração de códigos públicos;
* criação e validação de tokens;
* cálculo de horários;
* normalização de telefone;
* manipulação de datas;
* validação de disponibilidade.

---

## Estrutura do projeto

```text
nexa-agenda-backend/
├── docs/
│   └── images/
│       ├── admin-appointments.png
│       ├── admin-dashboard.png
│       └── demo.gif
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

> A estrutura pode apresentar pequenas diferenças conforme a evolução do projeto, mas mantém a separação entre as principais responsabilidades da API.

---

## Tecnologias

### Core

| Tecnologia | Responsabilidade                |
| ---------- | ------------------------------- |
| Node.js    | Ambiente de execução JavaScript |
| Express    | Construção da API REST          |
| TypeScript | Tipagem estática                |
| PostgreSQL | Banco de dados relacional       |
| Prisma ORM | Modelagem e acesso ao banco     |

### Validação e autenticação

| Tecnologia     | Responsabilidade                       |
| -------------- | -------------------------------------- |
| Zod            | Validação de entradas                  |
| JSON Web Token | Autenticação e autorização             |
| bcrypt         | Hash e comparação de senhas            |
| dotenv         | Carregamento das variáveis de ambiente |

### Segurança

| Tecnologia         | Responsabilidade                        |
| ------------------ | --------------------------------------- |
| Helmet             | Configuração de cabeçalhos HTTP seguros |
| CORS               | Controle das origens autorizadas        |
| Express Rate Limit | Limitação de requisições                |

### Qualidade e testes

| Tecnologia          | Responsabilidade                    |
| ------------------- | ----------------------------------- |
| Vitest              | Ferramenta de testes                |
| Supertest           | Testes de integração para endpoints |
| TypeScript Compiler | Validação e compilação do código    |

---

## Banco de dados

O banco de dados é modelado utilizando Prisma ORM e PostgreSQL.

### Entidades

```text
Admin
Service
Appointment
BusinessHours
```

### Admin

Representa os usuários autorizados a acessar o painel administrativo.

Principais responsabilidades:

* armazenar os dados do administrador;
* manter a senha protegida por hash;
* permitir autenticação na área privada.

### Service

Representa os serviços disponíveis para agendamento.

Um serviço pode possuir:

* nome;
* descrição;
* duração;
* preço;
* situação ativa ou inativa.

A duração do serviço influencia diretamente o cálculo dos horários disponíveis.

### Appointment

Representa um atendimento agendado.

O registro relaciona:

* cliente;
* telefone;
* serviço;
* data;
* horário inicial;
* horário final;
* status;
* código público.

### BusinessHours

Armazena os horários de funcionamento para cada dia da semana.

Essas informações são utilizadas no cálculo de disponibilidade.

### Relacionamento simplificado

```text
Service
   │
   │ 1
   │
   │ N
   ▼
Appointment

BusinessHours
   │
   └── define os períodos disponíveis por dia

Admin
   └── possui acesso às operações administrativas
```

---

## Endpoints

A URL base da API em produção é:

```text
https://nexa-agenda-backend-production.up.railway.app/api
```

---

### Health check

#### Verificar o funcionamento da API

```http
GET /api/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

## Autenticação

### Login administrativo

```http
POST /api/auth/login
```

Exemplo de requisição:

```json
{
  "email": "admin@nexaagenda.com",
  "password": "Admin@123"
}
```

A resposta contém o token JWT utilizado nas rotas protegidas.

### Consultar administrador autenticado

```http
GET /api/auth/me
```

Requer autenticação.

---

## Serviços

### Listar serviços

```http
GET /api/services
```

Rota pública.

### Consultar serviço por ID

```http
GET /api/services/:id
```

Rota pública.

### Criar serviço

```http
POST /api/services
```

Requer autenticação.

### Atualizar serviço

```http
PATCH /api/services/:id
```

Requer autenticação.

### Ativar ou desativar serviço

```http
PATCH /api/services/:id/toggle
```

Requer autenticação.

### Excluir serviço

```http
DELETE /api/services/:id
```

Requer autenticação.

---

## Disponibilidade

### Consultar horários disponíveis

```http
GET /api/availability
```

A consulta deve informar os dados necessários para identificar a data e o serviço desejado.

Rota pública.

### Consultar o próximo horário disponível

```http
GET /api/next-available-slot
```

Rota pública.

---

## Agendamentos públicos

### Criar agendamento

```http
POST /api/appointments
```

Exemplo conceitual de requisição:

```json
{
  "serviceId": "service-id",
  "customerName": "Nome do cliente",
  "customerPhone": "(11) 99999-9999",
  "date": "2026-07-30",
  "startTime": "10:00"
}
```

Os campos exatos devem seguir os schemas definidos na aplicação.

### Consultar agendamento

```http
POST /api/appointments/lookup
```

Exemplo:

```json
{
  "publicCode": "CODIGO",
  "phone": "(11) 99999-9999"
}
```

---

## Agendamentos administrativos

As rotas abaixo exigem autenticação JWT.

### Listar agendamentos

```http
GET /api/appointments
```

### Consultar agendamento por ID

```http
GET /api/appointments/:id
```

### Atualizar status

```http
PATCH /api/appointments/:id/status
```

### Cancelar agendamento

```http
PATCH /api/appointments/:id/cancel
```

### Excluir agendamento

```http
DELETE /api/appointments/:id
```

### Consultar estatísticas do dia

```http
GET /api/appointments/stats/today
```

### Consultar receita prevista do dia

```http
GET /api/appointments/revenue/today
```

---

## Dashboard

### Consultar dados do dashboard

```http
GET /api/admin/dashboard
```

Requer autenticação.

A rota disponibiliza os indicadores utilizados pelo painel administrativo.

---

## Autenticação

As rotas administrativas utilizam autenticação baseada em JSON Web Token.

Após o login, o token deve ser enviado no cabeçalho `Authorization`:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

Fluxo simplificado:

```text
Administrador envia e-mail e senha
              │
              ▼
API localiza o administrador
              │
              ▼
bcrypt compara a senha
              │
              ▼
API gera um token JWT
              │
              ▼
Cliente envia o token nas rotas protegidas
              │
              ▼
Middleware valida o token
              │
              ▼
Acesso autorizado
```

A expiração do token pode ser configurada através da variável:

```env
JWT_EXPIRES_IN=
```

---

## Segurança

A API aplica diferentes medidas de segurança.

### Hash de senha

As senhas administrativas não são armazenadas em texto puro.

O bcrypt é utilizado para:

* gerar o hash;
* comparar a senha informada no login;
* impedir a exposição direta da credencial original.

### JWT

As rotas administrativas exigem um token válido.

O middleware de autenticação verifica:

* presença do token;
* formato do cabeçalho;
* assinatura;
* validade;
* expiração.

### Helmet

O Helmet configura cabeçalhos HTTP relacionados à segurança da aplicação.

### CORS

O CORS restringe as origens autorizadas a consumir a API.

A origem principal é configurada pela variável:

```env
FRONTEND_URL=
```

### Rate limiting

O Express Rate Limit reduz o risco de abuso ao limitar a quantidade de requisições realizadas dentro de determinado período.

### Validação de entrada

Os dados recebidos pela API são validados com Zod antes de chegarem às operações principais.

Isso evita que dados incompletos ou incompatíveis sejam persistidos.

### Tratamento centralizado de erros

Os erros da aplicação são encaminhados a um middleware centralizado, garantindo respostas consistentes e evitando a exposição desnecessária de detalhes internos.

---

## Como executar

### Pré-requisitos

Antes de iniciar, tenha instalado:

* Node.js
* npm
* PostgreSQL
* Git

### 1. Clone o repositório

```bash
git clone https://github.com/MaximillionDev1/nexa-agenda-backend.git
```

### 2. Acesse a pasta

```bash
cd nexa-agenda-backend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell, também é possível utilizar:

```powershell
Copy-Item .env.example .env
```

Preencha as variáveis conforme seu ambiente.

### 5. Gere o Prisma Client

```bash
npm run prisma:generate
```

### 6. Execute as migrations

Durante o desenvolvimento:

```bash
npm run prisma:migrate
```

Em ambiente de produção:

```bash
npm run prisma:migrate:deploy
```

### 7. Execute o seed

```bash
npm run prisma:seed
```

O seed prepara os dados iniciais necessários para demonstração da aplicação.

### 8. Inicie o servidor

```bash
npm run dev
```

A porta utilizada depende da configuração da variável `PORT`.

---

## Variáveis de ambiente

O backend utiliza as seguintes variáveis:

```env
DATABASE_URL=
NODE_ENV=
PORT=
JWT_SECRET=
JWT_EXPIRES_IN=
FRONTEND_URL=
```

### Descrição

| Variável         | Obrigatória | Descrição                             |
| ---------------- | ----------: | ------------------------------------- |
| `DATABASE_URL`   |         Sim | String de conexão com o PostgreSQL    |
| `NODE_ENV`       |         Sim | Ambiente atual da aplicação           |
| `PORT`           |         Sim | Porta utilizada pelo servidor         |
| `JWT_SECRET`     |         Sim | Chave de assinatura dos tokens        |
| `JWT_EXPIRES_IN` |         Sim | Tempo de expiração do JWT             |
| `FRONTEND_URL`   |         Sim | Origem principal autorizada pelo CORS |

Exemplo local:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nexa_agenda"
NODE_ENV="development"
PORT="3333"
JWT_SECRET="substitua-por-uma-chave-segura"
JWT_EXPIRES_IN="1d"
FRONTEND_URL="http://localhost:5173"
```

> Nunca publique o arquivo `.env` nem utilize a mesma chave JWT em diferentes ambientes.

---

## Scripts disponíveis

| Comando                         | Descrição                                    |
| ------------------------------- | -------------------------------------------- |
| `npm run dev`                   | Inicia a aplicação em desenvolvimento        |
| `npm run build`                 | Compila o TypeScript                         |
| `npm start`                     | Inicia a versão compilada                    |
| `npm run start:prod`            | Prepara e inicia a aplicação em produção     |
| `npm run prisma:generate`       | Gera o Prisma Client                         |
| `npm run prisma:migrate`        | Executa migrations em desenvolvimento        |
| `npm run prisma:migrate:deploy` | Aplica migrations em produção                |
| `npm run prisma:seed`           | Executa o seed do banco                      |
| `npm run prisma:studio`         | Abre a interface visual do Prisma            |
| `npm run lint`                  | Executa a verificação configurada no projeto |
| `npm test`                      | Executa os testes com Vitest                 |

---

## Prisma Studio

Para visualizar e gerenciar os dados localmente:

```bash
npm run prisma:studio
```

O Prisma Studio permite consultar as tabelas e registros por meio de uma interface visual.

> Utilize esta ferramenta com cautela em bancos de produção.

---

## Deploy

A API está publicada no Railway.

### Backend

```text
https://nexa-agenda-backend-production.up.railway.app
```

### Banco de dados

O PostgreSQL utilizado pela aplicação também é disponibilizado no ambiente de produção.

### Processo de produção

O fluxo de deploy inclui:

```text
Push para o repositório
          │
          ▼
Railway inicia o build
          │
          ▼
Dependências são instaladas
          │
          ▼
Prisma Client é gerado
          │
          ▼
Migrations são aplicadas
          │
          ▼
Seed prepara os dados necessários
          │
          ▼
Aplicação compilada é iniciada
```

As variáveis de ambiente devem ser cadastradas diretamente no serviço de hospedagem.

---

## Decisões técnicas

### TypeScript

O TypeScript foi utilizado para aumentar a previsibilidade do código, melhorar o suporte da IDE e reduzir erros relacionados a tipos durante o desenvolvimento.

### Arquitetura em camadas

A separação entre routes, controllers, services e repositories evita que regras de negócio, responsabilidades HTTP e acesso ao banco fiquem concentrados no mesmo arquivo.

Essa divisão facilita:

* manutenção;
* leitura;
* reutilização;
* testes;
* evolução do sistema.

### Prisma ORM

O Prisma foi escolhido para oferecer:

* acesso tipado ao banco;
* definição centralizada do schema;
* gerenciamento de migrations;
* relacionamentos;
* Prisma Client;
* maior produtividade no acesso aos dados.

### PostgreSQL

O PostgreSQL foi utilizado por se tratar de um banco relacional adequado para dados estruturados e relacionamentos entre serviços e agendamentos.

### Zod

O Zod centraliza a validação das entradas e impede que dados inválidos avancem até as regras de negócio ou persistência.

### JWT

O JWT permite que o backend valide requisições administrativas sem manter sessões armazenadas no servidor.

### Validação no backend

Embora o frontend também valide formulários e horários, o backend é a fonte de verdade.

Toda operação sensível é validada novamente pela API antes da persistência.

### Consulta com código e telefone

A consulta pública combina o código gerado para o agendamento com o telefone do cliente, evitando que apenas um identificador isolado dê acesso às informações.

### Transações

A criação do agendamento utiliza transação para manter as verificações e a persistência dentro de uma operação consistente.

---

## Respostas de erro

A API utiliza tratamento centralizado para retornar respostas consistentes.

Exemplo conceitual:

```json
{
  "message": "Horário indisponível."
}
```

Entre os possíveis erros tratados estão:

* dados inválidos;
* credenciais incorretas;
* token ausente;
* token inválido;
* recurso não encontrado;
* serviço inativo;
* data inválida;
* horário fora do funcionamento;
* conflito de agendamento;
* erro interno.

---

## Integração com o frontend

O frontend consome a API por meio de requisições HTTP.

Fluxo geral:

```text
Frontend React
      │
      │ HTTP / JSON
      ▼
API Express
      │
      ▼
Regras de negócio
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
```

As operações públicas não exigem autenticação.

As operações administrativas enviam o token JWT no cabeçalho `Authorization`.

Repositório do frontend:

```text
https://github.com/MaximillionDev1/nexa-agenda-frontend
```

---

## Melhorias futuras

Algumas evoluções possíveis para versões futuras:

* testes automatizados para os principais fluxos;
* documentação OpenAPI/Swagger;
* recuperação de senha;
* envio de confirmações por e-mail;
* envio de lembretes por WhatsApp;
* configuração administrativa dos horários de funcionamento;
* bloqueio de datas específicas e feriados;
* múltiplos profissionais;
* múltiplas unidades;
* diferentes níveis de permissão;
* logs estruturados;
* observabilidade e monitoramento;
* auditoria das alterações administrativas;
* filas para processamento de notificações.

---

## Repositórios

* **Backend:** https://github.com/MaximillionDev1/nexa-agenda-backend
* **Frontend:** https://github.com/MaximillionDev1/nexa-agenda-frontend

---

## Autor

Desenvolvido por **Matheus Vinicius Rodrigues da Silva**.

* LinkedIn: https://linkedin.com/in/matheus-vinicius-dev
* GitHub: https://github.com/MaximillionDev1
* E-mail: [matheusdevsilv4@gmail.com](mailto:matheusdevsilv4@gmail.com)

---

<p align="center">
  Desenvolvido com Node.js, TypeScript, Express, Prisma e PostgreSQL.
</p>

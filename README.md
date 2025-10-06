# 🧳 Ledger Modular API (NestJS + TypeScript)

A modular **double-entry accounting ledger** built with NestJS + Fastify. It exposes endpoints to create accounts, post balanced transactions, and read balances — all backed by simple in-memory storage and clean, testable domain logic.

---

## ✨ Highlights

* **Double-entry rules enforced**

  * Debits and credits must net to **zero** per transaction.
  * Account balance update respects **account vs entry direction**.
* **Clean Architecture-ish layering**

  * `entity` (pure domain) → `usecase` (application) → `repository` (infra).
* **In-memory storage** (no DB required).
* **Swagger/OpenAPI** at **`/api/docs`**.
* **Unit & E2E tests**

  * Unit: Jest + ts-jest.
  * E2E: real HTTP via Node’s `fetch` (no supertest).

### CI Pipeline

Improved CI pipeline in PR [#2](https://github.com/cronnosli/double-entry-accounting-ledger/pull/2)

---

## 🧱 Project Layout

```bash
.
├── apps
│   └── src
│       ├── app.module.ts
│       ├── main.ts
│       └── swagger.ts
├── core
│   └── database
│       └── storage.ts
├── modules
│   ├── accounts
│   │   ├── src
│   │   │   ├── account.entity.ts
│   │   │   ├── account.repository.in-memory.ts
│   │   │   ├── account.repository.ts
│   │   │   ├── accounts.controller.v1.ts
│   │   │   ├── accounts.module.ts
│   │   │   ├── accounts.tokens.ts
│   │   │   ├── accounts.usecase.ts
│   │   │   └── create-account.dto.ts
│   │   └── test
│   │       ├── account.entity.spec.ts
│   │       ├── account.repository.in-memory.spec.ts
│   │       ├── accounts.controller.v1.spec.ts
│   │       ├── accounts.mocks.ts
│   │       └── accounts.usecase.spec.ts
│   └── transactions
│       ├── src
│       │   ├── create-transaction.dto.ts
│       │   ├── transactions.controller.v1.ts
│       │   ├── transactions.entity.ts
│       │   ├── transactions.module.ts
│       │   ├── transactions.repository.in-memory.ts
│       │   ├── transactions.repository.ts
│       │   ├── transactions.tokens.ts
│       │   └── transactions.usecase.ts
│       └── test
│           ├── transactions.controller.v1.spec.ts
│           ├── transactions.entity.spec.ts
│           ├── transactions.mocks.ts
│           ├── transactions.repository.in-memory.spec.ts
│           └── transactions.usecase.spec.ts
├── shared
│   └── models.ts
├── test
│   └── integration
│       └── ledger.e2e-spec.ts
├── jest.config.ts
├── jest.e2e.config.ts
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── eslint.config.js
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🧠 Domain Rules (TL;DR)

* **Accounts**

  * `direction`: `"debit"` or `"credit"`.
  * Balance is **only** modified via transactions.
  * `apply(amount, entryDirection)` updates balance:

    * same direction → **add** amount
    * different direction → **subtract** amount

* **Transactions**

  * At least **two** entries.
  * Must be **balanced**: `Σ(debits) - Σ(credits) = 0`.
  * Applying a transaction updates each affected account’s balance.

---

## 🔌 API

Base URL: `http://localhost:5000/api`

### Create Account

`POST /accounts`

### Request Body (Create Account)

```json
{
  "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
  "name": "Cash",
  "direction": "debit",
  "balance": 0
}
```

### 201 Response (Create Account)

```json
{
  "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
  "name": "Cash",
  "direction": "debit",
  "balance": 0
}
```

### Get Account

`GET /accounts/:id`

### 200 Response

```json
{
  "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
  "name": "Cash",
  "direction": "debit",
  "balance": 0
}
```

## Create Transaction

`POST /transactions`

### Request Body

```json
{
  "id": "3256dc3c-7b18-4a21-95c6-146747cf2971",
  "name": "Withdraw",
  "entries": [
    { "id": "e1", "account_id": "a1", "direction": "debit",  "amount": 100 },
    { "id": "e2", "account_id": "a2", "direction": "credit", "amount": 100 }
  ]
}
```

### 201 Response

```json
{
  "id": "3256dc3c-7b18-4a21-95c6-146747cf2971",
  "name": "Withdraw",
  "entries": [
    { "id": "e1", "account_id": "a1", "direction": "debit",  "amount": 100 },
    { "id": "e2", "account_id": "a2", "direction": "credit", "amount": 100 }
  ]
}
```

### 400 Example

```json
{ "error": "Entries do not balance (debits must equal credits)" }
```

---

## 📘 Swagger / OpenAPI

* UI: **`http://localhost:5000/api/docs`**
* Shows both **Accounts** and **Transactions** endpoints.
* DTOs include validation and schema metadata.

> If you add new DTO fields, annotate them with `@ApiProperty()` and `class-validator` decorators to keep docs + runtime validation in sync.

---

## ▶️ Run Locally

### Requirements

* Node **>= 24**
* PNPM or NPM (examples use PNPM)

### Install

```bash
nvm install
nvm use
pnpm i
```

### Dev (TS, watch)

```bash
pnpm start:dev
# Fastify will listen on http://localhost:5000
```

### Build & Run (JS)

```bash
pnpm build
pnpm start
```

### Environment

* `PORT` (optional, default **5000**)

---

## 🐳 Docker

### Build

```bash
docker build -t ledger-api .
```

### Run

```bash
docker run -p 5000:5000 --env PORT=5000 ledger-api
# Swagger at http://localhost:5000/api/docs
```

### Compose

```bash
docker compose up --build
```

---

## ✅ Testing

### Unit tests

```bash
pnpm test
```

* Runs Jest with TypeScript (`ts-jest`), collects coverage.
* Focused on **entities**, **use cases**, **repositories**, and **controllers**.

### E2E tests (real HTTP, no supertest)

```bash
pnpm test:e2e
```

* Tests in `test/integration/ledger.e2e-spec.ts`.
* Spawns requests with Node’s `fetch` directly to `http://localhost:5000/api`.
* Make sure the app is **running** (e.g., `pnpm start:dev`) before executing E2E.

---

## 🥩 Architecture Notes

* **Entities**

  * `Account`: domain model + `apply()` balance rule.
  * `Transaction` / `Entry`: creation + validation (`fromRaw()` + `validate()`).
* **Use Cases**

  * `AccountsUseCase`: create/get, validates uniqueness and direction.
  * `TransactionsUseCase`: validates balancing, loads accounts, applies entries, persists.
* **Repositories**

  * Contract interfaces + in-memory implementations (`InMemory*Repository`) using `core/database/storage.ts`.
* **Controllers**

  * Thin HTTP adapters: validate DTOs, map payloads, delegate to use cases, and shape responses.

---

## 🩳 Tooling

* **Lint**: `pnpm lint` / `pnpm lint:fix` (ESLint + Prettier)
* **Format**: `pnpm format`
* **Build aliases**: `tsc-alias` rewrites TS path aliases in build output
* **Nest CLI**: present for DX; runtime uses Fastify + manual bootstrap

---

## 🔧 Troubleshooting

* **404 on endpoints**

  * Remember the global prefix: requests go to `/api/...` (e.g., `/api/accounts`).
* **Swagger shows empty schemas**

  * Ensure DTO fields have `@ApiProperty()` and validation decorators.
* **E2E failing with 404**

  * Start the server first (`pnpm start:dev`) and keep it running during tests.
* **Node version warning**

  * This project targets Node `>= 24`.

---

## 📄 Scripts (from `package.json`)

```json
{
  "start": "node -r tsconfig-paths/register dist/apps/src/main.js",
  "start:dev": "ts-node -r tsconfig-paths/register apps/src/main.ts",
  "start:debug": "node --watch --inspect=0.0.0.0:9229 -r ts-node/register -r tsconfig-paths/register apps/src/main.ts",
  "build": "tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json",
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix",
  "format": "prettier --write \"**/*.{ts,js,json,md}\"",
  "test": "jest --coverage",
  "test:e2e": "jest -c jest.e2e.config.ts",
  "test:watch": "jest --watch",
  "prepare": "husky install"
}
```

---

## 🗺️ Extending the System (What could be improved)

* Add a **query** endpoint for account statements (list of entries).
* Introduce **idempotency** for transaction creation.
* Swap in a persistent repository (e.g., Postgres) by implementing the repository interfaces.
* Add **time** and **memo** to entries/transactions (remember to update DTOs + Swagger).
* Implement **account history** entries request.
* Add **logging**, **metrics**, **tracing**, etc.
* Improve **error handling** and **validation**.
* Implement **caching** for frequently accessed data.
* Add **authentication** and **authorization**.

---

## 🏁 Summary

This project provides a **concise, modular, and testable** implementation of a double-entry ledger:

* simple, in-memory storage, clear, and practical.
* solid domain rules,
* clean separation of concerns,
* easy to run, extend, and reason about.

# 🧭 Guia Prático de Seleção de Modelos CylinderMargin
> Como escolher e configurar o molde perfeito para cada novo projeto no Coolify.

---

## 🎯 Tabela de Decisão Rápida

| O que você vai criar? | Qual Modelo Usar? | Porta Coolify | Healthcheck | Exemplo Real |
| :--- | :--- | :---: | :---: | :--- |
| **Portal de Eventos / Web App Reativo** | **Template T1 (Next.js)** | `3000` | Start 20s | IRIA Summit, 10 Sistemas, 7+1 |
| **API de Lógica / Motor de IA / Webhook** | **Template T2 (Node/Python)** | `4000` ou `5000` | `/health` | Motor de cálculo, API de pagamentos |
| **Banco de Dados Seguro do Setor** | **Template T3 (Postgres/Redis)** | *Interna* | `pg_isready` | Banco do evento, cache de sessões |
| **Processador de Tarefas / Fila Assíncrona** | **Template T4 (Worker)** | *Nenhuma* | Disabled | Fila de envio de e-mails, rotinas IA |
| **Landing Page / Livros / Vendas / Docs** | **Template T5 (Nginx Estático)**| `80` | `/` | mricardo.pro, páginas de livros |

---

## 🛠️ Passo a Passo no Coolify

### Cenário 1: Criar um Web App (Next.js)
1. **GitHub**: Crie o repo usando `01-webapp-nextjs`.
2. **Coolify**: `+ New Resource` -> Selecione o repo.
3. **Build Pack**: `Dockerfile`.
4. **Porta Exposta**: `3000`.
5. **Healthcheck**: Start Period: `20s`.
6. **Domínio**: `https://seu-dominio.tech`.

### Cenário 2: Criar uma API / Motor de IA
1. **GitHub**: Crie o repo usando `02-api-backend`.
2. **Coolify**: `+ New Resource` -> Selecione o repo.
3. **Build Pack**: `Dockerfile`.
4. **Porta Exposta**: `4000`.
5. **Healthcheck**: Rota `/health`.
6. **Domínio**: `https://api.seu-dominio.tech`.

### Cenário 3: Subir Banco de Dados e Cache
1. **Coolify**: `+ New Resource` -> `Docker Compose`.
2. **Código**: Cole o `docker-compose.yml` do `03-database-persistence`.
3. **Variáveis**: Defina senhas fortes na aba *Environment Variables*.
4. **Deploy**: O PostgreSQL e o Redis sobem com volumes blindados na VPS.

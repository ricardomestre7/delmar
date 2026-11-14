# 🏛️ Arquitetura dos Quatro Grandes Pilares Operacionais
### Ecossistema Tecnológico Soberano CylinderMargin & Coolify

Para organizar os projetos do ecossistema (IRIA Summit, ferramentas de IA, portais terapêuticos 5D, painéis de métricas e bases de dados), a infraestrutura divide-se em 4 pilares:

---

## 🌐 Categoria A: Core & Interfaces Web (Frontend)
- **Foco**: Aplicações públicas, portais de eventos (ex: IRIA Summit), interfaces de utilizador, áreas de membros e portais de atendimento.
- **Tecnologias**: Next.js 15 (SSR/SSG), React 18, Tailwind CSS, HTML5 / Nginx Alpine.
- **Templates Aplicáveis**:
  - `Template T1: Web App / Next.js Sólido` (Porta 3000)
  - `Template T5: Static HTML / Nginx` (Porta 80)
- **Regra de Proxy**: Traefik com SSL Let's Encrypt automático, forçar HTTPS e compressão Gzip.

---

## ⚡ Categoria B: Motores de Processamento & IA (Backend / APIs)
- **Foco**: Microsserviços de lógica clínica, motores de análise quântica, processamento de linguagem natural e integração com modelos de IA.
- **Tecnologias**: Node.js 20, Python (FastAPI/Flask), Fastify.
- **Templates Aplicáveis**:
  - `Template T2: API / Backend Node.js & IA` (Porta 4000 ou 5000)
  - `Template T4: Worker / Processamento em Segundo Plano` (Sem porta pública)
- **Regra de Saúde**: Endpoint `/health` respondendo HTTP 200 com JSON de diagnóstico em tempo real.

---

## 🗄️ Categoria C: Bancos de Dados & Persistência (Data Layer)
- **Foco**: Bases de dados segregadas (PostgreSQL, Redis, MongoDB) para garantir persistência isolada por setor.
- **Tecnologias**: PostgreSQL 16 Alpine, Redis 7 Alpine com AOF persistente.
- **Templates Aplicáveis**:
  - `Template T3: Banco de Dados Isolado (Docker Compose)`
- **Regra de Isolamento**: Volumes mapeados na VPS em diretórios protegidos (`postgres_data`, `redis_data`); rede interna fechada sem exposição desnecessária na internet pública.

---

## 📊 Categoria D: Monitorização & Telemetria (Observability)
- **Foco**: Painéis de controlo de saúde, métricas de desempenho, taxas de erro e logs centralizados de todos os contentores.
- **Tecnologias**: Telemetria embutida, endpoints de heartbeat, Coolify Activity Logs e Prometheus/Grafana (quando necessário).
- **Regra de Alerta**: Sinais de falha detectados automaticamente pelo Traefik e restart policies ativas (`always` ou `unless-stopped`).

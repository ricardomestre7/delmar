# 🏛️ Biblioteca Oficial de Modelos CylinderMargin para Coolify
> **Infraestrutura Soberana, Padronizada e Gratuita para Todo o Ecossistema.**

Esta biblioteca centraliza os cinco modelos mestres de implantação, perfeitamente alinhados com os **Quatro Grandes Pilares Operacionais** da CylinderMargin.

---

## 🗂️ Os Cinco Modelos de Implantação

| Modelo | Pilar | Finalidade | Porta | Healthcheck |
| :--- | :---: | :--- | :---: | :---: |
| [**T1: Web App Next.js**](../templates/01-webapp-nextjs) | **Cat. A** | Portais de Eventos, IRIA Summit, Sistemas 5D | `3000` | Start 20s |
| [**T2: API Backend Node/IA**](../templates/02-api-backend) | **Cat. B** | Microsserviços, Motores de IA, Lógica | `4000` | `/health` |
| [**T3: Banco de Dados Persistente**](../templates/03-database-persistence) | **Cat. C** | PostgreSQL 16 + Redis 7 com Volumes VPS | *Interna* | `pg_isready` |
| [**T4: Worker em Background**](../templates/04-worker-processor) | **Cat. B/D** | Filas, Processamento Assíncrono, Crons | *Nenhuma* | Disabled |
| [**T5: Static HTML / Nginx**](../templates/05-static-nginx) | **Cat. A** | Landing pages de livros, apresentações, vendas | `80` | `/` |

---

## 🧮 Motor de Métricas (6 domínios)
Módulo transversal em [`modules/metrics-engine`](../modules/metrics-engine): matemático, saúde, integrativo, território, cálculo geográfico e geodésico. Já ligado ao **T2** (`/metrics`) e ao **T4** (worker). Sincronizar com `./scripts/sync-metrics-engine.sh`.

---

## 📖 Documentação Integrada
- 📘 [**Arquitetura dos Quatro Grandes Pilares Operacionais**](./ARQUITETURA_4_PILARES.md)
- 🧭 [**Guia de Seleção & Checklist Operacional no Coolify**](./GUIA_SELECAO_MODELOS.md)
- ✅ [**Checklist de Subida ao Coolify (passo a passo, a seguir em todos os sistemas)**](./CHECKLIST_SUBIDA_COOLIFY.md)

---

## 🔒 Princípios de Segurança e Soberania
0. **Repositórios sempre privados**: esta biblioteca e todos os projetos criados a partir dela.
1. **Preservação de Produção**: Os templates funcionam como moldes isolados e não alteram nenhuma aplicação em produção (`mricardo`, `6sistemas`, etc.).
2. **Volumes Persistentes**: Garantia total de que dados de banco e caches nunca são perdidos em reinicializações do servidor.
3. **Zero Dependência Externa**: Todos os templates rodam no seu servidor próprio no Coolify sem custos de plataformas de terceiros.
4. **Sem BOM**: ficheiros de configuração (`nginx.conf`, `.sql`, `.env.example`) em UTF-8 sem BOM; o Nginx não arranca com BOM.
5. **Cache**: `js`/`css`/`json`/`html` revalidam sempre; só binários têm cache de 30 dias.

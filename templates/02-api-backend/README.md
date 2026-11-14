# ⚙️ Template T2: API / Backend Node.js & Motores de IA
> **Categoria B: Motores de Processamento & IA**  
> Microsserviços de lógica, motores de análise e integração com modelos inteligentes.

---

## ⚙️ Especificações de Deploy no Coolify

| Parâmetro | Valor Configurado |
| :--- | :--- |
| **Build Pack** | `Dockerfile` |
| **Porta Exposta** | `4000` |
| **Healthcheck Rota** | `/health` (espera status HTTP 200) |
| **Start Period** | `5s` |
| **Intervalo** | `15s` |

---

## 🚀 Como Utilizar no Coolify

1. **Criar Recurso**: `+ New Resource` -> Selecione o repositório da sua API.
2. **Porta**: Mude para **`4000`** em *Configuration -> General*.
3. **Healthcheck**: A rota `/health` já responde automaticamente em JSON com status 200.
4. **Variáveis de Ambiente**: Preencha as conexões da base de dados (PostgreSQL/Redis) na aba **Environment Variables**.

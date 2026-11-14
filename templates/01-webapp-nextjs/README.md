# 🌟 Template T1: Web App / Next.js Sólido
> **Categoria A: Core & Interfaces Web**  
> Aplicações públicas, portais de eventos (ex: IRIA Summit), interfaces de utilizador e portais soberanos.

---

## ⚙️ Especificações de Deploy no Coolify

| Parâmetro | Valor Configurado |
| :--- | :--- |
| **Build Pack** | `Dockerfile` |
| **Porta Exposta** | `3000` |
| **Healthcheck Rota** | `/` |
| **Start Period** | `20s` (evita falsos negativos no arranque) |
| **Proxy / Traefik** | Automático com SSL Let's Encrypt |
| **Node Version** | `20 Alpine` (imagem leve e segura) |

---

## 🚀 Como Utilizar

1. **No GitHub**: Crie o repositório do seu projeto a partir deste modelo.
2. **No Coolify**:
   - Clique em **`+ New Resource`** -> Selecione o repositório.
   - Confirme a Porta: **`3000`**.
   - Em Healthcheck, coloque **Start Period: 20s** (ou Disabled se preferir arranque imediato sem restrição).
   - Insira o domínio com `https://` (ex: `https://meu-evento.tech`).
   - Clique em **Deploy**!

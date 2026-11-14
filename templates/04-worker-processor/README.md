# ⚙️ Template T4: Worker / Processamento em Segundo Plano
> **Categoria B & D: Tarefas Contínuas, Filas & Sincronização**  
> Consumo de filas Redis, processamento de tarefas em background, crons e automações.

---

## ⚙️ Especificações de Deploy no Coolify

| Parâmetro | Valor Configurado |
| :--- | :--- |
| **Build Pack** | `Dockerfile` |
| **Porta Exposta** | *Nenhuma* (Não expõe tráfego HTTP para a web) |
| **Healthcheck** | *Disabled* (Processo em execução contínua) |
| **Restart Policy** | `always` ou `on-failure` |

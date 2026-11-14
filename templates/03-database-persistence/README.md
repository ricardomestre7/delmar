# 🗄️ Template T3: Bancos de Dados & Persistência Isolada
> **Categoria C: Bancos de Dados & Persistência (Data Layer)**  
> PostgreSQL 16 + Redis 7 com volumes mapeados na VPS, senhas encriptadas e rede interna isolada.

---

## 🔒 Segurança & Isolamento

1. **Volumes Mapeados na VPS**: Garante que reinicializações do servidor ou atualizações do Coolify nunca apagam os dados persistidos.
2. **Rede Interna Segura (`cylinder_internal`)**: Nenhuma das portas de banco de dados (5432 / 6379) fica exposta publicamente para a internet, apenas acessíveis pelas APIs e Web Apps que partilham a rede interna.

---

## 🚀 Como Utilizar no Coolify

1. **No Coolify**: Vá a **`+ New Resource`** -> **`Docker Compose`**.
2. Cole o conteúdo de `docker-compose.yml`.
3. Na aba **Environment Variables**, insira senhas fortes baseadas no `.env.example`.
4. Clique em **Deploy**. A base de dados e o Redis sobem com persistência garantida!

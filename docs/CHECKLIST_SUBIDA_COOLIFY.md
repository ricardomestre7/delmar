# ✅ Checklist de Subida ao Coolify (padrão CylinderMargin)
> Seguir **sempre**, pela ordem, em cada sistema. Um sistema só passa ao seguinte quando o passo 9 estiver todo assinalado.

---

## 1. Escolher o modelo
| O sistema é… | Modelo |
| :--- | :--- |
| Site estático, landing page, ferramenta que corre no navegador (**sem base de dados**; "baixar → instalar → usar → integrar com o Drive pessoal") | **T5** (porta 80) |
| Aplicação Next.js / portal | **T1** (porta 3000) |
| API ou motor de IA | **T2** (porta 4000) |
| Base de dados (só se for mesmo necessária) | **T3** (Docker Compose, rede interna) |
| Processamento em segundo plano | **T4** (sem porta) |

## 2. Repositório (sempre privado)
1. No GitHub: **Use this template** → **Create a new repository**.
2. Em **Visibility**, escolher **Private**. Nunca público.
3. Nome em minúsculas, sem espaços (ex.: `atlas-inteligente-corpo-humano`).

## 3. Preparar o código
1. Copiar para o repositório os ficheiros do modelo escolhido (`Dockerfile`, `.dockerignore`, `nginx.conf` ou `next.config.js`).
2. **Sem BOM** nos ficheiros de configuração. Verificar (não deve escrever nada):
   ```bash
   grep -rlI $'^\xEF\xBB\xBF' --include=nginx.conf --include=Dockerfile --include=*.sql --include=.env.example --include=*.yml .
   ```
   Para remover o BOM de um ficheiro:
   ```bash
   sed -i '1s/^\xEF\xBB\xBF//' NOME_DO_FICHEIRO
   ```
3. Ficheiros internos (`README.md`, `nginx.conf`, scripts, testes) **não podem ficar públicos**: no T5, o site vai para `public/`; se o site estiver na raiz, usar `.dockerignore` e o `RUN rm` do `Dockerfile`.
4. Segredos **nunca** no repositório. `.env.example` só com os nomes das variáveis; os valores vão para **Environment Variables** no Coolify.

## 4. Testar localmente (se tiver Docker)
```bash
docker build -t sistema:teste .
docker run --rm -p 8080:80 sistema:teste      # T1: -p 8080:3000 | T2: -p 8080:4000
```
Noutro terminal:
```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/            # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/nginx.conf  # 404 (T5)
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/README.md   # 404 (T5)
```

## 5. Criar o recurso no Coolify
1. Projeto → **`+ New Resource`** → **`Private Repository (with GitHub App)`**.
2. Selecionar o repositório, branch `main`.
3. **Build Pack**: `Dockerfile`.
4. **Porta exposta**: a do modelo (T5 = `80`, T1 = `3000`, T2 = `4000`).
5. **Domínio**: `https://dominio-do-sistema`.
6. **Healthcheck**: conforme a tabela do modelo (T1: start-period 20s; T2: `/health`; T5: `/`).
7. **Environment Variables**: preencher aqui, nunca no código.

## 6. Publicar
1. Clicar em **Deploy** e acompanhar o log até terminar sem erros.
2. Atualizações seguintes:
   ```bash
   git add .
   git commit -m "fix: descrição curta"
   git push origin main
   ```

## 7. Verificar o sistema no ar
```bash
curl -sI https://DOMINIO/ | head -1                                         # HTTP/2 200
curl -s -o /dev/null -w '%{http_code}\n' https://DOMINIO/nginx.conf         # 404 (T5)
curl -s -o /dev/null -w '%{http_code}\n' https://DOMINIO/README.md          # 404 (T5)
curl -sI https://DOMINIO/ | grep -iE 'x-frame-options|x-content-type'      # ambos presentes
```
Se o sistema tiver `sw.js` (PWA): `curl -sI https://DOMINIO/sw.js | grep -i cache-control` deve mostrar `no-cache`.

## 8. Regras de conteúdo (todos os sites e plataformas)
1. **Rodapé e Termos**, quando o site vende ou cobra: declarar que a tecnologia financeira é exclusivamente da Stripe, que a CylinderMargin não presta serviços financeiros e não interfere na relação entre a Stripe e os utilizadores da plataforma.
2. **Marca**: usar CylinderMargin como marca institucional.
3. **Crédito de autor**: "Ricardo Pereira".
4. **Páginas de eventos**: nada de política ou partidos; só harmonização; sem nomes de oradores antes do convite e da aprovação.
5. **Landing de vendas**: só conteúdo de venda, sem botões ou links que desviem a atenção; leve e funcional no telemóvel.

## 9. Fecho (assinalar tudo)
- [ ] Repositório **privado**
- [ ] Sem BOM nos ficheiros de configuração
- [ ] Deploy concluído sem erros no log do Coolify
- [ ] Passo 7 verificado (200, 404 nos ficheiros internos, cabeçalhos)
- [ ] Variáveis de ambiente só no Coolify
- [ ] Rodapé/Termos conforme o passo 8
- [ ] Registado no projeto do Coolify com o nome do sistema

## 10. Se algo correr mal
1. Coolify → o recurso → **Deployments** → escolher o último deploy que funcionou → **Redeploy**.
2. Ou no repositório: `git revert HEAD && git push origin main`.

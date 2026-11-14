# Casa Delmar · Furadouro

Site e gestão de catálogo próprios para o Casa Delmar. Referência funcional: estrutura pública Amanhecer, com implementação independente e fotografias fornecidas pelo promotor.

## Incluído

- Site responsivo, história, contactos, categorias e ligação ao Facebook.
- Catálogo pesquisável, filtros, fotografias por envio ou URL, preços opcionais e promoções com datas no fuso de Lisboa.
- Lista de compras no dispositivo, com copiar, marcar e remover artigos.
- Área `/admin`: autenticação, criação/edição de produtos, publicação, arquivo e recuperação, gestão de história/horário/folheto.
- Receção opcional de listas: gravação persistente e acompanhamento de estado no painel. Sem pagamento nem reserva automática; ativação bloqueada enquanto demonstração ou informação de privacidade vazia.
- SQLite persistente, registo de alterações e exportação JSON autenticada.

## Instalar na VPS / Coolify

1. Após integrar a PR em `main`, criar aplicação GitHub com Dockerfile, porta 3000.
2. Configurar `PUBLIC_ORIGIN` com a origem HTTPS exata, sem barra final. Ex.: `https://delmar.seudominio.pt`.
3. Definir `ADMIN_USER` e `ADMIN_PASSWORD` única (mínimo 16 caracteres) nas variáveis do Coolify; nunca no GitHub. Sem palavra-passe, a gestão fica indisponível.
4. Criar volume persistente em `/app/data`, gravável pelo utilizador 1000. A base de dados não abre nenhuma porta.
5. Publicar com HTTPS. Entrar em `/admin` e validar dados comerciais. As fotografias históricas fornecidas já estão incluídas.
6. Antes de ativar pedidos: confirmar a operação com a loja, preencher informação de privacidade e remover produtos de demonstração. Não foram inventados preços ou datas de fundação.

Não há dependências npm externas nem serviços pagos obrigatórios. Requer Node.js >=24.15, com `node:sqlite`.

## Desenvolvimento e verificação

```
ADMIN_USER=gestor ADMIN_PASSWORD='<palavra-passe-de-teste-com-16-caracteres>' npm run dev
npm run check
npm test
```

Variáveis `.env` não são carregadas automaticamente; o alojamento deve injetá-las. Para execução local, use exportação no terminal ou `node --env-file=.env server.mjs`.

## Operação e limites

- Site estático isolado pode ser pré-visualizado, mas a gestão requer o servidor Node.js desta aplicação. Não publicar apenas `dist` para uso operacional.
- Sem acesso ao sistema interno Amanhecer, API de stock, faturação, POS fiscal ou sincronização automática. O catálogo é mantido pelo gestor.
- Não foram enviados pedidos reais, mensagens ou pagamentos à loja.
- Os quatro artigos iniciais são exemplos sem preço. O banner de demonstração fica ativo até validação.
- As fotografias por envio ou URL são servidas pelo respetivo domínio; recomenda-se colocar os ficheiros autorizados em `dist/assets` para autonomia. O painel aceita envio de PNG/JPEG/WebP até 4 MB, guardados no volume persistente. Inclua a pasta media nas cópias de segurança.
- Um administrador configurado por ambiente; sessões de 8 horas, revogadas sempre que a aplicação reinicia (incluindo mudança de credenciais).
- Limite de 100 artigos por lista, pedidos de 64 KB e controlo de tentativas por IP da ligação. Atrás de proxy, o limite pode ser partilhado; o servidor não confia em `X-Forwarded-For`.
- Pedidos removidos automaticamente após 90 dias; exportações contêm dados pessoais. O painel lista os 500 pedidos mais recentes.
- A informação de privacidade, identificação fiscal e condições comerciais finais devem ser fornecidas/validadas pelo proprietário antes da abertura pública.

## Cópias de segurança

A exportação do painel inclui produtos/configurações/pedidos, não credenciais. Para restauro integral, parar a aplicação e copiar todo o volume `/app/data` (SQLite, WAL e SHM), ou usar uma cópia SQLite consistente. Restaurar o volume com a aplicação parada, permissões do utilizador 1000, e reiniciar. Não copiar apenas o `.sqlite` enquanto está em escrita. Configurar cópias periódicas no servidor; não há agendamento de backups incluído.

Para revogar todas as sessões, com a aplicação parada: `node --input-type=module -e "import {DatabaseSync} from 'node:sqlite';const db=new DatabaseSync(process.env.DATA_DIR+'/delmar.sqlite');db.exec('DELETE FROM sessions');db.close()"`.

Veja [análise da referência](docs/engenharia-reversa.md).

## Infraestrutura CylinderMargin preservada

Os diretórios `templates/`, `modules/` e `scripts/` existentes no repositório são preservados sem alteração. A documentação inicial encontra-se também em [infraestrutura original](docs/infraestrutura-original.md). O sistema Delmar utiliza o Dockerfile da raiz, sem ativar motores ou serviços alheios ao comércio da loja.

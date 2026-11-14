# Análise funcional da referência Amanhecer

Data: 14/11/2026. Alvo autorizado pelo promotor: `https://www.amanhecer.pt/` e página pública `/marca-propria`. Destino: `ricardomestre7/delmar`.

## Evidência observada

Foi inspecionado o DOM renderizado das duas páginas num navegador, incluindo navegação para «Os nossos Produtos». Observação direta, sem sessão privada, tráfego autenticado, submissão de formulários ou acesso a sistemas internos.

| Elemento observado | Adaptação independente no Delmar |
| --- | --- |
| Navegação para produtos, lojas, história e folhetos | História, mercado, catálogo, novidades e contactos de uma única loja |
| Campanhas em destaque no topo | Fotografia histórica e identidade local, sem copiar campanhas da rede |
| Destaque do folheto semanal | Ligação configurável pelo gestor ao folheto autorizado |
| Secções com produtos e categorias | Catálogo próprio, pesquisa e filtros; dados mantidos no painel |
| Conteúdos editoriais e relação com a vizinhança | História da Casa Delmar e ligação ao Furadouro |
| Localizador de várias lojas | Morada, telefone e ligação ao mapa da loja local |
| Fotografias e depoimentos de outros retalhistas | Fotografias fornecidas pelo promotor; sem depoimentos inventados |
| Rodapé com contactos e redes | Contactos Delmar, página Facebook fornecida e acesso à gestão |

A página de marca própria observada também apresenta conteúdos sazonais e receitas. Não foi demonstrado um carrinho, checkout, POS, gestão de stock ou área de administração nas páginas inspecionadas. A ausência nesses dois percursos não prova que a rede não disponha dessas funções noutro sistema.

## O que é decisão de projeto

O painel administrativo, a persistência SQLite, a lista de compras e a receção opcional de pedidos são implementação própria para a escala do Delmar. Não são funcionalidades internas da Amanhecer recuperadas por engenharia reversa.

## Ferramenta REA do promotor

Foi lido o motor `bin/rea-cylinder.mjs` no repositório `ricardomestre7/REA-Reverse-Engineering-`. O comando `clone-site` desse motor captura HTML público, extrai ligações/scripts e descarrega alguns recursos da mesma origem; não reconstrói o backend de um serviço remoto. A captura HTTP direta do ambiente não concluiu dentro do limite; por isso a análise funcional usou o DOM renderizado no navegador. Não se afirma que o comando tenha clonado o sistema Amanhecer.

A arquitetura final está preparada para publicação própria no Coolify com Node.js e volume persistente, sem copiar código, logótipos ou fotografias da rede para o novo produto.

## Conteúdo e identidade

- Fotografia histórica e montagem de fotografias recebidas do promotor.
- A frase «A Casa Delmar vende de tudo» está visível na fachada histórica.
- Não foram atribuídos ano de fundação, fundadores ou parentescos sem confirmação.
- A ligação Facebook foi fornecida pelo promotor; publicações não foram integralmente lidas.
- Morada e telefone obtidos de fichas públicas; confirmar com a loja antes da ativação comercial.
- Catálogo inicial ilustrativo e sem preços. Não há stock em tempo real.
- O apoio Amanhecer não constitui autorização para usar todos os seus materiais; a identificação da parceria deve ser validada pela loja.

## Validação

Testes de integração reais contra servidor Node/SQLite: catálogo, bloqueio de gestão, recusa de origem cruzada, login, cookie HttpOnly/SameSite, criar e editar produto, validade de promoção, URL insegura recusada, arquivo/restauro, rascunho privado, ativação condicionada de pedidos, estado do pedido, exportação sem credenciais, persistência após reinício, revogação de sessão e proteção de ficheiros privados.

A publicação no servidor do promotor depende da integração da PR, ligação no Coolify, domínio HTTPS, credenciais administrativas e volume persistente. Não é alegada uma instalação pública concluída.

Verificação visual no navegador: pesquisa por «pão», inclusão na lista, persistência ao recarregar, imagens sem falhas e ausência de transbordamento horizontal no viewport observado (1363 px). Não foi realizado ensaio visual num dispositivo móvel físico. Docker não estava disponível localmente; o workflow valida a construção da imagem.

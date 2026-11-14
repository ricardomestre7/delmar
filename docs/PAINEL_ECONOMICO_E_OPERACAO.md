# Painel privado, catálogo e operação comercial

## Acessos separados
Cada aplicação tem a sua senha e o seu volume; não reutilizar senhas nem montar a mesma pasta de dados nas duas aplicações. Configurar ADMIN_PASSWORD exclusiva no Coolify, com pelo menos 16 caracteres, e PUBLIC_ORIGIN com a origem HTTPS exata. A senha não vai para o GitHub. No Delmar, o PIN padrão 3206 deixa de funcionar; a gestão e a listagem de encomendas agora exigem sessão. As sessões do Delmar são assinadas, duram oito horas e são invalidadas ao trocar a senha. Os cookies são HttpOnly, SameSite Strict e Secure em produção. Na farmácia mantém-se a sessão autenticada já existente. O PIN legado ADMIN_PANEL_PIN só é aceite no Delmar se tiver pelo menos 16 caracteres.

Entradas: Delmar /painel; farmácia /gestao. Os resultados económicos aparecem apenas depois do login. As rotas de dados financeiros recusam pedidos sem sessão. Não se alterou o Amadeu.

## Indicadores económicos
Faturação sem IVA, número de vendas, custo da mercadoria vendida, despesas operacionais, recebimentos e pagamentos são lançados por dia pela equipa. Uma data substitui o seu fecho anterior; não duplica a faturação. Todos os campos monetários devem usar a mesma base contabilística.

Ticket médio = faturação / número de vendas. Margem bruta = (faturação − custo da mercadoria vendida) / faturação. Resultado operacional simplificado = faturação − custo da mercadoria − despesas operacionais; não inclui impostos sobre o resultado nem equivale ao lucro líquido certificado. Fluxo de caixa = recebimentos − pagamentos; não é saldo bancário. Divisões sem base mostram ausência de cálculo. Dias em falta não são convertidos em zero. A variação de faturação só compara períodos de igual duração com todos os dias preenchidos.

Gráficos de faturação/custos e tabela acessível por dia. Filtros: dia, sete dias ou trinta dias até à data selecionada. Registos em economic-days.json dentro de DATA_DIR; escrita atómica e sequencial. São dados declarados pela equipa, não auditoria contabilística nem valuation. RENASCENTIA organiza a leitura em compreender, depurar e aplicar; não se inventou uma pontuação científica ou certificação financeira.

Pedidos do site têm métricas operacionais separadas e não são somados à faturação. O número de concluídos é calculado entre os pedidos criados no período selecionado, não entre conclusões ocorridas nesse período. No Delmar, o valor das encomendas é apenas um valor de pedidos. A ligação ao programa de vendas ainda não foi criada.

## Produtos
Delmar: modelo CSV em /api/catalog/import, com sku;nome;categoria;preco;unidade;promocao;marca_propria;descricao;stock. Código único atualiza o produto existente. Valores de stock podem ser sim/não ou quantidade numérica (>0 disponível). Preserva os produtos não presentes no ficheiro. Linhas inválidas são contabilizadas em skipped; conferir o resumo da importação. Parser trata UTF-8 BOM, aspas, separadores em descrições e mudanças de linha entre aspas. Catálogo gravado atomicamente; não sinaliza sucesso se a gravação falhar.

Farmácia: modelo CSV autenticado em /api/modelo-csv. Colunas sku;nome;categoria;preco;unidade;stock;descricao. Stock é quantidade inteira não negativa ou vazio. Preço vazio significa consulta. Importação até 20.000 linhas e 5 MB, validada antes da transação; o ficheiro inteiro é rejeitado se tiver linhas inválidas ou códigos duplicados. SKU/código único faz upsert sem duplicação. SQLite com pesquisa FTS5 (inclui acentos), índice por código, categorias e paginação de 24 resultados. Testado com 5.000 produtos fictícios; não foram carregados produtos inventados na produção. Preços e dispensa dependem da validação da farmácia.

## Integrações previstas
API de vendas e MB WAY estão identificados como por ativar. Não há prestador de pagamentos contratado, pagamentos processados, taxas determinadas nem credenciais bancárias configuradas. Ativação deve ser feita por negócio com o prestador e os dados comerciais correspondentes. A futura sincronização deve identificar fonte e referência externa e substituir/conciliar os fechos, nunca somá-los cegamente aos lançamentos manuais.

## Segurança: implementado versus infraestrutura
Implementado na aplicação: sessão privada, isolamento lógico por aplicação, senhas no ambiente, dados financeiros fora da área pública, cookies protegidos e validação de entradas. Configuração necessária na VPS: HTTPS válido no Coolify, volumes persistentes exclusivos graváveis pelo UID 1000, permissões e controlo do servidor.

Não foi verificada a encriptação dos discos da VPS nem das cópias de segurança. HTTPS não comprova encriptação em repouso. Não anunciar «todos os dados encriptados» enquanto disco, cópias e gestão de chaves não forem comprovados. As aplicações não implementam encriptação integral dos ficheiros nem uma política de backups. Cópias consistentes, retenção, teste de restauro e monitorização devem ser configurados e verificados antes do serviço regular. Na farmácia incluir a base SQLite e WAL; no Delmar incluir catálogo, pedidos e fechos. Não expor bases de dados à Internet.

## Proposta comercial definida pelo promotor
450 € de implementação + 50 €/mês de manutenção. Proposta de lançamento, sujeita à delimitação da entrega e condições comerciais: instalação, personalização, painel e formação inicial. A manutenção contempla alojamento, atualizações, apoio e pequenas alterações dentro de um limite acordado; backups só devem ser declarados ativos depois de configurados e testados. Módulos novos, ligação a POS/API, MB WAY e custos do prestador de pagamentos são orçamentados/contratados separadamente. Não é garantia de resultados económicos nem promessa de segurança absoluta. Tributação e condições finais constam da proposta contratada.

## Validação
Compilação e tipos nas duas aplicações; testes HTTP locais de bloqueio público, login, cookie protegido, fecho diário sem duplicação e data inválida; importação e atualização CSV sem duplicação. Na farmácia, 5.000 referências com paginação e pesquisa, atualização de preço e rejeição transacional de um ficheiro inválido. Verificação de publicação, dispositivos e infraestrutura pendente de deploy.

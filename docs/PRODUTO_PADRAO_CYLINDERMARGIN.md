# Produto padrão CylinderMargin — proposta de estrutura

Nome comercial por definir. Núcleo reutilizável, instalado por negócio em recursos e volumes separados; identidade e conteúdos próprios por estabelecimento. Os sistemas atuais Delmar e Farmácia Furadouro são os primeiros casos de aplicação.

## Núcleo já concretizado nesta edição
- Área privada com senha própria por aplicação.
- Pedidos online e estados operacionais separados dos fechos financeiros.
- Catálogo com importação por código único; pesquisa e paginação para a farmácia.
- Indicadores financeiros declarados pela equipa, gráficos e comparação de períodos com cobertura de dados explícita.
- Leitura RENASCENTIA: compreender, depurar e aplicar, sem scores arbitrários nem promessa de resultados.
- Instalação preparada para Coolify, volumes privados e configuração por ambiente.

Os componentes BusinessDashboard, o estilo correspondente e o módulo economy têm implementação comum nas duas aplicações. A camada de pedidos/autenticação mantém adaptadores próprios para cada sistema, preservando os modelos de dados existentes.

## Módulos por setor
Comércio: catálogo, encomendas, levantamento e entregas. Farmácia: consulta de preços, pedidos sujeitos a validação farmacêutica e marcações; não representa venda automática de medicamentos. Restauração/alojamento/surf: aproveitar os motores específicos já existentes no Amadeu sem lhes aplicar alterações nesta edição.

## Capacidades planeadas, ainda não ligadas
MB WAY e outros meios de pagamento através de prestador habilitado e contrato/credenciais de cada comerciante; taxas externas separadas. API do programa de vendas com identificadores de origem e conciliação para não duplicar faturação. Motor Python para tratamento de ficheiros grandes, deteção de anomalias e análises explicáveis. Avatares com voz para comunicação, com imagem fornecida/validada pelo titular. Alertas de stock, metas e relatórios automáticos dependem de dados e regras validados.

Nenhuma destas capacidades deve ser anunciada no site como ativa antes de implementada e testada. O painel não substitui o programa de faturação certificado nem o contabilista. O assistente de uma farmácia não deve fazer diagnóstico nem prescrever medicamentos.

## Oferta inicial proposta
450 € de implementação + 50 €/mês de manutenção, com escopo escrito, limite de apoio/alterações e condições de infraestrutura. Integrações específicas e módulos avançados têm orçamento separado. A versão padrão deve ter critérios de aceitação: funções incluídas, volume de dados esperado, importação validada, testes de acesso, recuperação de dados e verificação após o deploy.

## Critérios de segurança para a apresentação comercial
Comunicar apenas o que estiver comprovado: VPS, separação por negócio, HTTPS válido e senhas próprias. A encriptação de disco, backups, retenção, teste de restauro e monitorização são requisitos de produção a verificar. Não declarar «VPS totalmente criptografadas» sem essa comprovação. As senhas e chaves não são guardadas no repositório. Backup só é anunciado como operacional depois do primeiro teste de recuperação.

## Página de oferta
Pode apresentar o problema, demonstração visual, funções reais, preço inicial, manutenção, módulos opcionais e contacto comercial. A publicação no site CylinderMargin requer identificar o repositório/site correto; esta edição não alterou esse site.

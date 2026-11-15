'use client';

type GuideMode = 'contabil' | 'crm';

export default function SystemGuide({ mode }: { mode: GuideMode }) {
  const isCrm = mode === 'crm';

  return (
    <details
      style={{
        marginTop: 14,
        background: '#f7faf8',
        border: '1px solid #d5e2dc',
        borderRadius: 12,
        padding: '10px 14px',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 13,
          color: '#17322a',
          listStylePosition: 'inside',
        }}
      >
        {isCrm
          ? 'Guia operacional do CRM Mercado · Instruções e diferenças para a Contabilidade'
          : 'Guia do Sistema Contabilístico · Papel, instruções e diferenças para o CRM'}
      </summary>

      <div style={{ marginTop: 12, fontSize: 13, color: '#244239', display: 'grid', gap: 12 }}>
        {isCrm ? (
          <div style={{ display: 'grid', gap: 6 }}>
            <p style={{ margin: 0 }}>
              <strong>O papel do CRM:</strong> Funciona como a memória comercial da empresa.
              Ajuda a equipa a saber quem contactar, quando fazer seguimento de uma proposta ou
              pedido e quais são as preferências de cada cliente.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Como utilizar no dia a dia:</strong> registe novos clientes ou contactos no
              formulário diário, acompanhe o estado comercial (<em>Ativo</em>, <em>VIP</em>,{' '}
              <em>Follow-up</em>, <em>Inativo</em>), registe notas de atendimento em{' '}
              <em>Histórico</em> e use o botão <em>WhatsApp</em> para contacto direto.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 6 }}>
            <p style={{ margin: 0 }}>
              <strong>O papel do Sistema Contabilístico:</strong> Funciona como o registo oficial
              do dinheiro que entra e sai. Garante o controlo de receitas, custos e despesas e
              apoia o cumprimento legal (como faturas e comunicação SAF-T em Portugal), calculando
              resultados e impostos a pagar.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Como utilizar no dia a dia:</strong> consulte os índices europeus e os
              gráficos de crescimento/estrutura contabilística no período escolhido e lance o fecho
              diário da loja no formulário de registo no fundo desta secção.
            </p>
          </div>
        )}

        <p style={{ margin: 0 }}>
          <strong>Integração entre ambos:</strong> Embora sejam ferramentas distintas, muitas
          empresas ligam os dois sistemas. Quando uma venda é marcada como ganha no CRM, os dados
          passam automaticamente para a faturação ou contabilidade para emitir a fatura sem
          duplicar trabalho.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <strong style={{ display: 'block', marginBottom: 6 }}>Diferenças Principais</strong>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#e8f0ec', textAlign: 'left' }}>
                <th style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>Característica</th>
                <th style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  CRM (Customer Relationship Management)
                </th>
                <th style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Sistema Contabilístico
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc', fontWeight: 600 }}>
                  Objetivo Principal
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Atrair, converter e fidelizar clientes.
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Registar transações financeiras e cumprir obrigações fiscais.
                </td>
              </tr>
              <tr>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc', fontWeight: 600 }}>
                  Utilizadores Típicos
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Equipas comerciais, marketing e apoio ao cliente.
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Contabilistas, financeiros e gestores.
                </td>
              </tr>
              <tr>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc', fontWeight: 600 }}>
                  Dados Guardados
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Contactos, histórico de chamadas, e-mails, propostas e oportunidades de venda.
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Faturas, recibos, despesas, balancetes, impostos (IVA, IRC) e salários.
                </td>
              </tr>
              <tr>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc', fontWeight: 600 }}>
                  Momento de Atuação
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Antes, durante e após a venda (foco na relação).
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  No momento da faturação e no controlo financeiro posterior.
                </td>
              </tr>
              <tr>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc', fontWeight: 600 }}>
                  Exemplos Comuns
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Salesforce, HubSpot, Pipedrive, Zoho CRM.
                </td>
                <td style={{ padding: '7px 9px', border: '1px solid #d5e2dc' }}>
                  Primavera, PHC, Sage, Moloni, TOConline.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}


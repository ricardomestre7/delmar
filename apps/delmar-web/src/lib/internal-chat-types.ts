export type InternalChannel =
  | 'geral-loja'
  | 'encomendas-balcao'
  | 'padaria-frescos'
  | 'rede-amanhecer';

export const INTERNAL_CHANNELS: Array<{ id: InternalChannel; label: string; description: string }> = [
  { id: 'geral-loja', label: '#geral-loja', description: 'Caixa, turnos e avisos da equipa' },
  { id: 'encomendas-balcao', label: '#encomendas-balcao', description: 'Preparação de reservas de clientes' },
  { id: 'padaria-frescos', label: '#padaria-frescos', description: 'Fornadas, fruta, talho e reposição' },
  { id: 'rede-amanhecer', label: '#rede-amanhecer', description: 'Recheio, folhetos e fornecedores' },
];

export interface InternalMessage {
  id: string;
  channel: InternalChannel;
  senderName: string;
  senderRole: string;
  text: string;
  createdAt: string;
}


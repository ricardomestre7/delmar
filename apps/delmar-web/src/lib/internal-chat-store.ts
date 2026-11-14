import fs from 'node:fs/promises';
import path from 'node:path';
import {
  INTERNAL_CHANNELS,
  InternalChannel,
  InternalMessage,
} from './internal-chat-types';

export type { InternalChannel, InternalMessage };
export { INTERNAL_CHANNELS };

const CHAT_FILE = path.join(process.cwd(), 'data', 'internal-chat.json');

let memoryMessages: InternalMessage[] = [
  {
    id: 'welcome-1',
    channel: 'geral-loja',
    senderName: 'Sistema Casa Del Mar',
    senderRole: 'Loja 3206',
    text: 'Bem-vindos à Rede Interna do Supermercado Casa Del Mar. Este canal é privado e invisível ao público.',
    createdAt: new Date().toISOString(),
  },
];

async function readMessages(): Promise<InternalMessage[]> {
  try {
    const raw = await fs.readFile(CHAT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryMessages = parsed;
      return parsed;
    }
  } catch {
    // Fallback em memória
  }
  return memoryMessages;
}

async function writeMessages(messages: InternalMessage[]): Promise<void> {
  const trimmed = messages.slice(-300);
  memoryMessages = trimmed;
  try {
    await fs.mkdir(path.dirname(CHAT_FILE), { recursive: true });
    await fs.writeFile(CHAT_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch {
    // Mantém em memória se o volume for read-only
  }
}

export async function listInternalMessages(channel?: InternalChannel): Promise<InternalMessage[]> {
  const all = await readMessages();
  if (!channel) return all;
  return all.filter((m) => m.channel === channel);
}

export async function postInternalMessage(input: {
  channel: InternalChannel;
  senderName: string;
  senderRole: string;
  text: string;
}): Promise<InternalMessage> {
  const validChannel = INTERNAL_CHANNELS.some((c) => c.id === input.channel);
  if (!validChannel) {
    throw new Error('Canal interno inválido.');
  }
  const senderName = input.senderName.trim();
  const senderRole = input.senderRole.trim() || 'Equipa';
  const text = input.text.trim();

  if (!senderName) throw new Error('Indique o seu nome.');
  if (!text) throw new Error('Escreva uma mensagem.');

  const msg: InternalMessage = {
    id: `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    channel: input.channel,
    senderName,
    senderRole,
    text,
    createdAt: new Date().toISOString(),
  };

  const all = await readMessages();
  all.push(msg);
  await writeMessages(all);
  return msg;
}


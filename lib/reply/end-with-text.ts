import type { ParseMode } from '../telegram'
import { TelegramContext } from '../types/TelegramContext'

export type EndWithTextParams = {
  reply?: boolean
  parseMode?: ParseMode.Markdown | ParseMode.Markdown
}

export const endWithText = async (text: string, { res, update }: TelegramContext, params: EndWithTextParams = {}): Promise<void> => {
  if (res.headersSent) return

  const { reply = false, parseMode } = params

  if (!update.message?.chat?.id) {
    res.status(200).end()
    return
  }

  const { message: { message_id, chat: { id: chatId } } } = update

  const payload: any = {
    method: 'sendMessage',
    chat_id: chatId,
    reply_to_message_id: reply ? message_id : undefined,
    text: text,
    parse_mode: parseMode
  }

  res.status(200)
    .json(payload)
}

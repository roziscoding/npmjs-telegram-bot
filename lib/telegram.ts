import logdown from 'logdown'
import type { NowRequest, NowResponse } from '@now/node'
import { RequireSpecific } from './types/RequireSpecific'
import { TelegramContext } from './types/TelegramContext'
import type { Message, InlineQuery } from 'telegram-typings'

export type NowContext = {
  req: NowRequest,
  res: NowResponse
}

export const enum ParseMode {
  Markdown = 'MarkdownV2',
  HTML = 'HTML',
  MarkdownV1 = 'Markdown'
}

type Handlers = {
  message: (message: Message, context: TelegramContext) => any
  inlineQuery: (query: InlineQuery, context: TelegramContext) => any
  edit: (newMessage: Message, oldMessage: Message, context: TelegramContext) => any
  text: (message: RequireSpecific<Message, 'text'>, context: TelegramContext) => any
  commands: {
    [ key: string ]: (params: string[], context: TelegramContext) => any
  }
}

type HandleOptions = {
  unhandled: boolean,
  unhandledMessage: string
}

export const getUpdateHandler = (handlers: Partial<Handlers>, options?: Partial<HandleOptions>) => async (context: TelegramContext) => {
  const { update, res } = context

  const debug = (namespace: string, ...params: any[]) => logdown(`npm-telegram-bot:handlers:${namespace}`).debug(...params)
  debug('generic', 'Received new update %o', update)

  const config: HandleOptions = { unhandled: true, unhandledMessage: 'Hm... I did not get what you mean :/', ...(options ?? {}) }
  debug('config', 'Built config %o', config)

  if (update.message?.entities && update.message.entities && update.message.entities.length && update.message.text) {
    const { message: { text, entities } } = update

    entities.forEach(entity => {
      if (entity.type === 'bot_command' && entity.offset === 0) {
        const command = text.substr(entity.offset, entity.length).replace(/\//g, '')
        const params = text.substr(entity.offset + entity.length).trim().split(' ').filter(param => !!param)

        if (handlers.commands?.[ command ]) return handlers.commands[ command ](params, context)
        if (handlers.commands?.unhandled) return handlers.commands.unhandled([], context)
        res.status(200).end()
      }
    })
  }

  if (update.message && handlers.message) {
    debug('message', update)
    await handlers.message(update.message, context)
  }

  if (update.edited_message && update.message && handlers.edit) {
    debug('message', update)
    await handlers.edit(update.edited_message, update.message, context)
  }

  if (update.message?.text && handlers.text) {
    debug('text', update)

    await handlers.text(update.message as RequireSpecific<Message, 'text'>, context)
  }

  if (update.inline_query && handlers.inlineQuery) {
    debug('inline_query', update)

    await handlers.inlineQuery(update.inline_query, context)
  }

  if (!context.res.headersSent) context.res.end()
}

/** Context */
export * from './context/get-contex'
export * from './context/authenticate'
export * from './context/get-authenticated-context'

/** Reply */
export * from './reply/end-with-text'
export * from './reply/end-with-json'

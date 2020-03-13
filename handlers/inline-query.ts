import got from 'got'
import logdown from 'logdown'
// import { ParseMode } from '../lib/telegram'
import { InlineQuery, InlineQueryResultArticle, InlineKeyboardMarkup } from 'telegram-typings'
import { TelegramContext } from '../lib/types/TelegramContext'
import { endWithInlineQueryResults } from '../lib/reply/end-with-inline-query-results'
import { ParseMode } from '../lib/telegram'

const logger = logdown('npm-telegram-bot:inline-query')

type ApiResponse = {
  total: number
  results: {
    package: {
      name: string
      version: string
      description: string
      links: {
        npm: string
        homepage: string
        repository: string
        bugs: string
      },
      author: {
        name: string
        email: string
        url: string
        username: string
      }
    }
    searchScore: number
  }[],
}

function getKeyboard (result: ApiResponse['results'][0]) {
  const keyboard: InlineKeyboardMarkup[ 'inline_keyboard' ] = [
    [ { text: 'NPM', url: result.package.links.npm } ]
  ]

  if (result.package.links.repository) keyboard[ 0 ].push({ text: 'Repository', url: result.package.links.repository })
  if (!keyboard[0][1] && result.package.links.homepage) keyboard[0].push({ text: 'Homepage', url: result.package.links.homepage })

  return keyboard
}

export async function inlineQueryHandler (query: InlineQuery, context: TelegramContext) {
  logger.debug('Received query', query)

  if (!query.query) {
    logger.debug('Aborting due to empty query')
    return context.res.end()
  }

  const offset = query.offset ? parseInt(query.offset, 10) : 0

  logger.debug('Querying API')
  await got<ApiResponse>('https://api.npms.io/v2/search', { searchParams: new URLSearchParams({ q: query.query }), responseType: 'json' })
    .then(async response => {
      logger.debug('API response received')
      logger.debug(`Found ${response.body.total} results`)

      const results = response.body.results.slice(offset, offset + 10).map((result): InlineQueryResultArticle => {
        const keyboard = getKeyboard(result)

        const author = result.package.author?.url ? `[${result.package.author.name}](${result.package.author.url})` : result.package.author?.name

        return {
          type: 'article',
          id: result.package.name.substr(0, 32),
          title: `${result.package.name}@${result.package.version}`,
          url: result.package.links.npm,
          reply_markup: {
            inline_keyboard: keyboard
          },
          input_message_content: {
            message_text: `**${result.package.name}@${result.package.version}**, by ${author} - ${result.package.description}`,
            parse_mode: ParseMode.MarkdownV1
          }
        }
      })

      const nextOffset = results.length < 10 || results.length === 0
        ? ''
        : `${offset + 10}`

      logger.debug('Sending response', results)
      await endWithInlineQueryResults(results, context, { nextOffset, cacheTime: 0 })
    })
}

export default inlineQueryHandler

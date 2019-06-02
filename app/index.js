const maps = require('./lib/maps')
const pjson = require('prettyjson')
const TelegramBot = require('tgfancy')
const config = require('./app-config')
const crawler = require('./lib/crawler')
const { info, error } = require('./lib/utils/log')

const getWebHookUrl = ({ webhook: { hostname }, apiToken }) => `https://${hostname}/${apiToken}`

const answerInlineQuery = (bot, query, res) => {
  bot.answerInlineQuery(query.id, res.map(maps.resultToInlineResult))
    .catch(err => error(pjson.render(err)))
}

async function start () {
  const bot = new TelegramBot(config.telegram.apiToken, {
    webHook: {
      autoOpen: true,
      port: config.telegram.webhook.port,
      host: config.telegram.webhook.bindingHost
    }
  })

  await bot.setWebHook(getWebHookUrl(config.telegram))

  await bot.getMe().then(me => {
    const _info = []
    _info.push('----------------------------')
    _info.push('Bot Initialization completed')
    _info.push(`- Username: ${me.username}`)
    _info.push('----------------------------')
    info(_info.join('\n'))

    bot.onText(/(?:\/[^\s]+)? ?(.*)/, (msg, match) => {
      bot.sendMessage(
        msg.chat.id,
        'Ops... Currently, I only work on inline mode.',
        {
          reply_markup: {
            inline_keyboard: [
              [ { text: 'Go inline', switch_inline_query: match[ 1 ] } ]
            ]
          }
        }
      )
    })
  })

  bot.on('inline_query', query => {
    if (query.query) {
      return crawler
        .search(query.query)
        .then(res => {
          answerInlineQuery(bot, query, res)
        })
        .catch(err => {
          error(pjson.render(err))
        })
    }

    crawler
      .recommend()
      .then(res => {
        answerInlineQuery(bot, query, res)
      })
      .catch(err => {
        error(pjson.render(err))
      })
  })
}

module.exports = { start }

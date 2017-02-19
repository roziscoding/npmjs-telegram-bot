import TelegramBot from 'tgfancy';
import dotenv from 'dotenv-safe';
import {info, error} from './lib/utils/log';
import Crawler from './lib/crawler';
import pjson from 'prettyjson';

import * as maps from './lib/maps';

dotenv.load();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: true
});
const crawler = new Crawler();

bot.getMe().then(me => {
    const _info = [];
    _info.push('----------------------------');
    _info.push('Bot Initialization completed');
    _info.push(`- Username: ${me.username}`);
    _info.push('----------------------------');
    info(_info.join('\n'));
});

bot.onText(/(?:\/[^\s]+)? ?(.*)/, (msg, match) => {
    bot.sendMessage(
        msg.chat.id,
        'Ops... Currently, I only work on inline mode.',
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Go inline', switch_inline_query: match[1]}]
                ]
            }
        }
    );
});

const answerInlineQuery = (qry, res) => {
    bot
        .answerInlineQuery(qry.id, res.map(maps.resultToInlineResult))
        .catch(err => error(pjson.render(err)));
};

bot.on('inline_query', qry => {
    if (qry.id && qry.query) {
        crawler
            .search(qry.query)
            .then(res => {
                answerInlineQuery(qry, res);
            })
            .catch(err => {
                error(pjson.render(err));
            });
    } else if (qry.id) {
        crawler
            .recommend()
            .then(res => {
                answerInlineQuery(qry, res);
            })
            .catch(err => {
                error(pjson.render(err));
            });
    }
});

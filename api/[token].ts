import { NowRequest, NowResponse } from '@now/node'
import { InvalidTokenError } from '../lib/errors/InvalidTokenError'
import { getUpdateHandler, getAuthenticatedContext } from '../lib/telegram'
import inlineQueryHandler from '../handlers/inline-query'

export default async (req: NowRequest, res: NowResponse) => {
  const handleUpdate = getUpdateHandler({ inlineQuery: inlineQueryHandler })

  getAuthenticatedContext(process.env.TELEGRAM_API_TOKEN!, req, res)
    .then(handleUpdate)
    .catch(err => {
      console.error(err)
      if (err.response) console.error(err.response.body)
      if (err instanceof InvalidTokenError) return res.status(401).end()

      if (!res.headersSent) res.status(500).json({ status: 500, error: { message: err.message, code: 'internal_server_error', stack: err.stack, body: err.response?.body } })
    })
}

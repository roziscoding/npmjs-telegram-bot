import got from 'got'
import { ApiResponse } from '../types/ApiResponse'
import { UpdateHandlers, endWithText, ParseMode } from '../../lib/telegram'

function fetchSuggestions (packageName: string) {
  return got<ApiResponse[ 'results' ]>('https://api.npms.io/v2/search/suggestions', {
    searchParams: new URLSearchParams({ q: packageName }),
    responseType: 'json'
  })
}

export const suggestHandler: UpdateHandlers[ 'commands' ][ 'suggest' ] = async (params, context) => {
  const [ packageName ] = params

  if (!packageName) {
    return endWithText('Usage: /suggest packackage-name. EG.: /suggest teleraf', context)
  }

  const response = await fetchSuggestions(packageName)
  const { body: results } = response

  const queriedPackage = results.find(result => result.package.name === packageName)
  const headLine = queriedPackage
    ? `Here are the suggested packages for [${packageName}](${queriedPackage.package.links.npm}): \n`
    : `Here are the suggested packages for ${packageName}: \n`

  const uniqueResults = results.filter(result => result.package.name !== packageName)

  const text = uniqueResults.reduce((text, result) => {
    if (result.flags?.deprecated) return text

    const resultText = `[${result.package.name}@${result.package.version}](${result.package.links.npm}) - ${result.package.description}`

    return `${text}\n${resultText}`
  }, headLine)

  endWithText(text, context, {
    reply: true,
    parseMode: ParseMode.MarkdownV1,
    linkPreview: false
  })
}

export default suggestHandler

const got = require('got')
const cheerio = require('cheerio')

const NPM_BASE = 'https://www.npmjs.com'
const API_BASE = 'https://api.npms.io/v2'

async function search (terms) {
  const response = await got(`${API_BASE}/search`, {
    json: true,
    query: {
      q: terms
    }
  })

  if (response.body.message) throw response.body.message
  if (!response.body.total) throw new Error(`No results found for '${terms}'`)

  return response.body.results.slice(0, 10).map(result => ({
    name: result.package.name,
    description: result.package.description,
    version: result.package.version,
    link: result.package.links.npm
  }))
}

async function recommend () {
  const response = await got('https://www.npmjs.com/browse/star')
  const $ = cheerio.load(response.body)

  const packages = $('section').map((i, element) => {
    const relativeLink = $(element).find('.w-80 > .black-80 > div > a').attr('href')
    const absoluteLink = `${NPM_BASE}${relativeLink}`

    return {
      name: $(element).find('.w-80 > .black-80 > div > a').text(),
      description: $(element).find('.w-80 > .black-60').text(),
      version: $(element).find('.w-80 > .black-80 > span').text().split(' ')[1],
      link: absoluteLink
    }
  }).get()

  return packages.slice(1, 10)
}

module.exports = {
  search,
  recommend
}

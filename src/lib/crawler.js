import got from 'got';
import cheerio from 'cheerio';

const API_BASE = 'https://api.npms.io/v2';
const NPM_BASE = 'https://www.npmjs.com';
export default class Crawler {
    constructor() {}

    search(terms) {
        return new Promise((ok, notOk) => {
            got(`${API_BASE}/search`, {
                json: true,
                query: {
                    q: terms
                }
            })
                .then(res => {
                    if (!res.body.message) {
                        if (res.body.total > 0) {
                            ok(
                                res.body.results.slice(0, 10).map(r => {
                                    return {
                                        name: r.package.name,
                                        description: r.package.description,
                                        version: r.package.version,
                                        link: r.package.links.npm
                                    };
                                })
                            );
                        } else {
                            notOk(`No results found for '${terms}'`);
                        }
                    } else {
                        notOk(res.body.message);
                    }
                })
                .catch(notOk);
        });
    }

    recommend() {
        return new Promise((ok, notOk) => {
            got('https://www.npmjs.com/browse/star')
                .then(res => {
                    const $ = cheerio.load(res.body);
                    const _packages = $('.package-widget .package-details')
                        .map((i, el) => {
                            const relative_link = $(el)
                                .find('.name')
                                .attr('href');
                            const absolute_link = `${NPM_BASE}${relative_link}`;
                            return {
                                name: $(el).find('.name').text(),
                                description: $(el).find('.description').text(),
                                version: $(el).find('.version').text(),
                                link: absolute_link
                            };
                        })
                        .get();
                    ok(_packages.slice(1, 10));
                })
                .catch(notOk);
        });
    }
}

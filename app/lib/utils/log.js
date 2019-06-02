/* eslint-disable no-console */
const chalk = require('chalk')

const log = text => console.log(chalk.blue(text))
const info = text => console.info(chalk.cyan(text))
const error = text => console.error(chalk.red(text))
const warn = text => console.warn(chalk.yellow(text))

module.exports = {
  log,
  info,
  error,
  warn
}

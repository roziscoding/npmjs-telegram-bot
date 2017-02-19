/* eslint-disable no-console */

import chalk from 'chalk';

const log = text => console.log(chalk.blue(text));

const info = text => console.info(chalk.cyan(text));

const error = text => console.error(chalk.red(text));

const warn = text => console.warn(chalk.yellow(text));

export {log, info, error, warn};

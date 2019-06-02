module.exports = {
  telegram: {
    apiToken: process.env.TELEGRAM_API_TOKEN,
    webhook: {
      hostname: process.env.TELEGRAM_WEBHOOK_HOSTNAME,
      bindingHost: process.env.TELEGRAM_WEBHOOK_BINDINGHOST,
      port: parseInt(process.env.TELEGRAM_WEBHOOK_PORT || process.env.PORT || 3000, 10)
    }
  }
}

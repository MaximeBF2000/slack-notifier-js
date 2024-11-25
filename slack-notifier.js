// To make this work, you need to create a Slack app and add it to the channel you want to send messages to.
// Then, you need to get the webhook URL from the app and add it to the .env file.
// To create an app: visit https://api.slack.com/apps
// Then go to "Incoming Webhooks" under "Features" and add a new webhook => Copy the webhook URL to the .env file.

/**
 * @typedef {Object} SlackMessage
 * @property {string} text - The message text to send
 * @property {string} [channel] - Optional channel override
 */

class SlackClient {
  /** @type {string} */
  #webhookUrl

  constructor() {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      throw new Error(
        'SLACK_WEBHOOK_URL is not defined in environment variables'
      )
    }
    this.#webhookUrl = webhookUrl
  }

  /**
   * Sends a notification message to Slack
   * @param {string} message - The message to send
   * @returns {Promise<boolean>} Success status of the notification
   */
  async notify(message) {
    try {
      /** @type {SlackMessage} */
      const payload = { text: message }

      const response = await fetch(this.#webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(
          `Failed to send Slack notification: ${response.statusText}`
        )
      }

      return true
    } catch (error) {
      console.error('Error sending Slack notification:', error)
      return false
    }
  }
}

export const slack = new SlackClient()

import sendTelegramMessage from './sendTelegramMessage.js'

export default async function notifyUsers({ usersToNotify = [], token, text } = {}) {
    for (const user of usersToNotify) {
        await sendTelegramMessage({ token, user, text })
    }
}
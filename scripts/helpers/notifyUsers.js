import sendTelegramMessage from './sendTelegramMessage.js'
import sendTelegramPhoto from './sendTelegramPhoto.js'

export default async function notifyUsers({ text, imageUrl } = {}) {
    const { USERS_TO_NOTIFY, TELEGRAM_BOT_TOKEN: token } = process.env
    const usersToNotify = JSON.parse(USERS_TO_NOTIFY)
    return notifyUsersWith({ usersToNotify, token, text, imageUrl })
}

async function notifyUsersWith({ usersToNotify = [], token, text, imageUrl } = {}) {
    for (const user of usersToNotify) {
        if (imageUrl) {
            await sendTelegramPhoto({ token, user, imageUrl })
        }
        if (text) {
            await sendTelegramMessage({ token, user, text })
        }
    }
}
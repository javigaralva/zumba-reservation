import sendTelegramMessage from './sendTelegramMessage.js'
import sendTelegramPhoto from './sendTelegramPhoto.js'
import sendTelegramDocument from './sendTelegramDocument.js'

export default async function notifyUsers({ text, imageUrl, documentUrl } = {}) {
    const { USERS_TO_NOTIFY, TELEGRAM_BOT_TOKEN: token } = process.env
    const usersToNotify = JSON.parse(USERS_TO_NOTIFY)
    return notifyUsersWith({ usersToNotify, token, text, imageUrl, documentUrl })
}

async function notifyUsersWith({ usersToNotify = [], token, text, imageUrl, documentUrl } = {}) {
    for (const user of usersToNotify) {
        if (documentUrl) {
            await sendTelegramDocument({ token, user, documentUrl })
        }
        if (imageUrl) {
            await sendTelegramPhoto({ token, user, imageUrl })
        }
        if (text) {
            await sendTelegramMessage({ token, user, text })
        }
    }
}
import sendTelegramMessage from './helpers/sendTelegramMessage.js'
import { getState } from './config/config.js'

import dotenv from 'dotenv'
dotenv.config()


main()

async function main() {
    const state = getState()

    const text = `[ZUMBA] El estado es: ${state}`
    console.log(text)

    const { USERS_TO_NOTIFY, TELEGRAM_BOT_TOKEN } = process.env
    const usersToNotify = JSON.parse(USERS_TO_NOTIFY)
    for (const user of usersToNotify) {
        await sendTelegramMessage({ token: TELEGRAM_BOT_TOKEN, user, text })
    }
}
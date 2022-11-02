import { setState } from './config/config.js'

import dotenv from 'dotenv'
import notifyUsers from './helpers/notifyUsers.js'
dotenv.config()

main()
async function main() {
    const state = validateInputOrExit()

    setState(state)

    const text = `[ZUMBA] Se ha modificado el estado a: ${state}`
    console.log(text)

    const { USERS_TO_NOTIFY, TELEGRAM_BOT_TOKEN: token } = process.env
    const usersToNotify = JSON.parse(USERS_TO_NOTIFY)
    await notifyUsers({usersToNotify, token, text})
}

function validateInputOrExit() {
    const state = (process.argv[2] ?? '').toUpperCase()
    const isValidState = state === 'ON' || state === 'OFF'
    if (!isValidState) {
        console.error('Estado inválido. Los estados válidos son ON y OFF.')
        process.exit(-1)
    }
    return state
}

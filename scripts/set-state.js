import { setState } from './config/config.js'
import notifyUsers from './helpers/notifyUsers.js'
import { exitWithError } from './helpers/exit.js'

import dotenv from 'dotenv'
dotenv.config()

main()
async function main() {
    const state = await validateInputOrExit()

    setState(state)

    const text = `[ZUMBA] Se ha modificado el estado a: ${state}`
    console.log(text)

    await notifyUsers({ text })
}

async function validateInputOrExit() {
    const state = (process.argv[2] ?? '').toUpperCase()
    const isValidState = state === 'ON' || state === 'OFF'
    if (!isValidState) {
        await exitWithError({ text: 'Estado inválido. Los estados válidos son ON y OFF.', notify: false })
    }
    return state
}

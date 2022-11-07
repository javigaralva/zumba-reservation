import notifyUsers from './helpers/notifyUsers.js'
import { getState } from './config/config.js'

import dotenv from 'dotenv'
dotenv.config()


main()

async function main() {
    const state = getState()

    const text = `[ZUMBA] El estado es: ${state}`
    console.log(text)

    await notifyUsers({ text })
}
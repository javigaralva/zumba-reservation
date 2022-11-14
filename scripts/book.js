import { readConfig } from './config/config.js'
import doReservationProcess from './helpers/doReservationProcess.js'
import { exitWithError } from './helpers/exit.js'

import dotenv from 'dotenv'
dotenv.config()

main()
async function main() {
    const centerConfig = await getCenterConfigOrExit()
    const sanitizedCenterConfig = sanitizeCenterConfig(centerConfig)

    await doReservationProcess(sanitizedCenterConfig)
}

async function getCenterConfigOrExit() {
    const config = readConfig()

    const id = process.argv[2]
    if (!id) {
        await exitWithError({ text: 'Necesaria la key de configuración del centro donde realizar la reserva.', notify: false })
    }

    const centerConfig = config[id]
    if (!centerConfig) {
        await exitWithError({ text: `No se ha podido encontrar una configuración para ${id}.`, notify: false })
    }
    return centerConfig
}

function sanitizeCenterConfig(centerConfig = {}) {
    const sanitizedCenterConfig = { ...centerConfig }
    sanitizedCenterConfig.USER = process.env[sanitizedCenterConfig.USER]
    sanitizedCenterConfig.PASSWORD = process.env[sanitizedCenterConfig.PASSWORD]
    sanitizedCenterConfig.DISPLAYED_NAME = process.env[sanitizedCenterConfig.DISPLAYED_NAME]
    sanitizedCenterConfig.LOGIN_URL = sanitizedCenterConfig.LOGIN_URL.replace('${BASE_URL}', sanitizedCenterConfig.BASE_URL)
    sanitizedCenterConfig.CLASS_RESERVATION_URL = sanitizedCenterConfig.CLASS_RESERVATION_URL.replace('${BASE_URL}', sanitizedCenterConfig.BASE_URL)
    return sanitizedCenterConfig
}
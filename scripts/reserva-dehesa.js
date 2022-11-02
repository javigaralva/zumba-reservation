import playwright from 'playwright'
import moment from 'moment'
import doLogin from './helpers/doLogin.js'
import goToCorrectCalendarPage from './helpers/goToCorrectCalendarPage.js'
import inscribeInZumba from './helpers/inscribeInZumba.js'
import finishReservation from './helpers/finishReservation.js'
import checkIfStateIsOnOrExit from './helpers/checkIfStateIsOnOrExit.js'

import dotenv from 'dotenv'
dotenv.config()


const MONDAY_CLASS = { HOUR: 20, MINUTE: 0, SECOND: 0 }

main()

async function main() {

    checkIfStateIsOnOrExit()

    const tomorrow = getTomorrow()

    console.log('Buscando para la clase del ' + tomorrow.format('YYYY-MM-DD HH:mm:ss'))

    const browser = await playwright.chromium.launch({ headless: true })

    const page = await browser.newPage()

    const user = process.env.USER_DEHESA
    const password = process.env.PASSWORD_DEHESA
    const zumbaSelectorClass = '.clase-nombre-ZUMBA-'

    await page.goto('https://reservas.ssreyes.org/')

    await doLogin({ page, user, password })

    await page.getByRole('link', { name: 'RESERVAR' }).first().click()

    await goToCorrectCalendarPage({ page, dayToGo: tomorrow })

    await inscribeInZumba({ zumbaSelectorClass, day: tomorrow, page })

    await finishReservation({ page })

    process.exit(0)
}

function getTomorrow() {
    const tomorrow = moment().add(1, 'day')

    if (tomorrow.day() !== 1) {
        console.error('Mañana no es lunes en Dehesa Vieja.')
        process.exit(-1)
    }

    tomorrow.hour(MONDAY_CLASS.HOUR).minute(MONDAY_CLASS.MINUTE).second(MONDAY_CLASS.SECOND)

    return tomorrow
}


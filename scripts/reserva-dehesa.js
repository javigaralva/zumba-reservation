import playwright from 'playwright'
import moment from 'moment'
import doLogin from './helpers/doLogin.js'
import goToCorrectCalendarPage from './helpers/goToCorrectCalendarPage.js'
import inscribeInZumba from './helpers/inscribeInZumba.js'
import finishReservation from './helpers/finishReservation.js'
import checkIfStateIsOnOrExit from './helpers/checkIfStateIsOnOrExit.js'
import { exitOk, exitWithError } from './helpers/exit.js'

import dotenv from 'dotenv'
dotenv.config()


const MONDAY_CLASS = { HOUR: 20, MINUTE: 0, SECOND: 0 }

main()

async function main() {

    await checkIfStateIsOnOrExit()

    const tomorrow = await getTomorrow()

    console.log('Buscando para la clase del ' + tomorrow.format('YYYY-MM-DD HH:mm:ss'))

    const browser = await playwright.chromium.launch({ headless: true })

    const page = await browser.newPage()

    const user = process.env.USER_DEHESA
    const password = process.env.PASSWORD_DEHESA
    const zumbaSelectorClass = '.clase-nombre-ZUMBA-'

    let step = 'Go to main page'
    await page.goto('https://reservas.ssreyes.org/')

    try {
        step = 'doLogin'
        await doLogin({ page, user, password })

        step = 'goToReservation'
        await goToReservation({ page })

        step = 'goToCorrectCalendarPage'
        await goToCorrectCalendarPage({ page, dayToGo: tomorrow })

        step = 'inscribeInZumba'
        await inscribeInZumba({ zumbaSelectorClass, day: tomorrow, page })

        step = 'finishReservation'
        await finishReservation({ page })

    } catch (error) {
        await exitWithError({ page, text: `Error en el proceso de reserva de Dehesa Vieja. Step: '${step}'` })
    }

    await exitOk()
}

async function getTomorrow() {
    const tomorrow = moment().add(1, 'day')

    if (tomorrow.day() !== 1) {
        await exitWithError({ text: 'Mañana no es lunes en Dehesa Vieja', notify: false })
    }

    tomorrow.hour(MONDAY_CLASS.HOUR).minute(MONDAY_CLASS.MINUTE).second(MONDAY_CLASS.SECOND)

    return tomorrow
}

async function goToReservation({ page }) {
    console.log('Accediendo a la página de reservas...')
    await page.getByRole('link', { name: 'RESERVAR' }).first().click()
}
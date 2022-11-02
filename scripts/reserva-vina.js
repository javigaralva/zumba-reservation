import playwright from 'playwright'
import moment from 'moment'

import doLogin from './helpers/doLogin.js'
import goToCorrectCalendarPage from './helpers/goToCorrectCalendarPage.js'
import inscribeInZumba from './helpers/inscribeInZumba.js'
import finishReservation from './helpers/finishReservation.js'
import chooseEmptyPlaceAndReserveIt from './helpers/chooseEmptyPlaceAndReserveIt.js'
import checkIfStateIsOnOrExit from './helpers/checkIfStateIsOnOrExit.js'

import dotenv from 'dotenv'
dotenv.config()


const MONDAY_CLASS = { HOUR: 18, MINUTE: 0, SECOND: 0 }
const WEDNESDAY_CLASS = { HOUR: 19, MINUTE: 0, SECOND: 0 }

main()

async function main() {

    checkIfStateIsOnOrExit()

    const tomorrow = getTomorrow()

    console.log('Buscando para la clase del ' + tomorrow.format('YYYY-MM-DD HH:mm:ss'))

    const browser = await playwright.chromium.launch({ headless: true })

    const page = await browser.newPage()

    const user = process.env.USER_VINA
    const password = process.env.PASSWORD_VINA
    const zumbaSelectorClass = '.clase-nombre-ZUMBA'

    await page.goto('https://vinafitness.deporsite.net/')

    await doLogin({ page, user, password })

    await page.getByRole('link', { name: 'RESERVAS DE ACTIVIDADES' }).first().click()

    await goToCorrectCalendarPage({ page, dayToGo: tomorrow })

    await inscribeInZumba({ zumbaSelectorClass, day: tomorrow, page })

    await chooseEmptyPlaceAndReserveIt({ page })

    await finishReservation({ page })

    process.exit(0)

}

function getTomorrow() {
    const tomorrow = moment().add(1, 'day')

    const isMonday = tomorrow.day() === 1
    const isWednesday = tomorrow.day() === 3
    if (!(isMonday || isWednesday)) {
        console.error('Mañana no es ni lunes ni miércoles en La viña.')
        process.exit(-1)
    }

    isMonday && tomorrow.hour(MONDAY_CLASS.HOUR).minute(MONDAY_CLASS.MINUTE).second(MONDAY_CLASS.SECOND)
    isWednesday && tomorrow.hour(WEDNESDAY_CLASS.HOUR).minute(WEDNESDAY_CLASS.MINUTE).second(WEDNESDAY_CLASS.SECOND)

    return tomorrow
}


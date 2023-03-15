import playwright from 'playwright'

import getTomorrowOrExit from './getTomorrowOrExit.js'
import doLogin from './doLogin.js'
import goToReservation from './goToReservation.js'
import goToCorrectCalendarPage from './goToCorrectCalendarPage.js'
import inscribeInZumba from './inscribeInZumba.js'
import finishReservation from './finishReservation.js'
import chooseEmptyPlaceAndReserveIt from './chooseEmptyPlaceAndReserveIt.js'
import checkIfStateIsOnOrExit from './checkIfStateIsOnOrExit.js'
import { exitOk, exitWithError } from './exit.js'

let step

export default async function doReservationProcess({
    ID,
    HEADLESS = true,
    USER,
    PASSWORD,
    DISPLAYED_NAME,
    LOGIN_URL,
    CLASS_RESERVATION_URL,
    ZUMBA_SELECTOR_CLASS,
    CLASSES,
    HAS_TO_CHOOSE_A_PLACE = false,
    MS_TO_FINISH_RETRYING = 5 * 60_000,
    MS_TO_WAIT_AFTER_RETRY = 0
}) {

    await checkIfStateIsOnOrExit()

    const tomorrow = await getTomorrowOrExit({id: ID, classes: CLASSES})

    console.log(`Se buscará para la clase del ${tomorrow.format('YYYY-MM-DD HH:mm:ss')} en ${ID}`)

    const browser = await playwright.chromium.launch({ headless: HEADLESS })

    const page = await browser.newPage()

    step = `Comenzando proceso de reserva para ${ID}...`
    try {
        step = 'doLogin'
        await doLogin({ page, user: USER, password: PASSWORD, url: LOGIN_URL, displayedName: DISPLAYED_NAME })

        step = 'goToReservation'
        await goToReservation({ page, url: CLASS_RESERVATION_URL })

        step = 'goToCorrectCalendarPage'
        await goToCorrectCalendarPage({ page, dayToGo: tomorrow })

        step = 'inscribeInZumba'
        await inscribeInZumba({ zumbaSelectorClass: ZUMBA_SELECTOR_CLASS, day: tomorrow, page })

        if (HAS_TO_CHOOSE_A_PLACE) {
            step = 'chooseEmptyPlaceAndReserveIt'
            await chooseEmptyPlaceAndReserveIt({ page })
        }

        await finishReservationWithRetries({ page, MS_TO_FINISH_RETRYING, ID, MS_TO_WAIT_AFTER_RETRY })

    } catch (error) {
        await exitWithError({ page, error, text: `Error en el proceso de reserva de ${ID}. Step: '${step}'` })
    }

    await exitOk()
}


async function finishReservationWithRetries({ page, MS_TO_FINISH_RETRYING, ID, MS_TO_WAIT_AFTER_RETRY }) {
    const startTime = Date.now()
    let retryNum = 0
    while (true) {
        const stepSuffix = retryNum > 0 ? 'Retrying' + retryNum : ''

        step = 'finishReservation' + stepSuffix
        const reservationError = await finishReservation({ page })
        if (!reservationError) {
            break
        }

        retryNum++

        const elapsedTime = Date.now() - startTime
        if (elapsedTime >= MS_TO_FINISH_RETRYING) {
            await exitWithError({ page, text: `Excedido el tiempo de re-intentos (${MS_TO_FINISH_RETRYING}ms) en el proceso de reserva de ${ID}. Step: '${step}'. Reintentos: ${retryNum}` })
        }

        page.waitForTimeout(MS_TO_WAIT_AFTER_RETRY)

        console.log(`Retrying ${retryNum}...`)
        step = 'reloading' + stepSuffix
        await page.reload()

    }
    return step
}


import { chromium } from 'playwright-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'

chromium.use(stealthPlugin())

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

    HEADLESS = true
    console.log(`Using chromium browser with Stealth Plugin`)

    const launchOptions = { 
        headless: HEADLESS,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-site-isolation-trials',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    }

    if (process.env.USE_TOR === 'true') {
        console.log('Using Tor proxy...');
        launchOptions.proxy = {
            server: 'socks5://127.0.0.1:9050'
        }
    }

    const browser = await chromium.launch(launchOptions)
    const context = await browser.newContext({ 
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 },
        locale: 'es-ES', 
        recordVideo: { dir: './videos' },
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        extraHTTPHeaders: {
            'Accept-Language': 'es-ES,es;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Referer': 'https://reservas.ssreyes.org/'
        }
    });
    const page = await context.newPage()

    // Aumentamos drásticamente los timeouts porque Tor es muy lento
    page.setDefaultTimeout(120000)
    page.setDefaultNavigationTimeout(120000)

    // DEBUG: Verificar IP pública para confirmar que Tor funciona
    try {
        console.log('Verificando IP pública...');
        await page.goto('https://api.ipify.org?format=json', { timeout: 60000 });
        const content = await page.content();
        console.log(`IP Pública actual: ${content}`);
    } catch (e) {
        console.log('No se pudo verificar la IP (posiblemente timeout o bloqueo):', e.message);
    }

    step = `Comenzando proceso de reserva para ${ID}...`
    try {
        step = 'doLogin'
        await doLogin({ browser, page, user: USER, password: PASSWORD, url: LOGIN_URL, displayedName: DISPLAYED_NAME })

        step = 'goToReservation'
        await goToReservation({ browser, page, url: CLASS_RESERVATION_URL })

        step = 'goToCorrectCalendarPage'
        await goToCorrectCalendarPage({ browser, page, dayToGo: tomorrow })

        step = 'inscribeInZumba'
        await inscribeInZumba({ browser, zumbaSelectorClass: ZUMBA_SELECTOR_CLASS, day: tomorrow, page })

        let placeFoundData
        if (HAS_TO_CHOOSE_A_PLACE) {
            step = 'chooseEmptyPlaceAndReserveIt'
            placeFoundData = await chooseEmptyPlaceAndReserveIt({ browser, page })
        }

        await finishReservationWithRetries({ browser, page, MS_TO_FINISH_RETRYING, ID, MS_TO_WAIT_AFTER_RETRY, HAS_TO_CHOOSE_A_PLACE, placeFoundData })

    } catch (error) {
        await exitWithError({ browser, page, error, text: `Error en el proceso de reserva de ${ID}. Step: '${step}'` })
    }

    await exitOk({ browser })
}


async function finishReservationWithRetries({ browser, page, MS_TO_FINISH_RETRYING, ID, MS_TO_WAIT_AFTER_RETRY, HAS_TO_CHOOSE_A_PLACE, placeFoundData }) {
    const startTime = Date.now()
    let retryNum = 0
    while (true) {
        const stepSuffix = retryNum > 0 ? 'Retrying' + retryNum : ''

        step = 'finishReservation' + stepSuffix
        const reservationError = await finishReservation({ browser, page, ID, HAS_TO_CHOOSE_A_PLACE, placeFoundData })
        if (!reservationError) {
            break
        }

        retryNum++

        const elapsedTime = Date.now() - startTime
        if (elapsedTime >= MS_TO_FINISH_RETRYING) {
            await exitWithError({ browser, page, text: `Excedido el tiempo de re-intentos (${MS_TO_FINISH_RETRYING}ms) en el proceso de reserva de ${ID}. Step: '${step}'. Reintentos: ${retryNum}` })
        }

        page.waitForTimeout(MS_TO_WAIT_AFTER_RETRY)

        console.log(`Retrying ${retryNum}...`)
        step = 'reloading' + stepSuffix
        await page.reload()

    }
    return step
}


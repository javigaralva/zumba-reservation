import { chromium } from 'playwright-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..', '..')
const resourcesDir = path.join(projectRoot, 'resources')

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

    const browser = await chromium.launch(launchOptions)
    const context = await browser.newContext({ 
        // locale: 'es-ES', 
        recordVideo: { dir: './videos' } 
    });
    const page = await context.newPage()

    // INTERCEPTOR DE RED:
    await page.route('**/*', async route => {
        const url = route.request().url();
        
        if (url.includes('resources.deporsite.net')) {
            let localPath = null;
            let contentType = 'text/plain';

            if (url.includes('jquery-3.5.0.min.js')) {
                localPath = 'jquery.min.js';
                contentType = 'application/javascript';
            } else if (url.includes('bootstrap.min.js')) {
                localPath = 'bootstrap.min.js';
                contentType = 'application/javascript';
            } else if (url.includes('bootstrap.min.css')) {
                localPath = 'bootstrap.min.css';
                contentType = 'text/css';
            } else if (url.includes('moment.min.js')) {
                localPath = 'moment.min.js';
                contentType = 'application/javascript';
            } else if (url.includes('material-icons.css')) {
                localPath = 'material-icons.css';
                contentType = 'text/css';
            } else if (url.includes('material.js')) {
                localPath = 'material.js';
                contentType = 'application/javascript';
            } else if (url.includes('ripples.js')) {
                localPath = 'ripples.js';
                contentType = 'application/javascript';
            } else if (url.includes('glyphicons-halflings-regular.woff2')) {
                localPath = 'fonts/glyphicons-halflings-regular.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('glyphicons-halflings-regular.woff')) {
                localPath = 'fonts/glyphicons-halflings-regular.woff';
                contentType = 'font/woff';
            } else if (url.includes('glyphicons-halflings-regular.ttf')) {
                localPath = 'fonts/glyphicons-halflings-regular.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Light.woff2')) {
                localPath = 'fonts/Roboto-Light.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Medium.woff2')) {
                localPath = 'fonts/Roboto-Medium.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Regular.woff2')) {
                localPath = 'fonts/Roboto-Regular.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Bold.woff2')) {
                localPath = 'fonts/Roboto-Bold.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Light.woff')) {
                localPath = 'fonts/Roboto-Light.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Medium.woff')) {
                localPath = 'fonts/Roboto-Medium.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Regular.woff')) {
                localPath = 'fonts/Roboto-Regular.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Bold.woff')) {
                localPath = 'fonts/Roboto-Bold.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Light.ttf')) {
                localPath = 'fonts/Roboto-Light.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Medium.ttf')) {
                localPath = 'fonts/Roboto-Medium.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Regular.ttf')) {
                localPath = 'fonts/Roboto-Regular.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Bold.ttf')) {
                localPath = 'fonts/Roboto-Bold.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('RobotoCondensed-Regular.ttf')) {
                localPath = 'fonts/RobotoCondensed-Regular.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('MaterialIcons-Regular.woff2')) {
                localPath = 'fonts/MaterialIcons-Regular.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('MaterialIcons-Regular.woff')) {
                localPath = 'fonts/MaterialIcons-Regular.woff';
                contentType = 'font/woff';
            } else if (url.includes('MaterialIcons-Regular.ttf')) {
                localPath = 'fonts/MaterialIcons-Regular.ttf';
                contentType = 'font/ttf';
            }

            if (localPath) {
                const fullPath = path.join(resourcesDir, localPath);
                console.log(`[PROXY] Sirviendo local: ${url} -> ${localPath}`);
                try {
                    const body = fs.readFileSync(fullPath);
                    return route.fulfill({ 
                        status: 200,
                        contentType: contentType,
                        body: body 
                    });
                } catch (e) {
                    console.error(`Error serving local file ${fullPath}`, e);
                    return route.abort();
                }
            } else {
                console.log(`[PROXY] Bloqueando recurso secundario: ${url}`);
                return route.abort();
            }
        }
        
        return route.continue();
    });

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


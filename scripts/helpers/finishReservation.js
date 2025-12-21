import { exitWithError } from './exit.js'
import notifyUsers from './notifyUsers.js'

const FINISH_RESERVATION_ERRORS = {
    INVALID_RESERVATION_TIME_1_DAY: 'INVALID_RESERVATION_TIME_1_DAY'
}

export default async function finishReservation({ browser, page, ID, HAS_TO_CHOOSE_A_PLACE, placeFoundData = {} }) {
    console.log('Reservando plaza de zumba...')

    console.log("XXXXXXXX1")

    console.log("Esperando 5000ms...")
    await page.waitForTimeout(5000)

    const reservarButtons = page.getByText('Reservar')
    const count = await reservarButtons.count()
    console.log(`Encontrados ${count} botones con texto 'Reservar'`)

    if (count > 0) {
        for (let i = 0; i < count; i++) {
            const isVisible = await reservarButtons.nth(i).isVisible()
            console.log(`Botón ${i}: visible=${isVisible}`)
        }

        // Intentamos clickar el segundo si hay más de uno (comportamiento original), o el primero si solo hay uno
        const indexToClick = count > 1 ? 1 : 0
        console.log(`Haciendo click en el botón índice ${indexToClick}...`)
        await reservarButtons.nth(indexToClick).click()
    } else {
        console.log("ERROR: No se encontró ningún botón 'Reservar'")
    }

    console.log("XXXXXXXX2")
    
    // Esperamos a que la navegación ocurra y la página cargue
    try {
        await page.waitForLoadState('domcontentloaded', { timeout: 60000 })
    } catch (e) {
        console.log('Timeout esperando domcontentloaded, continuamos...')
    }
    
    console.log("Esperando 5000ms...")
    await page.waitForTimeout(5000)

    {
        const errorLocator = await page.locator('.box-datos-error')
        const isErrorLocatorVisible = await errorLocator.isVisible()
        if (isErrorLocatorVisible) {
            const errorText = await errorLocator.innerText()
            if (errorText.toUpperCase().includes('NO SE PUEDEN REALIZAR RESERVAS CON UNA ANTELACIÓN SUPERIOR')) {
                console.log(errorText)
                return FINISH_RESERVATION_ERRORS.INVALID_RESERVATION_TIME_1_DAY
            }
            await exitWithError({ browser, page, text: 'No se puede realizar la reserva: ' + errorText })
        }
    }
    {
        const locator = await page.getByText('Operación confirmada correctamente')
        const isLocatorVisible = await locator.isVisible()
        
        const reservationText = isLocatorVisible 
            ? `¡Reservada clase en ${ID}!`
            : `Quizá esté reservada la clase en ${ID}. La ventana de confirmación no ha aparecido.`

        const { placeNumberFound = -1 } = placeFoundData
        const placeText = HAS_TO_CHOOSE_A_PLACE ? `Sitio elegido: ${placeNumberFound}` : ''

        const textToDisplay = [ reservationText, placeText ].join(' ')

        await notifyUsers({ text: textToDisplay })
        console.log(textToDisplay)
    }
}

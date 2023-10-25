import { exitWithError } from './exit.js'
import { notifyUsers } from './notifyUsers.js'

const FINISH_RESERVATION_ERRORS = {
    INVALID_RESERVATION_TIME_1_DAY: 'INVALID_RESERVATION_TIME_1_DAY'
}

export default async function finishReservation({ page, ID, HAS_TO_CHOOSE_A_PLACE, placeFoundData = {} }) {
    console.log('Reservando plaza de zumba...')

    await page.getByText('Reservar').nth(1).click()
    await page.waitForTimeout(5000)
    await page.waitForLoadState('networkidle')

    {
        const errorLocator = await page.locator('.box-datos-error')
        const isErrorLocatorVisible = await errorLocator.isVisible()
        if (isErrorLocatorVisible) {
            const errorText = await errorLocator.innerText()
            if (errorText.toUpperCase().includes('NO SE PUEDEN REALIZAR RESERVAS CON UNA ANTELACIÓN SUPERIOR A 1 DÍA')) {
                console.log(errorText)
                return FINISH_RESERVATION_ERRORS.INVALID_RESERVATION_TIME_1_DAY
            }
            await exitWithError({ page, text: 'No se puede realizar la reserva: ' + errorText })
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

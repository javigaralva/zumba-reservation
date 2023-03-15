import { exitWithError } from './exit.js'

const FINISH_RESERVATION_ERRORS = {
    INVALID_RESERVATION_TIME_1_DAY: 'INVALID_RESERVATION_TIME_1_DAY'
}

export default async function finishReservation({ page }) {
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
        if (isLocatorVisible) {
            console.log("¡Reservada!")
        } else {
            console.log("Quizá esté reservada. La ventana de confirmación no ha aparecido.")
        }
    }
}

import { exitWithError } from './exit.js'

export default async function finishReservation({ page }) {
    console.log('Reservando plaza de zumba...')

    await page.getByText('Reservar').nth(1).click()

    await page.waitForTimeout(10000)

    {
        const errorLocator = await page.locator('.box-datos-error')
        const isErrorLocatorVisible = await errorLocator.isVisible()
        if (isErrorLocatorVisible) {
            await exitWithError({ page, text: 'No se puede realizar la reserva: ' + (await errorLocator.innerText()) })
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

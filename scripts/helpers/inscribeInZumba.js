import { exitWithError } from './exit.js'

export default async function inscribeInZumba({ browser, page, zumbaSelectorClass, day }) {
    console.log('Buscando clase de zumba...')

    const idFecha = day.format('YYYY-MM-DD')
    const idHoraInicio = day.format('HH:mm:ss')
    const zumbaSelector = `${".clase-nombre-YOGA"}[data-idfecha="${idFecha}"][data-horainicio="11:00:00"]`
    const zumbaLocator = await page.locator(zumbaSelector)
    const zumbaNumOfClasses = await zumbaLocator.count()
    if (zumbaNumOfClasses === 0) {
        await exitWithError({ browser, page, text: `No se ha encontrado una clase de zumba para el día ${idFecha}` })
    }
    if (zumbaNumOfClasses > 1) {
        await exitWithError({ browser, page, text: `Se han encontrado varias clases de zumba para el día ${idFecha}` })
    }

    await zumbaLocator.first().click()

    if (await page.getByRole('link', { name: 'ir a mis reservas' }).isVisible()) {
        await exitWithError({ browser, page, text: 'Clase de zumba ya reservada', exitCode: 0 })
    }

    if (await page.getByRole('link', { name: 'Apuntarme a la lista' }).isVisible()) {
        await exitWithError({ browser, page, text: 'Clase completa' })
    }

    await page.getByRole('link', { name: 'Inscribirme' }).click()
}

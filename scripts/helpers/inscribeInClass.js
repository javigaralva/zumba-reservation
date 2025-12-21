import { exitWithError } from './exit.js'

export default async function inscribeInClass({ browser, page, selectorClass, day }) {
    console.log(`Buscando clase de ${selectorClass}...`)

    const idFecha = day.format('YYYY-MM-DD')
    const idHoraInicio = day.format('HH:mm:ss')
    const classSelector = `${selectorClass}[data-idfecha="${idFecha}"][data-horainicio="${idHoraInicio}"]`
    const classLocator = await page.locator(classSelector)
    const classNumOfClasses = await classLocator.count()
    if (classNumOfClasses === 0) {
        await exitWithError({ browser, page, text: `No se ha encontrado una clase (${classSelector}) para el día ${idFecha}` })
    }
    if (classNumOfClasses > 1) {
        await exitWithError({ browser, page, text: `Se han encontrado varias clases (${classSelector}) para el día ${idFecha}` })
    }

    await classLocator.first().click()

    if (await page.getByRole('link', { name: 'ir a mis reservas' }).isVisible()) {
        await exitWithError({ browser, page, text: `Clase de ${classSelector} ya reservada`, exitCode: 0 })
    }

    if (await page.getByRole('link', { name: 'Apuntarme a la lista' }).isVisible()) {
        await exitWithError({ browser, page, text: 'Clase completa' })
    }

    await page.getByRole('link', { name: 'Inscribirme' }).click()
}

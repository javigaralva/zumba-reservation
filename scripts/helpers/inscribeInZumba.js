export default async function inscribeInZumba({ page, zumbaSelectorClass, day }) {
    console.log('Buscando clase de zumba...')

    const idFecha = day.format('YYYY-MM-DD')
    const idHoraInicio = day.format('HH:mm:ss')
    const zumbaSelector = `${zumbaSelectorClass}[data-idfecha="${idFecha}"][data-horainicio="${idHoraInicio}"]`
    const zumbaLocator = await page.locator(zumbaSelector)
    const zumbaNumOfClasses = await zumbaLocator.count()
    if (zumbaNumOfClasses === 0) {
        console.error(`No se ha encontrado una clase de zumba para el día ${idFecha}`)
        process.exit(-1)
    }
    if (zumbaNumOfClasses > 1) {
        console.error(`Se han encontrado varias clases de zumba para el día ${idFecha}`)
        process.exit(-1)
    }

    await zumbaLocator.first().click()

    if (await page.getByRole('link', { name: 'ir a mis reservas' }).isVisible()) {
        console.log('Clase de zumba ya reservada')
        process.exit(0)
    }

    if (await page.getByRole('link', { name: 'Apuntarme a la lista' }).isVisible()) {
        console.log('Clase completa')
        process.exit(-1)
    }

    await page.getByRole('link', { name: 'Inscribirme' }).click()
}

import moment from 'moment'
import { exitWithError } from './exit.js'

export default async function goToCorrectCalendarPage({ browser, page, dayToGo }) {
    while (true) {
        const dateLocator = await page.locator('.title-cabecera.pull-right')
        await dateLocator.waitFor({ state: 'visible' })

        const dateSelector = await dateLocator.innerText()
        const [strDayFrom, strDayTo] = dateSelector.split('\n')[1].split(' - ')
        const dayFrom = moment(strDayFrom, 'DD/MM/YYYY')
        const dayTo = moment(strDayTo, 'DD/MM/YYYY')

        if (dayToGo.isBetween(dayFrom, dayTo)) {
            console.log('Estamos en la página del calendario correcta')
            break
        }

        if (!dayToGo.isAfter(dayTo)) {
            await exitWithError({ browser, page, text: 'Error de página del calendario' })
        }

        console.log('Pasamos a la siguiente página del calendario')
        await page.getByText('arrow_forward_ios').click()
    }
}

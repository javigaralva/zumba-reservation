import { exitWithError } from './exit.js'

export default async function doLogin({ browser, page, user, password, url, displayedName }) {
    console.log('Haciendo login...')

    await page.goto(url)

    await page.getByLabel('Usuario').click()
    await page.getByLabel('Usuario').fill(user)
    await page.getByLabel('Usuario').press('Tab')

    await page.getByLabel('Contraseña').fill(password)
    // await page.getByLabel('Contraseña').press('Enter')

    await page.locator('#enviarFormulario').click()

    await page.getByRole('link', { name: displayedName, includeHidden: true }).waitFor({ state: "attached" })
    
    // const isDisplayedNameVisible = await link.isVisible()
    // if (!isDisplayedNameVisible) {
    //     await exitWithError({ browser, page, text: 'No se ha realizado login correctamente. No se ha encontrado el nombre del usuario en el profile.' })
    // }
}

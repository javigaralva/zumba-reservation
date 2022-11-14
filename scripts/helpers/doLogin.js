import { exitWithError } from './exit.js'

export default async function doLogin({ page, user, password, url, displayedName }) {
    console.log('Haciendo login...')

    await page.goto(url)

    await page.getByLabel('Usuario').click()

    await page.getByLabel('Usuario').fill(user)

    await page.getByLabel('Usuario').press('Tab')

    await page.locator('input[name="password"]').fill(password)

    await page.getByRole('button', { name: 'Acceder' }).click()

    const isDisplayedNameVisible = await page.getByRole('link', { name: displayedName }).isVisible()
    if (!isDisplayedNameVisible) {
        await exitWithError({ page, text: 'No se ha realizado login correctamente. No se ha encontrado el nombre del usuario en el profile.' })
    }
}

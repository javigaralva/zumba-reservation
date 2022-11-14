
export default async function doLogin({ page, user, password, url }) {
    console.log('Haciendo login...')

    await page.goto(url)

    await page.getByLabel('Usuario').click()

    await page.getByLabel('Usuario').fill(user)

    await page.getByLabel('Usuario').press('Tab')

    await page.locator('input[name="password"]').fill(password)

    await page.getByRole('button', { name: 'Acceder' }).click()
}

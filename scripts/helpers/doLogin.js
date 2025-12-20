import { exitWithError } from './exit.js'

export default async function doLogin({ browser, page, user, password, url, displayedName }) {
    console.log('Haciendo login...')

    await page.goto(url)

    await page.getByLabel('Usuario').click()
    await page.getByLabel('Usuario').fill(user)
    await page.getByLabel('Usuario').press('Tab')

    await page.getByLabel('Contraseña').fill(password)
    // await page.getByLabel('Contraseña').press('Enter')

    console.log('Enviando formulario de login...')
    
    // Intentamos disparar el login ejecutando el JS del sitio directamente
    // Esto evita problemas si el botón está tapado o el click de Playwright no se registra
    await page.evaluate(() => {
        try {
            // @ts-ignore
            Componentes_Login.enviaFormulario();
        } catch (e) {
            console.log('Falló la llamada directa, intentando click nativo...');
            document.getElementById('enviarFormulario').click();
        }
    });

    // Esperar a que la página cargue completamente tras el login
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: displayedName, includeHidden: true }).waitFor({ state: "attached", timeout: 60000 })
    
    // const isDisplayedNameVisible = await link.isVisible()
    // if (!isDisplayedNameVisible) {
    //     await exitWithError({ browser, page, text: 'No se ha realizado login correctamente. No se ha encontrado el nombre del usuario en el profile.' })
    // }
}

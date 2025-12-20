import { exitWithError } from './exit.js'

export default async function doLogin({ browser, page, user, password, url, displayedName }) {
    console.log('Haciendo login...')

    // Capturar errores y logs del navegador para depuración
    page.on('console', msg => {
        if (msg.type() === 'error') console.log(`BROWSER ERROR LOG: ${msg.text()}`);
    });
    page.on('pageerror', exception => console.log(`BROWSER UNCAUGHT EXCEPTION: "${exception}"`));
    page.on('requestfailed', request => {
        console.log(`BROWSER REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`);
    });

    console.log(`Navegando a ${url} con timeout extendido...`);
    
    try {
        const response = await page.goto(url, { timeout: 120000 })
        console.log(`Status de respuesta: ${response?.status()}`);
        console.log(`Título de la página: ${await page.title()}`);
        
        // Si el status no es 200, podría ser un bloqueo
        if (response?.status() === 403) {
            console.log('ALERTA: Recibido 403 Forbidden. Es probable que la IP esté bloqueada.');
            const content = await page.content();
            console.log('Contenido de la página de error:', content.substring(0, 1000));
        }
    } catch (e) {
        console.log(`Error crítico en navegación: ${e.message}`);
        try {
            const content = await page.content();
            console.log('Contenido HTML en el momento del error (posible página en blanco):');
            console.log(content);
        } catch (inner) {
            console.log('No se pudo leer el contenido de la página tras el error.');
        }
        throw e;
    }

    await page.getByLabel('Usuario').click()
    await page.getByLabel('Usuario').fill(user)
    await page.getByLabel('Usuario').press('Tab')

    await page.getByLabel('Contraseña').fill(password)
    // await page.getByLabel('Contraseña').press('Enter')

    console.log('Enviando formulario de login...')
    
    const currentUrl = page.url();

    // Intentar login esperando navegación
    try {
        await Promise.all([
            page.waitForNavigation({ timeout: 20000 }),
            page.evaluate(() => {
                // @ts-ignore
                if (typeof Componentes_Login !== 'undefined') {
                    Componentes_Login.enviaFormulario();
                } else {
                    const btn = document.getElementById('enviarFormulario');
                    if (btn) btn.click();
                }
            })
        ]);
    } catch (e) {
        console.log('Timeout esperando navegación. Comprobando si cambió la URL...');
    }

    if (page.url() === currentUrl) {
        console.log('Parece que seguimos en la misma URL. Intentando click forzado en el botón...');
        await page.locator('#enviarFormulario').click({ force: true });
        await page.waitForTimeout(5000); // Esperar un poco a ver si reacciona
    }

    console.log(`URL tras intento de login: ${page.url()}`);

    // Esperar a que la página cargue completamente tras el login
    await page.waitForLoadState('networkidle')

    console.log(`Buscando enlace con nombre: "${displayedName}"`);
    await page.getByRole('link', { name: displayedName, includeHidden: true }).waitFor({ state: "attached", timeout: 60000 })
    
    // const isDisplayedNameVisible = await link.isVisible()
    // if (!isDisplayedNameVisible) {
    //     await exitWithError({ browser, page, text: 'No se ha realizado login correctamente. No se ha encontrado el nombre del usuario en el profile.' })
    // }
}

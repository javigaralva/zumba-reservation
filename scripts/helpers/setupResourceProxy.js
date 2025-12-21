import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..', '..')
const resourcesDir = path.join(projectRoot, 'resources')

export default async function setupResourceProxy({ page }) {
    // INTERCEPTOR DE RED:
    // Como resources.deporsite.net bloquea la IP de GitHub (403), servimos los recursos estáticos
    // desde local.
    await page.route('**/*', async route => {
        const url = route.request().url();
        
        if (url.includes('resources.deporsite.net')) {
            let localPath = null;
            let contentType = 'text/plain';

            if (url.includes('jquery-3.5.0.min.js')) {
                localPath = 'jquery.min.js';
                contentType = 'application/javascript';
            } else if (url.includes('bootstrap.min.js')) {
                localPath = 'bootstrap.min.js';
                contentType = 'application/javascript';
            } else if (url.includes('bootstrap.min.css')) {
                localPath = 'bootstrap.min.css';
                contentType = 'text/css';
            } else if (url.includes('moment.min.js')) {
                localPath = 'moment.min.js';
                contentType = 'application/javascript';
            } else if (url.includes('material-icons.css')) {
                localPath = 'material-icons.css';
                contentType = 'text/css';
            } else if (url.includes('material.js')) {
                localPath = 'material.js';
                contentType = 'application/javascript';
            } else if (url.includes('ripples.js')) {
                localPath = 'ripples.js';
                contentType = 'application/javascript';
            } else if (url.includes('glyphicons-halflings-regular.woff2')) {
                localPath = 'fonts/glyphicons-halflings-regular.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('glyphicons-halflings-regular.woff')) {
                localPath = 'fonts/glyphicons-halflings-regular.woff';
                contentType = 'font/woff';
            } else if (url.includes('glyphicons-halflings-regular.ttf')) {
                localPath = 'fonts/glyphicons-halflings-regular.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Light.woff2')) {
                localPath = 'fonts/Roboto-Light.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Medium.woff2')) {
                localPath = 'fonts/Roboto-Medium.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Regular.woff2')) {
                localPath = 'fonts/Roboto-Regular.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Bold.woff2')) {
                localPath = 'fonts/Roboto-Bold.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('Roboto-Light.woff')) {
                localPath = 'fonts/Roboto-Light.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Medium.woff')) {
                localPath = 'fonts/Roboto-Medium.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Regular.woff')) {
                localPath = 'fonts/Roboto-Regular.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Bold.woff')) {
                localPath = 'fonts/Roboto-Bold.woff';
                contentType = 'font/woff';
            } else if (url.includes('Roboto-Light.ttf')) {
                localPath = 'fonts/Roboto-Light.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Medium.ttf')) {
                localPath = 'fonts/Roboto-Medium.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Regular.ttf')) {
                localPath = 'fonts/Roboto-Regular.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('Roboto-Bold.ttf')) {
                localPath = 'fonts/Roboto-Bold.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('RobotoCondensed-Regular.ttf')) {
                localPath = 'fonts/RobotoCondensed-Regular.ttf';
                contentType = 'font/ttf';
            } else if (url.includes('MaterialIcons-Regular.woff2')) {
                localPath = 'fonts/MaterialIcons-Regular.woff2';
                contentType = 'font/woff2';
            } else if (url.includes('MaterialIcons-Regular.woff')) {
                localPath = 'fonts/MaterialIcons-Regular.woff';
                contentType = 'font/woff';
            } else if (url.includes('MaterialIcons-Regular.ttf')) {
                localPath = 'fonts/MaterialIcons-Regular.ttf';
                contentType = 'font/ttf';
            }

            if (localPath) {
                const fullPath = path.join(resourcesDir, localPath);
                // console.log(`[PROXY] Sirviendo local: ${url} -> ${localPath}`);
                try {
                    const body = fs.readFileSync(fullPath);
                    return route.fulfill({ 
                        status: 200,
                        contentType: contentType,
                        body: body 
                    });
                } catch (e) {
                    console.error(`Error serving local file ${fullPath}`, e);
                    return route.abort();
                }
            } else {
                // Bloquear el resto de recursos de deporsite (fuentes, imágenes, etc.) para que no den error 403
                // y la página cargue más rápido.
                console.log(`[PROXY] Bloqueando recurso secundario: ${url}`);
                return route.abort();
            }
        }
        
        return route.continue();
    });
}

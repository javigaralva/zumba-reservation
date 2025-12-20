import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const resourcesDir = path.join(projectRoot, 'resources');

const files = [
    // CSS
    {
        url: 'https://resources.deporsite.net/css/bootstrap/3.4.1/bootstrap.min.css',
        path: 'bootstrap.min.css'
    },
    {
        url: 'https://resources.deporsite.net/css/material-icons/0.0.1/material-icons.css',
        path: 'material-icons.css'
    },
    // JS
    {
        url: 'https://resources.deporsite.net/js/jquery/3.5.0/jquery-3.5.0.min.js',
        path: 'jquery.min.js'
    },
    {
        url: 'https://resources.deporsite.net/js/bootstrap/3.4.1/bootstrap.min.js',
        path: 'bootstrap.min.js'
    },
    {
        url: 'https://resources.deporsite.net/js/material-bootstrap/0.0.1/material.js',
        path: 'material.js'
    },
    {
        url: 'https://resources.deporsite.net/js/material-bootstrap/0.0.1/ripples.js',
        path: 'ripples.js'
    },
    {
        url: 'https://resources.deporsite.net/js/moment/2.18.1/moment.min.js',
        path: 'moment.min.js'
    },
    // Fonts - Glyphicons
    {
        url: 'https://resources.deporsite.net/css/bootstrap/fonts/glyphicons-halflings-regular.woff2',
        path: 'fonts/glyphicons-halflings-regular.woff2'
    },
    {
        url: 'https://resources.deporsite.net/css/bootstrap/fonts/glyphicons-halflings-regular.woff',
        path: 'fonts/glyphicons-halflings-regular.woff'
    },
    {
        url: 'https://resources.deporsite.net/css/bootstrap/fonts/glyphicons-halflings-regular.ttf',
        path: 'fonts/glyphicons-halflings-regular.ttf'
    },
    // Fonts - Roboto
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Light.woff2',
        path: 'fonts/Roboto-Light.woff2'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Medium.woff2',
        path: 'fonts/Roboto-Medium.woff2'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Regular.woff2',
        path: 'fonts/Roboto-Regular.woff2'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Bold.woff2',
        path: 'fonts/Roboto-Bold.woff2'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Light.woff',
        path: 'fonts/Roboto-Light.woff'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Medium.woff',
        path: 'fonts/Roboto-Medium.woff'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Regular.woff',
        path: 'fonts/Roboto-Regular.woff'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Bold.woff',
        path: 'fonts/Roboto-Bold.woff'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Light.ttf',
        path: 'fonts/Roboto-Light.ttf'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Medium.ttf',
        path: 'fonts/Roboto-Medium.ttf'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Regular.ttf',
        path: 'fonts/Roboto-Regular.ttf'
    },
    {
        url: 'https://resources.deporsite.net/fonts/roboto/Roboto-Bold.ttf',
        path: 'fonts/Roboto-Bold.ttf'
    },
    // Fonts - Roboto Condensed
    {
        url: 'https://resources.deporsite.net/fonts/robotocondensed/RobotoCondensed-Regular.ttf',
        path: 'fonts/RobotoCondensed-Regular.ttf'
    },
    // Fonts - Material Icons
    {
        url: 'https://resources.deporsite.net/css/material-icons/0.0.1/MaterialIcons-Regular.woff2',
        path: 'fonts/MaterialIcons-Regular.woff2'
    },
    {
        url: 'https://resources.deporsite.net/css/material-icons/0.0.1/MaterialIcons-Regular.woff',
        path: 'fonts/MaterialIcons-Regular.woff'
    },
    {
        url: 'https://resources.deporsite.net/css/material-icons/0.0.1/MaterialIcons-Regular.ttf',
        path: 'fonts/MaterialIcons-Regular.ttf'
    }
];

async function downloadFile(url, relativePath) {
    const filePath = path.join(resourcesDir, relativePath);
    console.log(`Downloading ${url} to ${filePath}...`);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const buffer = await response.buffer();
        fs.writeFileSync(filePath, buffer);
        console.log(`Successfully downloaded ${relativePath}`);
    } catch (error) {
        console.error(`Error downloading ${relativePath}:`, error.message);
    }
}

async function main() {
    if (!fs.existsSync(resourcesDir)) {
        fs.mkdirSync(resourcesDir);
    }
    const fontsDir = path.join(resourcesDir, 'fonts');
    if (!fs.existsSync(fontsDir)) {
        fs.mkdirSync(fontsDir);
    }

    for (const file of files) {
        await downloadFile(file.url, file.path);
    }
}

main();

import path from 'path'
import { fileURLToPath } from 'url'

import notifyUsers from './notifyUsers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function takeScreenshotAndNotifyUsers({ page, text }) {

    let imageUrl
    if (page) {
        imageUrl = path.resolve(__dirname, 'screenshot.png')
        await page.screenshot({ path: imageUrl, fullPage: false });
    }

    await notifyUsers({ text, imageUrl })
}
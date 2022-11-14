import { inspect } from 'node:util'
import notifyUsers from './notifyUsers.js'
import takeScreenshotAndNotifyUsers from './takeScreenshotAndNotifyUsers.js'

export async function exitWithError({ page, error, text, takeScreenShot = true, notify = true } = {}) {
    return await exit({ page, error, text, takeScreenShot, exitCode: -1, notify })
}

export async function exitOk({ page, text, takeScreenShot = false, notify = false } = {}) {
    return await exit({ page, text, takeScreenShot, exitCode: 0, notify })
}

async function exit({ page, error, text, exitCode, takeScreenShot, notify} = {}) {
    if (text !== undefined) {
        exitCode === -1
            ? console.error(text)
            : console.log(text)
    }

    const stringifiedError = (error && inspect(error, { showHidden: true })) ?? ''
    if (stringifiedError) {
        exitCode === -1
            ? console.error(stringifiedError)
            : console.log(stringifiedError)
    }

    if (notify) {
        takeScreenShot
            ? await takeScreenshotAndNotifyUsers({ page, text })
            : await notifyUsers({ text })

        if (stringifiedError) {
            await notifyUsers({ text: stringifiedError })
        }
    }

    process.exit(exitCode)
}
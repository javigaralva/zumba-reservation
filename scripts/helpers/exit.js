import notifyUsers from './notifyUsers.js'
import takeScreenshotAndNotifyUsers from './takeScreenshotAndNotifyUsers.js'

export async function exitWithError({ page, text, takeScreenShot = true, notify = true } = {}) {
    return await exit({ page, text, takeScreenShot, exitCode: -1, notify })
}

export async function exitOk({ page, text, takeScreenShot = false, notify = false } = {}) {
    return await exit({ page, text, takeScreenShot, exitCode: 0, notify })
}

async function exit({ page, text, exitCode, takeScreenShot, notify} = {}) {
    if (text !== undefined) {
        exitCode === -1 ? console.error(text) : console.log(text)
    }

    if (notify) {
        takeScreenShot
            ? await takeScreenshotAndNotifyUsers({ page, text })
            : await notifyUsers({ text })
    }

    process.exit(exitCode)
}
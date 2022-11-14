import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG_JSON_FILE = path.resolve(__dirname, '..', '..', 'config', 'config.json')

export function setState(state) {
    const configContent = readConfig()
    configContent.state = state
    writeConfig(configContent)
}

export function getState() {
    const configContent = readConfig()
    return configContent.state
}

export function isState(state) {
    const configContent = readConfig()
    return configContent.state === state
}

export function readConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_JSON_FILE, 'utf-8'))
}

function writeConfig(configContent) {
    fs.writeFileSync(CONFIG_JSON_FILE, JSON.stringify(configContent, null, 2), 'utf-8')
}
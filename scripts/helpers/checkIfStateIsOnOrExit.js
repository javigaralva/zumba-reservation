import { isState } from '../config/config.js'
import { exitOk } from './exit.js'

export default async function checkIfStateIsOnOrExit() {
    if (!isState('ON')) {
        await exitOk({ text: 'El estado no está activo. No se realizará la reserva.', notify: false })
    }
}

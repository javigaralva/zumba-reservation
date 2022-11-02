import { isState } from '../config/config.js'

export default function checkIfStateIsOnOrExit() {
    if (!isState('ON')) {
        console.log('El estado no está activo. No se realizará la reserva.')
        process.exit(0)
    }
}

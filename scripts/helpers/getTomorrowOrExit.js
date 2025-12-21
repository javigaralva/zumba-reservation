import moment from 'moment'
import { exitWithError } from './exit.js'

export default async function getTomorrowOrExit({id, classes = []}) {
    const tomorrow = moment().add(1, 'day')

    const classFound = classes.find(({ DAY }) => tomorrow.day() === DAY)
    if (!classFound) {
        const days = classes.map(({ DAY }) => getDayOfWeekAsString(DAY)).join(' ni ')
        const correctDaysString = classes.length > 1
            ? `ni ${days}`
            : days
        await exitWithError({ text: `Mañana no es ${correctDaysString} en ${id}.`, notify: false })
    }

    tomorrow.hour(classFound.HOUR).minute(classFound.MINUTE).second(classFound.SECOND)

    return { tomorrow, classFound }
}

function getDayOfWeekAsString(day) {
    return {
        0: 'domingo',
        1: 'lunes',
        2: 'martes',
        3: 'miércoles',
        4: 'jueves',
        5: 'viernes',
        6: 'sábado',
    }[day] ?? '?'
}
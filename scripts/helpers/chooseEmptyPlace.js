import { exitWithError } from './exit.js'

export default async function chooseEmptyPlace({ page }) {
    console.log('Eligiendo un sitio libre...')
    const allPlacesNumbers = Array.from({ length: 50 }, (_, i) => String(i + 1))
    const preferencePlacesOrder = ['50', '40', '39', '29', '49', '48', '47', '46', '45', '44', '43', '42', '41', '38', '37', '35', '29', '28', '34', '33', '31', '30', '21', '27', '20', '19', '14', '13', '12', '11', '10', '1', '2', '26', '25', '24', '17', '16', '15', '3', '4', '5', '6', '7', '8', '9']
    const placesOrder = [...new Set([...preferencePlacesOrder, ...allPlacesNumbers])]

    let placeFound
    let placeNumberFound
    for (const placeNumber of placesOrder) {
        const place = await page.getByRole('cell', { name: placeNumber }).getByText(placeNumber).first()
        const placeClasses = await place.getAttribute('class')
        if (placeClasses?.includes('busy')) {
            console.log(`Lugar ${placeNumber} ocupado`)
            continue
        } else if (placeClasses) {
            console.log(`Encontrado lugar libre: ${placeNumber}`)
            placeFound = place
            placeNumberFound = placeNumber
            break
        }
    }
    if (!placeFound) {
        await exitWithError({ page, text: 'No se ha encontrado hueco' })
    }
    return {
        placeFound,
        placeNumberFound
    }
}

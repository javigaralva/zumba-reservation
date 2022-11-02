export default async function chooseEmptyPlace({ page }) {
    console.log('Eligiendo un sitio libre...')
    // Choose empty place: 40 > 50 > 41 ... 49 > 1, 2, 3, ...
    const allPlacesNumbers = Array.from({ length: 50 }, (_, i) => String(i + 1))
    const preferencePlacesOrder = ['40', '50', '41', '42', '43', '44', '45', '46', '47', '48']
    const placesOrder = [...new Set([...preferencePlacesOrder, ...allPlacesNumbers])]

    let placeFound
    for (const placeNumber of placesOrder) {
        const place = await page.getByRole('cell', { name: placeNumber }).getByText(placeNumber).first()
        const placeClasses = await place.getAttribute('class')
        if (placeClasses?.includes('busy')) {
            console.log(`Lugar ${placeNumber} ocupado`)
            continue
        } else if (placeClasses) {
            console.log(`Encontrado lugar libre: ${placeNumber}`)
            placeFound = place
            break
        }
    }
    if (!placeFound) {
        console.error('No se ha encontrado hueco')
        process.exit(-1)
    }
    return placeFound
}

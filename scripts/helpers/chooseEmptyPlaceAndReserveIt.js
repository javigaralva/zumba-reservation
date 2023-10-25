import chooseEmptyPlace from './chooseEmptyPlace.js'

export default async function chooseEmptyPlaceAndReserveIt({ page }) {
    const emptyPlace = await chooseEmptyPlace({ page })
    const { placeFound } = emptyPlace

    await placeFound.click()
    await page.locator('.btn').first().click()
    return emptyPlace
}

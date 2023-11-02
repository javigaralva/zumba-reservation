import chooseEmptyPlace from './chooseEmptyPlace.js'

export default async function chooseEmptyPlaceAndReserveIt({ browser, page }) {
    const emptyPlace = await chooseEmptyPlace({ browser, page })
    const { placeFound } = emptyPlace

    await placeFound.click()
    await page.locator('.btn').first().click()
    return emptyPlace
}

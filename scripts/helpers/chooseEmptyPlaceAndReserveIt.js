import chooseEmptyPlace from "./chooseEmptyPlace.js"

export default async function chooseEmptyPlaceAndReserveIt({ page }) {
    const placeFound = await chooseEmptyPlace({ page })

    await placeFound.click()
    await page.locator('.btn').first().click()
}

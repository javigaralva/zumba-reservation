export default async function goToReservation({ page, url }) {
    console.log('Accediendo a la página de reservas...')
    await page.goto(url)
}

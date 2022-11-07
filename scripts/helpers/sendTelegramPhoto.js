import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

export default function sendTelegramPhoto({ token, user, imageUrl }) {

    const form = new FormData()

    const photoStream = fs.createReadStream(imageUrl)
    form.append('photo', photoStream)

    const url = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${user}`
    return fetch(url, { method: 'POST', body: form })
}
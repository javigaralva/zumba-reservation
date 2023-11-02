import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

export default function sendTelegramDocument({ token, user, documentUrl }) {

    const form = new FormData()

    const documentStream = fs.createReadStream(documentUrl)
    form.append('chat_id', user)
    form.append('document', documentStream)

    const url = `https://api.telegram.org/bot${token}/sendDocument`
    return fetch(url, { method: 'POST', body: form })
}
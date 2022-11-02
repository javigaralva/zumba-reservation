import fetch from 'node-fetch'

export default function sendTelegramMessage ({ token, user, text }) {
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${user}&text=${text}`
    return fetch(url)
}
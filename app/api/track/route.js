import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const h = request.headers
    const city = h.get('x-vercel-ip-city')
    const region = h.get('x-vercel-ip-country-region')
    const country = h.get('x-vercel-ip-country')
    const ip =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      h.get('x-real-ip') ||
      'bilinmiyor'
    const referer = h.get('referer') || 'doğrudan'

    const decodedCity = city ? decodeURIComponent(city) : null
    const konum =
      [decodedCity, region, country].filter(Boolean).join(', ') ||
      'Konum bilinmiyor'

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) {
      return NextResponse.json({ ok: false, error: 'Telegram env eksik' }, { status: 500 })
    }

    const zaman = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })

    const text =
      `🟢 Yeni ziyaretçi — deftertut.com\n\n` +
      `📍 Konum: ${konum}\n` +
      `🌐 IP: ${ip}\n` +
      `🔗 Kaynak: ${referer}\n` +
      `🕒 ${zaman}`

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('track error', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Vercel Cron secret koruması — Bearer token ile CRON_SECRET eşleşmeli.
// Her iki taraf da trim edilir: env'e veya header'a sızmış boşluk/newline 401'e yol açmasın.

export async function GET(request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  const secret = (process.env.CRON_SECRET || '').trim()

  if (!secret || token !== secret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Hafif SELECT — Supabase'i aktif say
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keep-alive Supabase error:', error)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase ping failed',
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase ping successful — project kept alive',
      rows_pinged: data?.length || 0,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('Keep-alive unexpected error:', err)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Unexpected error',
        error: err.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
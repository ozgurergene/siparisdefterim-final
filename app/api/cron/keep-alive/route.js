import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Vercel Cron secret koruması — env'de tanımlı CRON_SECRET ile eşleşmeli
// Bu sayede sadece Vercel cron job'ı bu endpoint'i çağırabilir, dışarıdan kimse atamaz

export async function GET(request) {
  // Authorization header kontrolü (Vercel Cron otomatik gönderir)
  const authHeader = request.headers.get('authorization')
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Service role key ile Supabase'e bağlan (RLS bypass et, sadece ping için)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Hafif bir SELECT — sadece 1 satır oku, Supabase aktif say
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

    // Başarılı ping
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
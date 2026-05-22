// app/api/plantas/consejos/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body?.planta || typeof body.planta !== 'string') {
    return NextResponse.json({ error: 'Nombre de planta requerido' }, { status: 400 })
  }

  const planta = body.planta.trim().slice(0, 100)

  if (!planta) {
    return NextResponse.json({ error: 'Nombre de planta inválido' }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'Sos un experto en plantas y jardinería. Respondés ÚNICAMENTE con JSON válido, sin texto extra, sin backticks, sin markdown.'
            },
            {
              role: 'user',
              content: `Dame 3 consejos para cuidar una "${planta}". Respondé SOLO con este JSON exacto:
{"consejos":[{"emoji":"💧","titulo":"Riego","texto":"..."},{"emoji":"☀️","titulo":"Luz","texto":"..."},{"emoji":"🌱","titulo":"Sustrato","texto":"..."}]}
Cada texto entre 15 y 30 palabras, en español rioplatense.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      }
    )

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      console.error('Groq error:', response.status, JSON.stringify(errorBody))
      return NextResponse.json({ error: 'Error al consultar la IA' }, { status: 502 })
    }

    const data = await response.json()
    const rawText = data.choices?.[0]?.message?.content ?? ''

    if (!rawText) {
      console.error('Groq devolvió texto vacío:', JSON.stringify(data))
      return NextResponse.json({ error: 'La IA no devolvió respuesta' }, { status: 502 })
    }

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No se encontró JSON en:', rawText)
      return NextResponse.json({ error: 'Respuesta inesperada de la IA' }, { status: 502 })
    }

    let parsed
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('Error parseando JSON:', jsonMatch[0])
      return NextResponse.json({ error: 'Respuesta inesperada de la IA' }, { status: 502 })
    }

    if (!Array.isArray(parsed?.consejos) || parsed.consejos.length === 0) {
      return NextResponse.json({ error: 'Respuesta inesperada de la IA' }, { status: 502 })
    }

    return NextResponse.json({ planta, consejos: parsed.consejos })
  } catch (err) {
    console.error('Error en /api/plantas/consejos:', err)
    return NextResponse.json({ error: 'Error de conexión con la IA' }, { status: 500 })
  }
}
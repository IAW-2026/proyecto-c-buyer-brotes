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

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Sos un experto en plantas y jardinería. Dame exactamente 3 consejos prácticos y concisos para cuidar una "${planta}".

Respondé SOLO con un JSON válido con esta estructura, sin texto adicional ni backticks:
{
  "consejos": [
    { "emoji": "💧", "titulo": "Riego", "texto": "..." },
    { "emoji": "☀️", "titulo": "Luz", "texto": "..." },
    { "emoji": "🌱", "titulo": "Sustrato", "texto": "..." }
  ]
}

Cada texto debe tener entre 15 y 30 palabras. Usá emojis relevantes para cada consejo. Respondé en español rioplatense.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400
          }
        })
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Error al consultar la IA' }, { status: 502 })
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    const cleaned = rawText.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Respuesta inesperada de la IA' }, { status: 502 })
    }

    return NextResponse.json({ planta, consejos: parsed.consejos })
  } catch {
    return NextResponse.json({ error: 'Error de conexión con la IA' }, { status: 500 })
  }
}
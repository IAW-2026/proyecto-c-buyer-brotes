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

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Sos un experto en plantas y jardinería. Dame exactamente 3 consejos prácticos y concisos para cuidar una "${planta}".

Respondé ÚNICAMENTE con un JSON válido con esta estructura exacta, sin texto adicional, sin explicaciones, sin backticks, sin markdown:
{"consejos":[{"emoji":"💧","titulo":"Riego","texto":"..."},{"emoji":"☀️","titulo":"Luz","texto":"..."},{"emoji":"🌱","titulo":"Sustrato","texto":"..."}]}

Cada texto debe tener entre 15 y 30 palabras. Usá emojis relevantes para cada consejo. Respondé en español rioplatense.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
            // Forzar respuesta JSON
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      console.error('Gemini status:', response.status, JSON.stringify(errorBody))
      return NextResponse.json({ error: 'Error al consultar la IA' }, { status: 502 })
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    if (!rawText) {
      console.error('Gemini devolvió texto vacío:', JSON.stringify(data))
      return NextResponse.json({ error: 'La IA no devolvió una respuesta' }, { status: 502 })
    }

    // Extracción robusta: busca el primer objeto JSON en el texto,
    // independientemente de si viene envuelto en markdown o con texto extra
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No se encontró JSON en la respuesta:', rawText)
      return NextResponse.json({ error: 'Respuesta inesperada de la IA' }, { status: 502 })
    }

    let parsed
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Error al parsear JSON:', jsonMatch[0], parseError)
      return NextResponse.json({ error: 'Respuesta inesperada de la IA' }, { status: 502 })
    }

    if (!Array.isArray(parsed?.consejos) || parsed.consejos.length === 0) {
      console.error('Estructura JSON inválida:', parsed)
      return NextResponse.json({ error: 'Respuesta inesperada de la IA' }, { status: 502 })
    }

    return NextResponse.json({ planta, consejos: parsed.consejos })
  } catch (err) {
    console.error('Error en /api/plantas/consejos:', err)
    return NextResponse.json({ error: 'Error de conexión con la IA' }, { status: 500 })
  }
}
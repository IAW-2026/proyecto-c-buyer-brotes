import { NextResponse } from 'next/server'

// Códigos WMO de clima → https://open-meteo.com/en/docs
function interpretarClima(codigo: number, temperatura: number): {
  descripcion: string
  recomiendaRiego: boolean
  mensaje: string
  emoji: string
  color: string
} {
  const estaLloviendo = codigo >= 51 && codigo <= 99
  const estaDespejado = codigo === 0 || codigo === 1
  const estaJubladoONublado = codigo === 2 || codigo === 3
  const esMuyCalido = temperatura >= 28
  const esFrio = temperatura <= 12

  if (estaLloviendo) {
    return {
      descripcion: 'Lluvia',
      recomiendaRiego: false,
      mensaje: 'No riegues hoy — la lluvia se encarga',
      emoji: '🌧️',
      color: '#5B8DB8'
    }
  }

  if (esFrio) {
    return {
      descripcion: 'Frío',
      recomiendaRiego: false,
      mensaje: 'Evitá regar, el frío retiene la humedad',
      emoji: '🥶',
      color: '#7BA0C0'
    }
  }

  if (estaDespejado && esMuyCalido) {
    return {
      descripcion: 'Soleado y caluroso',
      recomiendaRiego: true,
      mensaje: '¡Regá tus plantas hoy, hace calor!',
      emoji: '☀️',
      color: '#E07A5F'
    }
  }

  if (estaDespejado) {
    return {
      descripcion: 'Despejado',
      recomiendaRiego: true,
      mensaje: 'Buen momento para regar por la mañana',
      emoji: '🌤️',
      color: '#7BA05D'
    }
  }

  if (estaJubladoONublado) {
    return {
      descripcion: 'Nublado',
      recomiendaRiego: false,
      mensaje: 'Podés esperar un día más para regar',
      emoji: '☁️',
      color: '#9BA8A0'
    }
  }

  return {
    descripcion: 'Variable',
    recomiendaRiego: false,
    mensaje: 'Revisá la tierra antes de regar',
    emoji: '🌡️',
    color: '#7BA05D'
  }
}

export async function GET() {
  try {
    const lat = -38.7196
    const lon = -62.2724

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=America%2FArgentina%2FBuenos_Aires`,
      { next: { revalidate: 1800 } } // cache 30 minutos
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Error al consultar el clima' }, { status: 502 })
    }

    const data = await res.json()
    const { temperature, windspeed, weathercode } = data.current_weather

    const interpretacion = interpretarClima(weathercode, temperature)

    return NextResponse.json({
      temperatura: Math.round(temperature),
      viento: Math.round(windspeed),
      codigo: weathercode,
      ...interpretacion
    })
  } catch {
    return NextResponse.json({ error: 'No se pudo obtener el clima' }, { status: 500 })
  }
}
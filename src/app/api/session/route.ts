import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Usar URL base alternativa si está definida en variables de entorno
    const apiBaseUrl = process.env.API_BASE_URL || "https://api.openai.com";
    
    // Verificar que la API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY no está configurada en variables de entorno");
      return NextResponse.json(
        { error: "Configuración de API incompleta" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${apiBaseUrl}/v1/realtime/sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error en la respuesta de OpenAI:", response.status, errorData);
      return NextResponse.json(
        { error: "Error en la comunicación con OpenAI", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en /session:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

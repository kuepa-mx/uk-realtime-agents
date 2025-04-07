import { RefObject } from "react";

export async function createRealtimeConnection(
  EPHEMERAL_KEY: string,
  audioElement: RefObject<HTMLAudioElement | null>,
  apiBaseUrl: string = "https://api.openai.com"
): Promise<{ pc: RTCPeerConnection; dc: RTCDataChannel }> {
  // Configuración de ICE servers para mejorar la conectividad
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ]
  });

  // Manejo de eventos de conexión
  pc.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", pc.iceConnectionState);
  };

  pc.ontrack = (e) => {
    if (audioElement.current) {
      audioElement.current.srcObject = e.streams[0];
    }
  };

  // Manejo de errores al obtener el micrófono
  try {
    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
    pc.addTrack(ms.getTracks()[0]);
  } catch (error) {
    console.error("Error al acceder al micrófono:", error);
    throw new Error("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
  }

  const dc = pc.createDataChannel("oai-events");
  
  // Añadir listeners para el data channel
  dc.onopen = () => console.log("Data channel abierto");
  dc.onclose = () => console.log("Data channel cerrado");
  dc.onerror = (error) => console.error("Error en data channel:", error);

  // Crear y enviar oferta
  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (!pc.localDescription || !pc.localDescription.sdp) {
      throw new Error("Error al crear la descripción local SDP");
    }

    const sdpResponse = await fetch(`${apiBaseUrl}/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17`, {
      method: "POST",
      body: pc.localDescription.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    if (!sdpResponse.ok) {
      const errorText = await sdpResponse.text();
      console.error("Error al establecer conexión con OpenAI:", sdpResponse.status, errorText);
      throw new Error(`Error al establecer conexión con OpenAI: ${sdpResponse.status}`);
    }

    const answerSdp = await sdpResponse.text();
    const answer: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: answerSdp,
    };

    await pc.setRemoteDescription(answer);
  } catch (error) {
    console.error("Error en la configuración WebRTC:", error);
    // Cerrar recursos existentes antes de lanzar error
    pc.close();
    throw error;
  }

  return { pc, dc };
} 
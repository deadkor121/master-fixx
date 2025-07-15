// src/hooks/useChatSocket.ts
import { useEffect, useRef } from "react";

export function useChatSocket({
  bookingId,
  token,
  onMessage,
}: {
  bookingId: number;
  token: string | null;
  onMessage: (message: any) => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    const ws = new WebSocket(`ws://localhost:5000?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("📡 WebSocket підключено");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        onMessage(data.data); // нове повідомлення
      }
    };

    ws.onerror = (e) => {
      console.error("❌ WebSocket error:", e);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket відключено");
    };

    return () => {
      ws.close();
    };
  }, [token]);

  const send = (text: string, receiverId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          bookingId,
          text,
          receiverId,
        })
      );
    }
  };

  return { send };
}

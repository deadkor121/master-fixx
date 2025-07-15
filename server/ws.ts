import { WebSocketServer, type WebSocket } from "ws";
import jwt from "jsonwebtoken";
import type { Server } from "http";
import { storage } from "./storage";
import { type ChatMessage, type InsertChatMessage } from "./db-storage";

interface ExtWebSocket extends WebSocket {
  userId?: number;
}

const clients = new Map<number, Set<ExtWebSocket>>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: ExtWebSocket, req) => {
    const token = new URLSearchParams(req.url?.split("?")[1] || "").get("token");

    if (!token) {
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
      ws.userId = decoded.id;

      if (!clients.has(ws.userId)) {
        clients.set(ws.userId, new Set());
      }
      clients.get(ws.userId)!.add(ws);

      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data.toString()) as {
            bookingId: number;
            text: string;
            receiverId: number;
          };

          const chatMessage: InsertChatMessage = {
            bookingId: message.bookingId,
            senderId: ws.userId!,
            receiverId: message.receiverId,
            text: message.text,
            sentAt: new Date().toISOString(),
          };

          const saved = await storage.createMessage(chatMessage);

          const receivers = clients.get(message.receiverId);
          if (receivers) {
            for (const client of receivers) {
              client.send(JSON.stringify({ type: "message", data: saved }));
            }
          }

          ws.send(JSON.stringify({ type: "ack", data: saved }));
        } catch (err) {
          console.error("WS Message Error:", err);
        }
      });

      ws.on("close", () => {
        if (ws.userId) {
          clients.get(ws.userId)?.delete(ws);
        }
      });
    } catch (err) {
      ws.close();
    }
  });
}

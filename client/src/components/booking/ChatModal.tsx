import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function ChatModal({
  open,
  onClose,
  booking,
  currentUser,
}: any) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  // Підключення WebSocket
  const { send } = useChatSocket({
    bookingId: booking.id,
    token,
    onMessage: (msg) => setMessages((prev) => [...prev, msg]),
  });

  // Завантажити історію
  useEffect(() => {
    if (!open) return;
    fetch(`/api/messages/${booking.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [open, booking.id]);

  // Відправка повідомлення
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    send(message, booking.masterId); // або .clientId, в залежності від ролі
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4">Melding til mester</h2>
        <div className="mb-4 h-40 bg-gray-100 rounded p-2 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${
                msg.senderId === currentUser?.id ? "text-right" : "text-left"
              }`}
            >
              <div className="inline-block px-2 py-1 rounded bg-blue-100">
                {msg.text}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(msg.sentAt).toLocaleString()} —{" "}
                {msg.senderId === currentUser?.id
                  ? "Вы"
                  : msg.senderName || "Собеседник"}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            className="flex-1 border rounded p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <Button type="submit">Отправить</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

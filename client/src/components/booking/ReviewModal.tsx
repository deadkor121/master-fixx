import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ReviewModal({ open, onClose, booking, master }: any) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // TODO: отправить отзыв на сервер через fetch("/api/reviews", ...)
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4">Legg igjen en vurdering</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Rangering:</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Kommentar:</label>
            <textarea
              className="w-full border rounded p-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-white">
            Send vurdering
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
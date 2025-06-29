// Типы из вашего кода
export type ReviewWithDetails = {
    id: number;
    masterId: number;
    clientId: number;
    bookingId: number;
    rating: number;
    comment: string;
    clientName: string;
    createdAt: Date; // или string, если так храните
    master: any;     // упрощено
    client: any;     // упрощено
  };
  
  // Альтернативный вариант (например, из моков или API)
  type SimpleReview = {
    name: string;
    rating: number;
    text: string;
    date: string;
  };
  
  // Нормализованный тип для рендера
  type NormalizedReview = {
    name: string;
    rating: number;
    text: string;
    date: string;
  };
  
import type { ReviewWithDetails } from "../types/review";

type SimpleReview = {
  name: string;
  rating: number;
  text: string;
  date: string;
};

type NormalizedReview = {
  name: string;
  rating: number;
  text: string;
  date: string;
};

function normalizeReview(review: ReviewWithDetails | SimpleReview) {
    if ("name" in review) {
      // тут review — SimpleReview, можно использовать review.name, review.text, review.date
      return {
        name: review.name,
        text: review.text,
        date: review.date,
      };
    } else {
      // тут review — ReviewWithDetails
      return {
        name: review.clientName,  // например, clientName вместо name
        text: review.comment,     // comment вместо text
        date: review.createdAt,   // createdAt вместо date
      };
    }
  }
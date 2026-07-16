export interface ICreateReviewPayload {
  rentalOrderId: string;
  gearItemId: string;
  rating: number;
  comment?: string;
}
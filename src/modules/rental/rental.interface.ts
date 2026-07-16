export interface ICreateRentalPayload {
  gearItemId: string;
  quantity: number;
  rentalStartDate: string;
  rentalEndDate: string;
  pickupAddress?: string;
  notes?: string;
}

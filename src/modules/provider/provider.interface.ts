import {
  GearCondition,
  Prisma,
  RentalStatus,
} from "../../../generated/prisma/client";

export interface IAddGearPayload {
  categoryId: string;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  dailyRentalPrice: number;
  depositAmount?: number;
  totalStock: number;
  availableStock?: number;
  condition: GearCondition;
  imageUrl?: string;
  specifications?: Prisma.InputJsonValue;
  isActive?: boolean;
}

export interface IUpdateGearPayload {
  categoryId?: string;
  name?: string;
  description?: string;
  brand?: string;
  model?: string;
  dailyRentalPrice?: number;
  depositAmount?: number;
  totalStock?: number;
  availableStock?: number;
  condition?: GearCondition;
  imageUrl?: string;
  specifications?: Prisma.InputJsonValue;
  isActive?: boolean;
}

export type OrderStatusUpdate =
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export const activeOrderStatuses: RentalStatus[] = [
  RentalStatus.PLACED,
  RentalStatus.CONFIRMED,
  RentalStatus.PAID,
  RentalStatus.PICKED_UP,
];

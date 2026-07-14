import { GearCondition } from "../../../generated/prisma/client";

export interface IGearFilters {
  searchTerm?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  availableOnly?: boolean;
}

export const gearSearchableFields: string[] = ["name", "brand", "description"];
export const gearFilterableFields: string[] = [
  "categoryId",
  "brand",
  "minPrice",
  "maxPrice",
  "isActive",
  "availableOnly",
];

export const gearConditionEnum: GearCondition[] = [
  "NEW",
  "EXCELLENT",
  "GOOD",
  "FAIR",
];

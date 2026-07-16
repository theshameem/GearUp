import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const route = Router();

route.post("/gear", auth(UserRole.CUSTOMER), rentalController.createRental);

route.get("/rentals", auth(UserRole.CUSTOMER), rentalController.getUserRentals);

route.get(
  "/rentals/:id",
  auth(UserRole.CUSTOMER),
  rentalController.getRentalById,
);

export const rentalRoutes = route;

import { Router } from "express";
import { rentalController } from "./rental.controller";

const route = Router();

route.post("/gear", rentalController.createRental);

route.get("/rentals", rentalController.getUserRentals);

route.get("/rentals/:id", rentalController.getRentalById);

export const rentalRoutes = route;

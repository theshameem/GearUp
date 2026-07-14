import { Router } from "express";
import { adminController } from "./admin.controller";

const route = Router();

route.get("/users", adminController.getAllUsers);

route.patch("/users/:id", adminController.updateUserById);

route.get("/gear", adminController.getGearList);

route.get("/rentals", adminController.getRentalList);

export const adminRoutes = route;

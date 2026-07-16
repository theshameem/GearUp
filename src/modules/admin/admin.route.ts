import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const route = Router();

route.use(auth(UserRole.ADMIN));

route.get("/users", adminController.getAllUsers);
route.patch("/users/:id", adminController.updateUserById);

route.get("/gear", adminController.getGearList);

route.get("/rentals", adminController.getRentalList);

export const adminRoutes = route;
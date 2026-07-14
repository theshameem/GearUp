import { Router } from "express";
import { gearController } from "./gear.controller";

const route = Router();

route.get("/gear", gearController.getGearList);

route.get("/gear/:id", gearController.getGearDetailsById);

route.get("/categories", gearController.getGearCategoryList);

export const gearRoutes = route;

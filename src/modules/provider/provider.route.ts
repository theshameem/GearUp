import { Router } from "express";
import { providerController } from "./provider.controller";

const route = Router();

route.post("/gear", providerController.addGearToInventory);

route.put("/gear/:id", providerController.updateGearById);

route.delete("/gear/:id", providerController.deleteGearById);

route.get("/orders", providerController.getProvidersIncomingOrder);

route.get("/orders/:id", providerController.updateRentalOrderStatusById);

export const providerRoutes = route;

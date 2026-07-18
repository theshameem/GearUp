import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { providerController } from "./provider.controller";

const route = Router();

route.post(
  "/gear",
  auth(UserRole.PROVIDER),
  providerController.addGearToInventory,
);

route.put(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.updateGearById,
);

route.delete(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.deleteGearById,
);

route.get(
  "/orders",
  auth(UserRole.PROVIDER),
  providerController.getProvidersIncomingOrder,
);

route.patch(
  "/orders/:id",
  auth(UserRole.PROVIDER),
  providerController.updateRentalOrderStatusById,
);

export const providerRoutes = route;

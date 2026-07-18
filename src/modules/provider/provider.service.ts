import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  activeOrderStatuses,
  IAddGearPayload,
  IUpdateGearPayload,
  OrderStatusUpdate,
} from "./provider.interface";

const addGearToInventory = async (
  providerId: string,
  payload: IAddGearPayload,
) => {
  const {
    categoryId,
    name,
    description,
    brand,
    model,
    dailyRentalPrice,
    depositAmount,
    totalStock,
    availableStock,
    condition,
    imageUrl,
    specifications,
    isActive,
  } = payload;

  await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  return prisma.gearItem.create({
    data: {
      providerId,
      categoryId,
      name,
      description,
      brand,
      model,
      dailyRentalPrice: new Prisma.Decimal(dailyRentalPrice),
      depositAmount:
        depositAmount !== undefined ? new Prisma.Decimal(depositAmount) : 0,
      totalStock,
      availableStock: availableStock ?? totalStock,
      condition,
      imageUrl,
      specifications: specifications ?? Prisma.JsonNull,
      isActive: isActive ?? true,
    },
  });
};

const updateGearById = async (
  providerId: string,
  gearId: string,
  payload: IUpdateGearPayload,
) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: { id: gearId },
  });

  if (gear.providerId !== providerId) {
    throw new Error("You are not authorized to modify this gear item");
  }

  const {
    categoryId,
    name,
    description,
    brand,
    model,
    dailyRentalPrice,
    depositAmount,
    totalStock,
    availableStock,
    condition,
    imageUrl,
    specifications,
    isActive,
  } = payload;

  return prisma.gearItem.update({
    where: { id: gearId },
    data: {
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      name,
      description,
      brand,
      model,
      dailyRentalPrice:
        dailyRentalPrice !== undefined
          ? new Prisma.Decimal(dailyRentalPrice)
          : undefined,
      depositAmount:
        depositAmount !== undefined
          ? new Prisma.Decimal(depositAmount)
          : undefined,
      totalStock,
      availableStock,
      condition,
      imageUrl,
      specifications,
      isActive,
    },
  });
};

const deleteGearById = async (providerId: string, gearId: string) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: { id: gearId },
    include: {
      _count: {
        select: {
          orderItems: {
            where: {
              rentalOrder: {
                status: { in: activeOrderStatuses },
              },
            },
          },
        },
      },
    },
  });

  if (gear.providerId !== providerId) {
    throw new Error("You are not authorized to modify this gear item");
  }

  if (gear._count.orderItems > 0) {
    throw new Error(
      "Cannot delete gear with active rental orders. Mark it inactive instead.",
    );
  }

  await prisma.gearItem.delete({
    where: { id: gearId },
  });

  return { id: gearId };
};

const getProvidersIncomingOrder = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      items: {
        some: {
          gearItem: { providerId },
        },
      },
      status: { in: activeOrderStatuses },
    },
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      items: {
        where: {
          gearItem: { providerId },
        },
        include: {
          gearItem: {
            select: { id: true, name: true, brand: true, imageUrl: true },
          },
        },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          status: true,
          paymentMethod: true,
          paidAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateRentalOrderStatusById = async (
  providerId: string,
  rentalOrderId: string,
  nextStatus: OrderStatusUpdate,
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: rentalOrderId },
    include: {
      items: {
        include: {
          gearItem: { select: { providerId: true } },
        },
      },
    },
  });

  const ownsAtLeastOneItem = rental.items.some(
    (item) => item.gearItem.providerId === providerId,
  );

  if (!ownsAtLeastOneItem) {
    throw new Error("You are not authorized to update this rental order");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.rentalOrder.update({
      where: { id: rentalOrderId },
      data: { status: nextStatus },
    });

    if (nextStatus === "RETURNED" || nextStatus === "CANCELLED") {
      for (const item of rental.items) {
        if (item.gearItem.providerId !== providerId) continue;
        await tx.gearItem.update({
          where: { id: item.gearItemId },
          data: {
            availableStock: { increment: item.quantity },
          },
        });
      }
    }

    return updated;
  });
};

export const providerService = {
  addGearToInventory,
  updateGearById,
  deleteGearById,
  getProvidersIncomingOrder,
  updateRentalOrderStatusById,
};

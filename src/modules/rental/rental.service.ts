import { Prisma, RentalStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload } from "./rental.interface";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const generateOrderNumber = (): string => {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 10000)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `RNT-${stamp}-${rand}`;
};

const createRentalIntoDb = async (
  customerId: string,
  payload: ICreateRentalPayload,
) => {
  const startDate = new Date(payload.rentalStartDate);
  const endDate = new Date(payload.rentalEndDate);

  if (endDate <= startDate) {
    throw new Error("rentalEndDate must be after rentalStartDate");
  }

  const rentalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / MS_PER_DAY,
  );

  const gear = await prisma.gearItem.findUniqueOrThrow({
    where: { id: payload.gearItemId },
  });

  if (!gear.isActive) {
    throw new Error("Gear item is inactive");
  }

  if (gear.availableStock < payload.quantity) {
    throw new Error(
      `Insufficient stock for gear item "${gear.name}". Available: ${gear.availableStock}, requested: ${payload.quantity}`,
    );
  }

  const pricePerDay = new Prisma.Decimal(gear.dailyRentalPrice);
  const subtotal = pricePerDay.mul(payload.quantity).mul(rentalDays);
  const totalAmount = subtotal;
  const depositAmount = new Prisma.Decimal(gear.depositAmount).mul(
    payload.quantity,
  );

  const orderNumber = generateOrderNumber();

  return prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rentalOrder.create({
      data: {
        orderNumber,
        customerId,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        totalAmount,
        depositAmount,
        pickupAddress: payload.pickupAddress,
        notes: payload.notes,
        status: RentalStatus.PLACED,
        items: {
          create: {
            gearItemId: gear.id,
            quantity: payload.quantity,
            pricePerDay,
            rentalDays,
            subtotal,
          },
        },
      },
      include: {
        items: {
          include: {
            gearItem: {
              select: {
                id: true,
                name: true,
                brand: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    await tx.gearItem.update({
      where: { id: gear.id },
      data: {
        availableStock: {
          decrement: payload.quantity,
        },
      },
    });

    return rentalOrder;
  });
};

const getUserRentals = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { customerId },
    include: {
      items: {
        include: {
          gearItem: {
            select: {
              id: true,
              name: true,
              brand: true,
              imageUrl: true,
            },
          },
        },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          status: true,
          paymentMethod: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getRentalsById = async (customerId: string, rentalId: string) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: rentalId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      items: {
        include: {
          gearItem: {
            select: {
              id: true,
              name: true,
              brand: true,
              imageUrl: true,
            },
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
          transactionId: true,
        },
      },
    },
  });

  if (rental.customerId !== customerId) {
    throw new Error("You are not authorized to view this rental order");
  }

  return rental;
};

export const rentalService = {
  createRentalIntoDb,
  getUserRentals,
  getRentalsById,
};

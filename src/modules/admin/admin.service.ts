import { UserRole, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    omit: {
      password: true,
    },
  });

  return users;
};

const updateUserById = async (
  userId: string,
  payload: { status?: UserStatus; role?: UserRole },
) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: payload.status,
      role: payload.role,
    },
  });

  return updatedUser;
};

const getGearList = async () => {
  return prisma.gearItem.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getRentalList = async () => {
  return prisma.rentalOrder.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          gearItem: {
            select: {
              id: true,
              name: true,
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

export const adminService = {
  getAllUsers,
  updateUserById,
  getGearList,
  getRentalList,
};

import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IGearFilters } from "./gear.interface";

const buildGearWhere = (filters: IGearFilters): Prisma.GearItemWhereInput => {
  const where: Prisma.GearItemWhereInput = {};

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  } else {
    where.isActive = true;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.brand) {
    where.brand = { equals: filters.brand };
  }

  if (filters.availableOnly) {
    where.availableStock = { gt: 0 };
  }

  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: "insensitive" } },
      { brand: { contains: filters.searchTerm, mode: "insensitive" } },
      { description: { contains: filters.searchTerm, mode: "insensitive" } },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.dailyRentalPrice = {};
    if (filters.minPrice !== undefined) {
      where.dailyRentalPrice.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.dailyRentalPrice.lte = filters.maxPrice;
    }
  }

  return where;
};

const getGearList = async (filters: IGearFilters) => {
  const where = buildGearWhere(filters);

  const items = await prisma.gearItem.findMany({
    where,
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
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return items.map((item) => {
    const ratings = item.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    const { reviews, ...rest } = item;
    return {
      ...rest,
      averageRating: Number(averageRating.toFixed(2)),
      reviewCount: ratings.length,
    };
  });
};

const getGearDetailsById = async (id: string) => {
  const item = await prisma.gearItem.findUniqueOrThrow({
    where: { id },
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
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const ratings = item.reviews.map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  const { reviews, ...rest } = item;
  return {
    ...rest,
    averageRating: Number(averageRating.toFixed(2)),
    reviewCount: ratings.length,
    reviews,
  };
};

const getGearCategoryList = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          gearItems: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    activeGearItemCount: category._count.gearItems,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }));
};

export const gearService = {
  getGearList,
  getGearDetailsById,
  getGearCategoryList,
};

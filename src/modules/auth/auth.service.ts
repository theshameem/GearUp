import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ILoginUser, RegisterUserPayload } from "./auth.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profileImage, role } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profileImage,
      role,
    },
    omit: {
      password: true,
    },
  });

  return createdUser;
};

const loginUser = async (payload: ILoginUser) => {};

const loggedInUserDetails = async (userId: string) => {};

export const authService = {
  loginUser,
  loggedInUserDetails,
  registerUserIntoDB,
};

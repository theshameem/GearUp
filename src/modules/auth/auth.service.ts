import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
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

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    status: user.status,
    profileImage: user.profileImage,
    address: user.address,
    phone: user.phone,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

const loggedInUserDetails = async (email: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const authService = {
  loginUser,
  loggedInUserDetails,
  registerUserIntoDB,
};

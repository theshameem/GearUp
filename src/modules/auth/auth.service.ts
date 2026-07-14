import { ILoginUser, RegisterUserPayload } from "./auth.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {};

const loginUser = async (payload: ILoginUser) => {};

const loggedInUserDetails = async (userId: string) => {};

export const authService = {
  loginUser,
  loggedInUserDetails,
  registerUserIntoDB,
};

import { UserRole } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}

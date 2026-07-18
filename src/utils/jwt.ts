import jwt, {
  Algorithm,
  JwtPayload,
  SignOptions,
  VerifyOptions,
} from "jsonwebtoken";

const ALGORITHM: Algorithm = "HS256";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: ALGORITHM,
  } as SignOptions);
};

const verifyToken = (token: string, secret: string) => {
  try {
    const options: VerifyOptions = {
      algorithms: [ALGORITHM],
    };
    const verifiedToken = jwt.verify(token, secret, options);

    return { success: true, data: verifiedToken };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
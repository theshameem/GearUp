import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const isProduction = process.env.NODE_ENV === "production";

export default {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: isProduction,
  PORT: Number(process.env.PORT) || 5000,
  database_url: required("DATABASE_URL"),
  app_url: required("APP_URL"),
  bcrypt_salt_rounds: required("BCRYPT_SALT_ROUNDS"),
  jwt_access_secret: required("JWT_ACCESS_SECRET"),
  jwt_refresh_secret: required("JWT_REFRESH_SECRET"),
  jwt_access_expires_in: required("JWT_ACCESS_EXPIRES_IN"),
  jwt_refresh_expires_in: required("JWT_REFRESH_EXPIRES_IN"),
  stripe_secret_key: required("STRIPE_SECRET_KEY"),
  stripe_webhook_secret: required("STRIPE_WEBHOOK_SECRET"),
  stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID ?? "",
};

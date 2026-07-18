import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const toInt = (value: string | undefined, fallback: number): number => {
  if (value === undefined) return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
};

const isProduction = process.env.NODE_ENV === "production";

const config = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: isProduction,
  PORT: toInt(process.env.PORT, 5000),
  database_url: process.env.DATABASE_URL ?? "",
  app_url: process.env.APP_URL ?? "",
  bcrypt_salt_rounds: toInt(process.env.BCRYPT_SALT_ROUNDS, 10),
  jwt_access_secret: process.env.JWT_ACCESS_SECRET ?? "",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET ?? "",
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN ?? "1d",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  stripe_secret_key: process.env.STRIPE_SECRET_KEY ?? "",
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID ?? "",
};

export const validateEnv = (): void => {
  const required: Array<[string, string]> = [
    ["DATABASE_URL", config.database_url],
    ["APP_URL", config.app_url],
    ["JWT_ACCESS_SECRET", config.jwt_access_secret],
    ["JWT_REFRESH_SECRET", config.jwt_refresh_secret],
    ["STRIPE_SECRET_KEY", config.stripe_secret_key],
    ["STRIPE_WEBHOOK_SECRET", config.stripe_webhook_secret],
  ];

  const missing = required
    .filter(([, value]) => !value || value.length === 0)
    .map(([key]) => key);

  if (missing.length > 0 && isProduction) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  if (missing.length > 0) {
    console.warn(
      `Warning: missing environment variables (non-fatal in dev): ${missing.join(", ")}`,
    );
  }
};

export default config;

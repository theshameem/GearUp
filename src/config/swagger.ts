import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Application } from "express";
import config from "./index";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "GearUp API",
      version: "1.0.0",
      description:
        "REST API for the GearUp sports & outdoor equipment rental platform.",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT || 5000}/api`,
        description: "Local development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Paste your access token (without 'Bearer ' prefix).",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "Refresh token cookie set by /api/auth/login.",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            statusCode: { type: "integer", example: 400 },
            name: { type: "string", example: "Error" },
            message: { type: "string", example: "Error message" },
            error: { type: "string" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            statusCode: { type: "integer", example: 200 },
            message: { type: "string", example: "Success" },
            data: { type: "object", nullable: true },
          },
        },
        UserRole: {
          type: "string",
          enum: ["CUSTOMER", "PROVIDER", "ADMIN"],
        },
        UserStatus: {
          type: "string",
          enum: ["ACTIVE", "SUSPENDED"],
        },
        GearCondition: {
          type: "string",
          enum: ["NEW", "EXCELLENT", "GOOD", "FAIR"],
        },
        RentalStatus: {
          type: "string",
          enum: [
            "PLACED",
            "CONFIRMED",
            "PAID",
            "PICKED_UP",
            "RETURNED",
            "CANCELLED",
          ],
        },
        PaymentMethod: { type: "string", enum: ["STRIPE"] },
        PaymentStatus: {
          type: "string",
          enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            imageUrl: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        GearItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            providerId: { type: "string", format: "uuid" },
            categoryId: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            brand: { type: "string", nullable: true },
            model: { type: "string", nullable: true },
            dailyRentalPrice: { type: "string", example: "12.50" },
            depositAmount: { type: "string", example: "50.00" },
            totalStock: { type: "integer", example: 10 },
            availableStock: { type: "integer", example: 10 },
            condition: { $ref: "#/components/schemas/GearCondition" },
            imageUrl: { type: "string", nullable: true },
            specifications: { type: "object", nullable: true },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string", nullable: true },
            profileImage: { type: "string", nullable: true },
            address: { type: "string", nullable: true },
            role: { $ref: "#/components/schemas/UserRole" },
            status: { $ref: "#/components/schemas/UserStatus" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        RentalOrderItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            rentalOrderId: { type: "string", format: "uuid" },
            gearItemId: { type: "string", format: "uuid" },
            quantity: { type: "integer", example: 1 },
            pricePerDay: { type: "string", example: "12.50" },
            rentalDays: { type: "integer", example: 3 },
            subtotal: { type: "string", example: "37.50" },
            gearItem: { $ref: "#/components/schemas/GearItem" },
          },
        },
        RentalOrder: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            customerId: { type: "string", format: "uuid" },
            orderNumber: { type: "string", example: "RNT-LSX-AB1" },
            rentalStartDate: { type: "string", format: "date-time" },
            rentalEndDate: { type: "string", format: "date-time" },
            totalAmount: { type: "string", example: "37.50" },
            depositAmount: { type: "string", example: "50.00" },
            pickupAddress: { type: "string", nullable: true },
            notes: { type: "string", nullable: true },
            status: { $ref: "#/components/schemas/RentalStatus" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Payment: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            rentalOrderId: { type: "string", format: "uuid" },
            transactionId: { type: "string" },
            amount: { type: "string", example: "37.50" },
            paymentMethod: { $ref: "#/components/schemas/PaymentMethod" },
            providerReference: { type: "string", nullable: true },
            status: { $ref: "#/components/schemas/PaymentStatus" },
            paidAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            customerId: { type: "string", format: "uuid" },
            gearItemId: { type: "string", format: "uuid" },
            rentalOrderId: { type: "string", format: "uuid" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Gear", description: "Public gear & category browsing" },
      { name: "Rentals", description: "Customer rental orders" },
      { name: "Reviews", description: "Customer reviews on returned gear" },
      { name: "Provider", description: "Provider inventory & order management" },
      { name: "Payments", description: "Stripe checkout & payment history" },
      { name: "Admin", description: "Admin-only oversight endpoints" },
    ],
  },
  apis: ["./src/modules/**/*.route.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const mountSwagger = (app: Application) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "GearUp API Docs",
    }),
  );
};

export { swaggerSpec };
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware } from "better-auth/api";

const globalForMongo = globalThis as unknown as {
  mendizoMongoClient?: MongoClient;
};

const client =
  globalForMongo.mendizoMongoClient ??
  new MongoClient(process.env.MONGODB_URI!, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
  });

globalForMongo.mendizoMongoClient = client;

// Shared database handle.
export const db = client.db("mendizo");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://mendizo-client.vercel.app",
  trustedOrigins: [
    "https://mendizo-client.vercel.app",
    "http://localhost:3000",
  ],

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  // Google Sign-In / Sign-Up
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      area: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Normalize role during signup - admin is never selectable
      if (ctx.path === "/sign-up/email") {
        const role = ctx.body?.role;

        const normalizedRole =
          role === "technician" ? "technician" : "customer";

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              role: normalizedRole,
            },
          },
        };
      }

      // Prevent users from changing their role through profile updates
      if (ctx.path === "/update-user" && ctx.body) {
        const { role, ...safeBody } = ctx.body;

        return {
          context: {
            ...ctx,
            body: safeBody,
          },
        };
      }
    }),
  },
});
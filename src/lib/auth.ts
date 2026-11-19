
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("mendizo");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: ["customer", "technician"],
        required: true,
        defaultValue: "customer",
        input: true,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const role = ctx.body?.role;

      if (role !== "customer" && role !== "technician") {
        throw new APIError("BAD_REQUEST", {
          message: "Invalid account role.",
        });
      }
    }),
  },
});

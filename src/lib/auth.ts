
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware } from "better-auth/api";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("mendizo");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

 user: {
  additionalFields: {
    role: {
      type: ["customer", "technician"],
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
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const role = ctx.body?.role;

      const normalizedRole =
        role === "customer" || role === "technician"
          ? role
          : "customer";

      return {
        context: {
          ...ctx,
          body: {
            ...ctx.body,
            role: normalizedRole,
          },
        },
      };
    }),
  },
});

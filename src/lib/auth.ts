import { betterAuth } from "better-auth";
import {
  MongoClient,
  MongoClientClosedError,
  MongoServerSelectionError,
  MongoTopologyClosedError,
  type Db,
} from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware } from "better-auth/api";

const globalForMongo = globalThis as unknown as {
  mendizoMongoClient?: MongoClient;
};

const MONGO_CLIENT_OPTIONS = {
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 10000,
};

type MongoAdapterFactory = ReturnType<typeof mongodbAdapter>;
type AdapterOptions = Parameters<MongoAdapterFactory>[0];

function createMongoClient() {
  const client = new MongoClient(process.env.MONGODB_URI!, MONGO_CLIENT_OPTIONS);
  globalForMongo.mendizoMongoClient = client;
  return client;
}

function getMongoClient() {
  return globalForMongo.mendizoMongoClient ?? createMongoClient();
}

function createAdapterFactory(): MongoAdapterFactory {
  const client = getMongoClient();
  return mongodbAdapter(client.db("mendizo"), { client });
}

let adapterFactory = createAdapterFactory();

function hasPoisonedClientError(error: unknown): boolean {
  const seen = new Set<unknown>();
  let current: unknown = error;

  while (current && !seen.has(current)) {
    seen.add(current);

    if (
      current instanceof MongoTopologyClosedError ||
      current instanceof MongoClientClosedError ||
      current instanceof MongoServerSelectionError ||
      (current instanceof Error &&
        /topology is closed|server selection timed out/i.test(current.message))
    ) {
      return true;
    }

    current = (current as { cause?: unknown }).cause;
  }

  return false;
}

function replaceClientIfNeeded(error: unknown): boolean {
  if (!hasPoisonedClientError(error)) return false;

  // A failed server selection permanently closes the client's topology. Drop
  // the poisoned client so the next operation can create a fresh connection.
  globalForMongo.mendizoMongoClient = undefined;
  adapterFactory = createAdapterFactory();
  return true;
}

export function getDb(): Db {
  return getMongoClient().db("mendizo");
}

export async function withMongoRetry<T>(
  operation: (db: Db) => Promise<T>
): Promise<T> {
  try {
    return await operation(getDb());
  } catch (error) {
    if (!replaceClientIfNeeded(error)) throw error;
    return operation(getDb());
  }
}

const resilientAdapterFactory = ((options: AdapterOptions) => {
  let adapter: ReturnType<MongoAdapterFactory> = adapterFactory(options);

  return new Proxy(adapter, {
    get(_target, property) {
      const target = adapter;
      const value = Reflect.get(target, property);

      if (
        typeof property === "symbol" ||
        property === "then" ||
        typeof value !== "function"
      ) {
        return value;
      }

      return (...args: unknown[]) =>
        Promise.resolve(
          (value as (...args: unknown[]) => unknown).apply(target, args)
        ).catch((error) => {
          if (!replaceClientIfNeeded(error)) throw error;

          adapter = adapterFactory(options);
          const retryValue = Reflect.get(adapter, property);

          if (typeof retryValue !== "function") throw error;

          return (retryValue as (...args: unknown[]) => unknown).apply(
            adapter,
            args
          );
        });
    },
  });
}) as MongoAdapterFactory;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://mendizo-client.vercel.app",
  trustedOrigins: [
    "https://mendizo-client.vercel.app",
    "http://localhost:3000",
  ],

  database: resilientAdapterFactory,

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
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const isZodError = error.cause instanceof ZodError;

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: isZodError ? error.cause.issues : undefined,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

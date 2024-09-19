import { observable } from "@trpc/server/observable";
import { publicProcedure, router } from "../trpc";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;

export const caller = createCallerFactory()(appRouter)({});

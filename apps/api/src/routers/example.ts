import { ORPCError } from "@orpc/client";
import { eq, table } from "@repo/database";
import z from "zod";
import { mwDatabase } from "../orpc/middlewares/mw-database";
import { protectedRoute, publicRoute } from "./base";

const hello = publicRoute
  .input(z.object({ name: z.string() }).optional())
  .output(z.object({ message: z.string() }))
  .handler(async ({ input }) => {
    const name = input?.name || "world";
    return {
      message: `Hello, ${name}!`,
    };
  });

const testAuth = protectedRoute.handler(async ({ context }) => {
  return {
    user: context.user,
  };
});

const userConfigsOrpc = publicRoute.use(mwDatabase);

const createUserConfig = userConfigsOrpc
  .input(table.userConfigsZodSchema.insert)
  .output(table.userConfigsZodSchema.select.array())
  .handler(async ({ input, context }) => {
    const { db } = context;

    try {
      const [createdUser] = await db
        .insert(table.userConfigs)
        .values(input)
        .returning();

      const users = await db
        .select()
        .from(table.userConfigs)
        .where(eq(table.userConfigs.id, createdUser.id));

      return users;
    } catch (error) {
      throw new ORPCError("Database Error", error as Error);
    }
  });

const listUserConfigs = userConfigsOrpc
  .input(table.userConfigsZodSchema.select.partial())
  .output(table.userConfigsZodSchema.select.partial().array())
  .handler(async ({ input, context }) => {
    const { db } = context;

    try {
      const users = await db.query.userConfigs.findMany({
        where: (fields, { eq }) => {
          if (input?.id) {
            return eq(fields.id, input.id);
          }
          return undefined;
        },
      });
      return users;
    } catch (error) {
      throw new ORPCError("Database Error", error as Error);
    }
  });

export const exampleRouter = {
  hello,
  userConfigs: { createUserConfig, listUserConfigs },
  testAuth,
};

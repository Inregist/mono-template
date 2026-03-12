import { ORPCError } from "@orpc/client";
import { eq, table } from "@repo/database";
import z from "zod";
import { mwDatabase } from "../orpc/middlewares/mw-database";
import { publicRoute } from "./base";

const hello = publicRoute
  .input(z.object({ name: z.string() }).optional())
  .output(z.object({ message: z.string() }))
  .handler(async ({ input }) => {
    const name = input?.name || "world";
    return {
      message: `Hello, ${name}!`,
    };
  });

const userOrpc = publicRoute.use(mwDatabase);

const createUser = userOrpc
  .input(table.usersZodSchema.insert)
  .output(table.usersZodSchema.select.array())
  .handler(async ({ input, context }) => {
    const { db } = context;

    try {
      const [createdUser] = await db
        .insert(table.users)
        .values(input)
        .returning();

      const users = await db
        .select()
        .from(table.users)
        .where(eq(table.users.id, createdUser.id));

      return users;
    } catch (error) {
      throw new ORPCError("Database Error", error as Error);
    }
  });

const listUsers = userOrpc
  .input(table.usersZodSchema.select.partial())
  .output(table.usersZodSchema.select.partial().array())
  .handler(async ({ input, context }) => {
    const { db } = context;

    try {
      const users = await db.query.users.findMany({
        where: (fields, { eq, or }) => {
          return or(
            eq(fields.email, input.email ?? ""),
            eq(fields.name, input.name ?? "")
          );
        },
      });
      return users;
    } catch (error) {
      throw new ORPCError("Database Error", error as Error);
    }
  });

export const exampleRouter = {
  hello,
  users: { createUser, listUsers },
};

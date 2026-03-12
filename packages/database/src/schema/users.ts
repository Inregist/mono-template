import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import { defineTableZodSchema } from "../utils/zod-schema.type";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersZodSchema = defineTableZodSchema({
  select: createSelectSchema(users, { email: z.email() }),
  insert: createInsertSchema(users, { email: z.email() }),
  update: createUpdateSchema(users, { email: z.email() }),
});

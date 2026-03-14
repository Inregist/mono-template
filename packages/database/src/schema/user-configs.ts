import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { defineTableZodSchema } from "../utils/zod-schema.type";
import { users } from "./auth";

export const userConfigs = pgTable("user_configs", {
	id: uuid("id").primaryKey(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userConfigsRelations = relations(userConfigs, ({ one }) => ({
	user: one(users, {
		fields: [userConfigs.userId],
		references: [users.id],
	}),
}));

export const userConfigsZodSchema = defineTableZodSchema({
	select: createSelectSchema(userConfigs),
	insert: createInsertSchema(userConfigs),
	update: createUpdateSchema(userConfigs),
});

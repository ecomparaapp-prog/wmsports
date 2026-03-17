import { pgTable, text, serial, boolean, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url"),
  driveUrl: text("drive_url"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  price3: numeric("price_3", { precision: 10, scale: 2 }),
  price5: numeric("price_5", { precision: 10, scale: 2 }),
  allowPersonalization: boolean("allow_personalization").notNull().default(true),
  subcategory: text("subcategory"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const numericField = z.union([z.string(), z.number()]).transform((v) => String(v));

export const insertProductSchema = createInsertSchema(productsTable, {
  basePrice: numericField,
  price3: z.union([z.string(), z.number(), z.null()]).transform((v) => v == null ? null : String(v)).optional(),
  price5: z.union([z.string(), z.number(), z.null()]).transform((v) => v == null ? null : String(v)).optional(),
}).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;

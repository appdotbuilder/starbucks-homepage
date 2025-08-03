
import { serial, text, pgTable, timestamp, numeric, integer, boolean, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const productCategoriesTable = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  image_url: text('image_url'),
  display_order: integer('display_order').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').notNull().references(() => productCategoriesTable.id),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image_url: text('image_url'),
  is_recommended: boolean('is_recommended').notNull().default(false),
  is_new: boolean('is_new').notNull().default(false),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const promotionsTable = pgTable('promotions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url'),
  discount_percentage: numeric('discount_percentage', { precision: 5, scale: 2 }),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const storesTable = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip_code: text('zip_code').notNull(),
  phone: text('phone'),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  hours: text('hours'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const membersTable = pgTable('members', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  phone: text('phone'),
  rewards_points: integer('rewards_points').notNull().default(0),
  membership_level: text('membership_level').notNull().default('Green'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const productCategoriesRelations = relations(productCategoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one }) => ({
  category: one(productCategoriesTable, {
    fields: [productsTable.category_id],
    references: [productCategoriesTable.id],
  }),
}));

// Export all tables for proper query building
export const tables = {
  productCategories: productCategoriesTable,
  products: productsTable,
  promotions: promotionsTable,
  stores: storesTable,
  members: membersTable,
};


import { z } from 'zod';

// Product Category schema
export const productCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type ProductCategory = z.infer<typeof productCategorySchema>;

// Product schema
export const productSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  image_url: z.string().nullable(),
  is_recommended: z.boolean(),
  is_new: z.boolean(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Product = z.infer<typeof productSchema>;

// Promotion schema
export const promotionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  discount_percentage: z.number().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Promotion = z.infer<typeof promotionSchema>;

// Store schema
export const storeSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  phone: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  hours: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Store = z.infer<typeof storeSchema>;

// Member schema
export const memberSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable(),
  rewards_points: z.number().int(),
  membership_level: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Member = z.infer<typeof memberSchema>;

// Input schemas for creating/updating
export const createProductCategoryInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean().default(true)
});

export type CreateProductCategoryInput = z.infer<typeof createProductCategoryInputSchema>;

export const createProductInputSchema = z.object({
  category_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().positive(),
  image_url: z.string().nullable(),
  is_recommended: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_active: z.boolean().default(true)
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export const createPromotionInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  discount_percentage: z.number().min(0).max(100).nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  is_active: z.boolean().default(true)
});

export type CreatePromotionInput = z.infer<typeof createPromotionInputSchema>;

export const createStoreInputSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  phone: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  hours: z.string().nullable(),
  is_active: z.boolean().default(true)
});

export type CreateStoreInput = z.infer<typeof createStoreInputSchema>;

export const memberLoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type MemberLoginInput = z.infer<typeof memberLoginInputSchema>;

export const storeSearchInputSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  city: z.string().optional(),
  zip_code: z.string().optional(),
  radius: z.number().positive().default(25)
});

export type StoreSearchInput = z.infer<typeof storeSearchInputSchema>;

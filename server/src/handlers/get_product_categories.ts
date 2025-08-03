
import { db } from '../db';
import { productCategoriesTable } from '../db/schema';
import { type ProductCategory } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  try {
    const results = await db.select()
      .from(productCategoriesTable)
      .where(eq(productCategoriesTable.is_active, true))
      .orderBy(asc(productCategoriesTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch product categories:', error);
    throw error;
  }
};

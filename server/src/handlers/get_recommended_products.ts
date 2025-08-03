
import { db } from '../db';
import { productsTable } from '../db/schema';
import { type Product } from '../schema';
import { eq, and } from 'drizzle-orm';

export const getRecommendedProducts = async (): Promise<Product[]> => {
  try {
    const results = await db.select()
      .from(productsTable)
      .where(
        and(
          eq(productsTable.is_recommended, true),
          eq(productsTable.is_active, true)
        )
      )
      .execute();

    // Convert numeric fields back to numbers
    return results.map(product => ({
      ...product,
      price: parseFloat(product.price) // Convert string back to number
    }));
  } catch (error) {
    console.error('Failed to fetch recommended products:', error);
    throw error;
  }
};

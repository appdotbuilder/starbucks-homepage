
import { db } from '../db';
import { productsTable } from '../db/schema';
import { type Product } from '../schema';
import { eq, and, desc } from 'drizzle-orm';

export const getNewProducts = async (): Promise<Product[]> => {
  try {
    const results = await db.select()
      .from(productsTable)
      .where(
        and(
          eq(productsTable.is_new, true),
          eq(productsTable.is_active, true)
        )
      )
      .orderBy(desc(productsTable.created_at))
      .execute();

    // Convert numeric fields back to numbers
    return results.map(product => ({
      ...product,
      price: parseFloat(product.price)
    }));
  } catch (error) {
    console.error('Get new products failed:', error);
    throw error;
  }
};


import { db } from '../db';
import { promotionsTable } from '../db/schema';
import { type Promotion } from '../schema';
import { and, eq, lte, gte } from 'drizzle-orm';

export const getCurrentPromotions = async (): Promise<Promotion[]> => {
  try {
    const now = new Date();
    
    const results = await db.select()
      .from(promotionsTable)
      .where(
        and(
          eq(promotionsTable.is_active, true),
          lte(promotionsTable.start_date, now),
          gte(promotionsTable.end_date, now)
        )
      )
      .execute();

    // Convert numeric fields back to numbers
    return results.map(promotion => ({
      ...promotion,
      discount_percentage: promotion.discount_percentage ? parseFloat(promotion.discount_percentage) : null
    }));
  } catch (error) {
    console.error('Failed to fetch current promotions:', error);
    throw error;
  }
};

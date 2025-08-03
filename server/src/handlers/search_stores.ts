
import { db } from '../db';
import { storesTable } from '../db/schema';
import { type StoreSearchInput, type Store } from '../schema';
import { eq, and, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

export const searchStores = async (input: StoreSearchInput): Promise<Store[]> => {
  try {
    const conditions: SQL<unknown>[] = [];

    // Always filter for active stores
    conditions.push(eq(storesTable.is_active, true));

    // If latitude and longitude are provided, calculate distance and filter by radius
    if (input.latitude !== undefined && input.longitude !== undefined) {
      const distanceFormula = sql`
        (6371 * acos(
          cos(radians(${input.latitude})) * 
          cos(radians(${storesTable.latitude})) * 
          cos(radians(${storesTable.longitude}) - radians(${input.longitude})) + 
          sin(radians(${input.latitude})) * 
          sin(radians(${storesTable.latitude}))
        ))
      `;

      // Filter by radius (distance in kilometers)
      conditions.push(sql`${distanceFormula} <= ${input.radius}`);

      // Build query with conditions
      const query = db.select()
        .from(storesTable)
        .where(and(...conditions))
        .orderBy(distanceFormula);

      const results = await query.execute();

      // Convert the results to match the Store schema
      return results.map(store => ({
        ...store,
        latitude: Number(store.latitude), // Convert real to number
        longitude: Number(store.longitude) // Convert real to number
      }));
    } else {
      // Search by city or zip code if no coordinates provided
      if (input.city) {
        conditions.push(eq(storesTable.city, input.city));
      }

      if (input.zip_code) {
        conditions.push(eq(storesTable.zip_code, input.zip_code));
      }

      // Build query with conditions
      const query = db.select()
        .from(storesTable)
        .where(and(...conditions))
        .orderBy(storesTable.name);

      const results = await query.execute();

      // Convert the results to match the Store schema
      return results.map(store => ({
        ...store,
        latitude: Number(store.latitude), // Convert real to number
        longitude: Number(store.longitude) // Convert real to number
      }));
    }
  } catch (error) {
    console.error('Store search failed:', error);
    throw error;
  }
};

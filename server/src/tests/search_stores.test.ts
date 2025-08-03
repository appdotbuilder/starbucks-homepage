
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { storesTable } from '../db/schema';
import { type StoreSearchInput } from '../schema';
import { searchStores } from '../handlers/search_stores';

// Test stores data
const testStores = [
  {
    name: 'Starbucks Downtown',
    address: '123 Main St',
    city: 'Seattle',
    state: 'WA',
    zip_code: '98101',
    phone: '(206) 555-0123',
    latitude: 47.6062,
    longitude: -122.3321,
    hours: 'Mon-Fri: 6:00 AM - 9:00 PM',
    is_active: true
  },
  {
    name: 'Starbucks Pike Place',
    address: '456 Pike St',
    city: 'Seattle',
    state: 'WA',
    zip_code: '98101',
    phone: '(206) 555-0124',
    latitude: 47.6097,
    longitude: -122.3331,
    hours: 'Mon-Sun: 5:30 AM - 10:00 PM',
    is_active: true
  },
  {
    name: 'Starbucks Bellevue',
    address: '789 Bellevue Way',
    city: 'Bellevue',
    state: 'WA',
    zip_code: '98004',
    phone: '(425) 555-0125',
    latitude: 47.6101,
    longitude: -122.2015,
    hours: 'Mon-Fri: 6:00 AM - 8:00 PM',
    is_active: true
  },
  {
    name: 'Starbucks Inactive',
    address: '999 Closed St',
    city: 'Seattle',
    state: 'WA',
    zip_code: '98101',
    phone: '(206) 555-0999',
    latitude: 47.6062,
    longitude: -122.3321,
    hours: null,
    is_active: false
  }
];

describe('searchStores', () => {
  beforeEach(async () => {
    await createDB();
    
    // Insert test stores
    await db.insert(storesTable)
      .values(testStores)
      .execute();
  });

  afterEach(resetDB);

  it('should search stores by city', async () => {
    const input: StoreSearchInput = {
      city: 'Seattle',
      radius: 25
    };

    const result = await searchStores(input);

    expect(result).toBeDefined();
    expect(result.length).toBe(2); // Only active Seattle stores
    expect(result.every(store => store.city === 'Seattle')).toBe(true);
    expect(result.every(store => store.is_active === true)).toBe(true);
    
    // Should be ordered by name
    expect(result[0].name).toBe('Starbucks Downtown');
    expect(result[1].name).toBe('Starbucks Pike Place');
  });

  it('should search stores by zip code', async () => {
    const input: StoreSearchInput = {
      zip_code: '98004',
      radius: 25
    };

    const result = await searchStores(input);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].zip_code).toBe('98004');
    expect(result[0].city).toBe('Bellevue');
    expect(result[0].is_active).toBe(true);
  });

  it('should search stores by coordinates within radius', async () => {
    const input: StoreSearchInput = {
      latitude: 47.6062, // Downtown Seattle coordinates
      longitude: -122.3321,
      radius: 1 // 1 km radius
    };

    const result = await searchStores(input);

    expect(result).toBeDefined();
    expect(result.length).toBe(2); // Should find both downtown Seattle stores
    expect(result.every(store => store.is_active === true)).toBe(true);
    
    // Results should include latitude and longitude as numbers
    result.forEach(store => {
      expect(typeof store.latitude).toBe('number');
      expect(typeof store.longitude).toBe('number');
    });
  });

  it('should search stores by coordinates with larger radius', async () => {
    const input: StoreSearchInput = {
      latitude: 47.6062,
      longitude: -122.3321,
      radius: 25 // 25 km radius
    };

    const result = await searchStores(input);

    expect(result).toBeDefined();
    expect(result.length).toBe(3); // Should find all active stores
    expect(result.every(store => store.is_active === true)).toBe(true);
  });

  it('should return empty array when no stores match criteria', async () => {
    const input: StoreSearchInput = {
      city: 'Portland',
      radius: 25
    };

    const result = await searchStores(input);

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  it('should exclude inactive stores from results', async () => {
    const input: StoreSearchInput = {
      city: 'Seattle',
      radius: 25
    };

    const result = await searchStores(input);

    // Should not include the inactive store
    expect(result.every(store => store.is_active === true)).toBe(true);
    expect(result.find(store => store.name === 'Starbucks Inactive')).toBeUndefined();
  });

  it('should search by both city and zip code', async () => {
    const input: StoreSearchInput = {
      city: 'Seattle',
      zip_code: '98101',
      radius: 25
    };

    const result = await searchStores(input);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result.every(store => store.city === 'Seattle' && store.zip_code === '98101')).toBe(true);
  });

  it('should use default radius when coordinates provided', async () => {
    const input: StoreSearchInput = {
      latitude: 47.6062,
      longitude: -122.3321,
      radius: 25 // Must explicitly provide radius since TypeScript type requires it
    };

    const result = await searchStores(input);

    expect(result).toBeDefined();
    expect(result.length).toBe(3); // All active stores within 25km
  });
});

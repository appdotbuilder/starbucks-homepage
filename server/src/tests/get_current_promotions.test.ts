
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { promotionsTable } from '../db/schema';
import { type CreatePromotionInput } from '../schema';
import { getCurrentPromotions } from '../handlers/get_current_promotions';

describe('getCurrentPromotions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return active promotions within date range', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Create active promotion within date range
    const activePromotion: CreatePromotionInput = {
      title: 'Fall Favorites',
      description: 'Seasonal beverages on sale',
      image_url: '/images/fall.jpg',
      discount_percentage: 20,
      start_date: yesterday,
      end_date: tomorrow,
      is_active: true
    };

    await db.insert(promotionsTable)
      .values({
        ...activePromotion,
        discount_percentage: activePromotion.discount_percentage?.toString()
      })
      .execute();

    const result = await getCurrentPromotions();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Fall Favorites');
    expect(result[0].description).toEqual(activePromotion.description);
    expect(result[0].discount_percentage).toEqual(20);
    expect(typeof result[0].discount_percentage).toBe('number');
    expect(result[0].is_active).toBe(true);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should not return inactive promotions', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Create inactive promotion within date range
    const inactivePromotion: CreatePromotionInput = {
      title: 'Inactive Promotion',
      description: 'This should not appear',
      image_url: null,
      discount_percentage: 15,
      start_date: yesterday,
      end_date: tomorrow,
      is_active: false
    };

    await db.insert(promotionsTable)
      .values({
        ...inactivePromotion,
        discount_percentage: inactivePromotion.discount_percentage?.toString()
      })
      .execute();

    const result = await getCurrentPromotions();

    expect(result).toHaveLength(0);
  });

  it('should not return promotions outside date range', async () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    const expiredDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago

    // Create expired promotion
    const expiredPromotion: CreatePromotionInput = {
      title: 'Expired Promotion',
      description: 'This promotion has ended',
      image_url: null,
      discount_percentage: 25,
      start_date: pastDate,
      end_date: expiredDate,
      is_active: true
    };

    await db.insert(promotionsTable)
      .values({
        ...expiredPromotion,
        discount_percentage: expiredPromotion.discount_percentage?.toString()
      })
      .execute();

    const result = await getCurrentPromotions();

    expect(result).toHaveLength(0);
  });

  it('should handle promotions with null discount_percentage', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Create promotion without discount percentage
    const promotionWithoutDiscount: CreatePromotionInput = {
      title: 'Special Event',
      description: 'Free coffee with purchase',
      image_url: '/images/event.jpg',
      discount_percentage: null,
      start_date: yesterday,
      end_date: tomorrow,
      is_active: true
    };

    await db.insert(promotionsTable)
      .values({
        ...promotionWithoutDiscount,
        discount_percentage: null
      })
      .execute();

    const result = await getCurrentPromotions();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Special Event');
    expect(result[0].discount_percentage).toBeNull();
  });

  it('should return multiple valid promotions', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Create multiple active promotions
    const promotions: CreatePromotionInput[] = [
      {
        title: 'Fall Special',
        description: 'Autumn beverages',
        image_url: null,
        discount_percentage: 15,
        start_date: yesterday,
        end_date: tomorrow,
        is_active: true
      },
      {
        title: 'Happy Hour',
        description: 'Afternoon deals',
        image_url: '/images/happy-hour.jpg',
        discount_percentage: 10,
        start_date: yesterday,
        end_date: tomorrow,
        is_active: true
      }
    ];

    for (const promotion of promotions) {
      await db.insert(promotionsTable)
        .values({
          ...promotion,
          discount_percentage: promotion.discount_percentage?.toString()
        })
        .execute();
    }

    const result = await getCurrentPromotions();

    expect(result).toHaveLength(2);
    const titles = result.map(p => p.title);
    expect(titles).toContain('Fall Special');
    expect(titles).toContain('Happy Hour');
    
    // Verify all have proper numeric conversion
    result.forEach(promotion => {
      expect(typeof promotion.discount_percentage).toBe('number');
      expect(promotion.is_active).toBe(true);
    });
  });
});


import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { productsTable, productCategoriesTable } from '../db/schema';
import { getRecommendedProducts } from '../handlers/get_recommended_products';

describe('getRecommendedProducts', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return only recommended and active products', async () => {
    // Create a test category first (required for foreign key)
    const categoryResult = await db.insert(productCategoriesTable)
      .values({
        name: 'Test Category',
        description: 'A test category',
        image_url: null,
        display_order: 1,
        is_active: true
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create test products
    await db.insert(productsTable)
      .values([
        {
          category_id: categoryId,
          name: 'Recommended Product 1',
          description: 'A recommended product',
          price: '5.95',
          image_url: '/test1.jpg',
          is_recommended: true,
          is_new: false,
          is_active: true
        },
        {
          category_id: categoryId,
          name: 'Regular Product',
          description: 'A regular product',
          price: '4.95',
          image_url: '/test2.jpg',
          is_recommended: false,
          is_new: true,
          is_active: true
        },
        {
          category_id: categoryId,
          name: 'Inactive Recommended Product',
          description: 'An inactive recommended product',
          price: '6.95',
          image_url: '/test3.jpg',
          is_recommended: true,
          is_new: false,
          is_active: false
        }
      ])
      .execute();

    const results = await getRecommendedProducts();

    // Should only return the one product that is both recommended and active
    expect(results).toHaveLength(1);
    expect(results[0].name).toEqual('Recommended Product 1');
    expect(results[0].is_recommended).toBe(true);
    expect(results[0].is_active).toBe(true);
    expect(typeof results[0].price).toBe('number');
    expect(results[0].price).toEqual(5.95);
  });

  it('should return empty array when no recommended products exist', async () => {
    // Create a test category first
    const categoryResult = await db.insert(productCategoriesTable)
      .values({
        name: 'Test Category',
        description: 'A test category',
        image_url: null,
        display_order: 1,
        is_active: true
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create only non-recommended products
    await db.insert(productsTable)
      .values([
        {
          category_id: categoryId,
          name: 'Regular Product',
          description: 'A regular product',
          price: '4.95',
          image_url: '/test.jpg',
          is_recommended: false,
          is_new: true,
          is_active: true
        }
      ])
      .execute();

    const results = await getRecommendedProducts();

    expect(results).toHaveLength(0);
  });

  it('should return multiple recommended products when they exist', async () => {
    // Create a test category first
    const categoryResult = await db.insert(productCategoriesTable)
      .values({
        name: 'Test Category',
        description: 'A test category',
        image_url: null,
        display_order: 1,
        is_active: true
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create multiple recommended products
    await db.insert(productsTable)
      .values([
        {
          category_id: categoryId,
          name: 'Recommended Product 1',
          description: 'First recommended product',
          price: '5.95',
          image_url: '/test1.jpg',
          is_recommended: true,
          is_new: false,
          is_active: true
        },
        {
          category_id: categoryId,
          name: 'Recommended Product 2',
          description: 'Second recommended product',
          price: '6.95',
          image_url: '/test2.jpg',
          is_recommended: true,
          is_new: true,
          is_active: true
        }
      ])
      .execute();

    const results = await getRecommendedProducts();

    expect(results).toHaveLength(2);
    expect(results.every(product => product.is_recommended)).toBe(true);
    expect(results.every(product => product.is_active)).toBe(true);
    expect(results.every(product => typeof product.price === 'number')).toBe(true);
  });
});

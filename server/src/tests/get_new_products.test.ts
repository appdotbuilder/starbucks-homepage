
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { productCategoriesTable, productsTable } from '../db/schema';
import { getNewProducts } from '../handlers/get_new_products';

describe('getNewProducts', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return new and active products', async () => {
    // Create test category first
    const categoryResult = await db.insert(productCategoriesTable)
      .values({
        name: 'Test Category',
        description: 'A category for testing',
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
          name: 'New Product 1',
          description: 'A new product',
          price: '19.99',
          is_new: true,
          is_active: true,
          is_recommended: false
        },
        {
          category_id: categoryId,
          name: 'Old Product',
          description: 'An old product',
          price: '29.99',
          is_new: false,
          is_active: true,
          is_recommended: false
        },
        {
          category_id: categoryId,
          name: 'Inactive New Product',
          description: 'An inactive new product',
          price: '39.99',
          is_new: true,
          is_active: false,
          is_recommended: false
        }
      ])
      .execute();

    const results = await getNewProducts();

    expect(results).toHaveLength(1);
    expect(results[0].name).toEqual('New Product 1');
    expect(results[0].is_new).toBe(true);
    expect(results[0].is_active).toBe(true);
    expect(typeof results[0].price).toBe('number');
    expect(results[0].price).toEqual(19.99);
  });

  it('should return empty array when no new products exist', async () => {
    // Create test category first
    const categoryResult = await db.insert(productCategoriesTable)
      .values({
        name: 'Test Category',
        description: 'A category for testing',
        display_order: 1,
        is_active: true
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create only old products
    await db.insert(productsTable)
      .values({
        category_id: categoryId,
        name: 'Old Product',
        description: 'An old product',
        price: '29.99',
        is_new: false,
        is_active: true,
        is_recommended: false
      })
      .execute();

    const results = await getNewProducts();

    expect(results).toHaveLength(0);
  });

  it('should order products from newest to oldest', async () => {
    // Create test category first
    const categoryResult = await db.insert(productCategoriesTable)
      .values({
        name: 'Test Category',
        description: 'A category for testing',
        display_order: 1,
        is_active: true
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create products with slight delay to ensure different timestamps
    await db.insert(productsTable)
      .values({
        category_id: categoryId,
        name: 'First New Product',
        description: 'First new product',
        price: '19.99',
        is_new: true,
        is_active: true,
        is_recommended: false
      })
      .execute();

    // Small delay to ensure different created_at timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(productsTable)
      .values({
        category_id: categoryId,
        name: 'Second New Product',
        description: 'Second new product',
        price: '29.99',
        is_new: true,
        is_active: true,
        is_recommended: false
      })
      .execute();

    const results = await getNewProducts();

    expect(results).toHaveLength(2);
    expect(results[0].name).toEqual('Second New Product');
    expect(results[1].name).toEqual('First New Product');
    expect(results[0].created_at >= results[1].created_at).toBe(true);
  });
});

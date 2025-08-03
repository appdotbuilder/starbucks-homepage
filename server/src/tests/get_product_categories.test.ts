
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { productCategoriesTable } from '../db/schema';
import { type CreateProductCategoryInput } from '../schema';
import { getProductCategories } from '../handlers/get_product_categories';

describe('getProductCategories', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no categories exist', async () => {
    const result = await getProductCategories();
    expect(result).toEqual([]);
  });

  it('should return active categories ordered by display_order', async () => {
    // Create test categories in non-sequential display order
    const category1: CreateProductCategoryInput = {
      name: 'Cold Drinks',
      description: 'Iced coffee and cold beverages',
      image_url: '/images/cold-drinks.jpg',
      display_order: 3,
      is_active: true
    };

    const category2: CreateProductCategoryInput = {
      name: 'Hot Drinks',
      description: 'Freshly brewed coffee and hot beverages',
      image_url: '/images/hot-drinks.jpg',
      display_order: 1,
      is_active: true
    };

    const category3: CreateProductCategoryInput = {
      name: 'Food',
      description: 'Pastries and light meals',
      image_url: '/images/food.jpg',
      display_order: 2,
      is_active: true
    };

    await db.insert(productCategoriesTable).values([category1, category2, category3]).execute();

    const result = await getProductCategories();

    expect(result).toHaveLength(3);
    
    // Verify ordering by display_order
    expect(result[0].name).toEqual('Hot Drinks');
    expect(result[0].display_order).toEqual(1);
    expect(result[1].name).toEqual('Food');
    expect(result[1].display_order).toEqual(2);
    expect(result[2].name).toEqual('Cold Drinks');
    expect(result[2].display_order).toEqual(3);

    // Verify all fields are present
    result.forEach(category => {
      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.display_order).toBeDefined();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  it('should only return active categories', async () => {
    // Create active and inactive categories
    const activeCategory: CreateProductCategoryInput = {
      name: 'Hot Drinks',
      description: 'Active category',
      image_url: null,
      display_order: 1,
      is_active: true
    };

    const inactiveCategory: CreateProductCategoryInput = {
      name: 'Discontinued Items',
      description: 'Inactive category',
      image_url: null,
      display_order: 2,
      is_active: false
    };

    await db.insert(productCategoriesTable).values([activeCategory, inactiveCategory]).execute();

    const result = await getProductCategories();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Hot Drinks');
    expect(result[0].is_active).toBe(true);
  });

  it('should handle categories with nullable fields', async () => {
    const categoryWithNulls: CreateProductCategoryInput = {
      name: 'Basic Category',
      description: null,
      image_url: null,
      display_order: 1,
      is_active: true
    };

    await db.insert(productCategoriesTable).values(categoryWithNulls).execute();

    const result = await getProductCategories();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Basic Category');
    expect(result[0].description).toBeNull();
    expect(result[0].image_url).toBeNull();
    expect(result[0].display_order).toEqual(1);
  });
});

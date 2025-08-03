
import { describe, expect, it } from 'bun:test';
import { getCompanyInfo, type CompanyInfo } from '../handlers/get_company_info';

describe('getCompanyInfo', () => {
  it('should return complete company information', async () => {
    const result = await getCompanyInfo();

    // Verify structure
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    
    // Verify required fields exist
    expect(result.mission).toBeDefined();
    expect(result.founded).toBeDefined();
    expect(result.stores_worldwide).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.values).toBeDefined();
  });

  it('should return correct data types', async () => {
    const result = await getCompanyInfo();

    expect(typeof result.mission).toBe('string');
    expect(typeof result.founded).toBe('string');
    expect(typeof result.stores_worldwide).toBe('number');
    expect(typeof result.description).toBe('string');
    expect(Array.isArray(result.values)).toBe(true);
  });

  it('should return meaningful content', async () => {
    const result = await getCompanyInfo();

    // Mission should be meaningful
    expect(result.mission.length).toBeGreaterThan(20);
    expect(result.mission).toContain('inspire');

    // Founded year should be reasonable
    expect(result.founded).toBe('1971');

    // Store count should be positive
    expect(result.stores_worldwide).toBeGreaterThan(0);
    expect(result.stores_worldwide).toBe(35000);

    // Description should be substantial
    expect(result.description.length).toBeGreaterThan(50);
    expect(result.description).toContain('Seattle');

    // Values should be non-empty array
    expect(result.values.length).toBeGreaterThan(0);
    result.values.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(10);
    });
  });

  it('should return consistent data across multiple calls', async () => {
    const result1 = await getCompanyInfo();
    const result2 = await getCompanyInfo();

    expect(result1).toEqual(result2);
    expect(result1.mission).toBe(result2.mission);
    expect(result1.founded).toBe(result2.founded);
    expect(result1.stores_worldwide).toBe(result2.stores_worldwide);
    expect(result1.description).toBe(result2.description);
    expect(result1.values).toEqual(result2.values);
  });

  it('should have exactly 4 company values', async () => {
    const result = await getCompanyInfo();

    expect(result.values).toHaveLength(4);
    
    // Verify specific values exist
    expect(result.values).toContain('Creating a culture of warmth and belonging');
    expect(result.values).toContain('Acting with courage and challenging the status quo');
    expect(result.values).toContain('Being present, connecting with transparency and dignity');
    expect(result.values).toContain('Delivering our very best in all we do');
  });
});

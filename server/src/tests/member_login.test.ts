
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { membersTable } from '../db/schema';
import { type MemberLoginInput } from '../schema';
import { memberLogin } from '../handlers/member_login';

const testMember = {
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '555-0123',
  rewards_points: 100,
  membership_level: 'Gold',
  is_active: true
};

const testLoginInput: MemberLoginInput = {
  email: 'test@example.com',
  password: 'password123'
};

describe('memberLogin', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return member data for valid email', async () => {
    // Create test member
    await db.insert(membersTable)
      .values(testMember)
      .execute();

    const result = await memberLogin(testLoginInput);

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('test@example.com');
    expect(result!.first_name).toEqual('John');
    expect(result!.last_name).toEqual('Doe');
    expect(result!.phone).toEqual('555-0123');
    expect(result!.rewards_points).toEqual(100);
    expect(result!.membership_level).toEqual('Gold');
    expect(result!.is_active).toBe(true);
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent email', async () => {
    const result = await memberLogin({
      email: 'nonexistent@example.com',
      password: 'password123'
    });

    expect(result).toBeNull();
  });

  it('should return null for inactive member', async () => {
    // Create inactive test member
    await db.insert(membersTable)
      .values({
        ...testMember,
        is_active: false
      })
      .execute();

    const result = await memberLogin(testLoginInput);

    expect(result).toBeNull();
  });

  it('should accept any password for now', async () => {
    // Create test member
    await db.insert(membersTable)
      .values(testMember)
      .execute();

    // Test with different passwords - all should work for now
    const result1 = await memberLogin({
      email: 'test@example.com',
      password: 'password123'
    });

    const result2 = await memberLogin({
      email: 'test@example.com',
      password: 'different_password'
    });

    const result3 = await memberLogin({
      email: 'test@example.com',
      password: ''
    });

    expect(result1).not.toBeNull();
    expect(result2).not.toBeNull();
    expect(result3).not.toBeNull();
    expect(result1!.email).toEqual('test@example.com');
    expect(result2!.email).toEqual('test@example.com');
    expect(result3!.email).toEqual('test@example.com');
  });

  it('should handle case-sensitive email matching', async () => {
    // Create test member with lowercase email
    await db.insert(membersTable)
      .values(testMember)
      .execute();

    // Try login with uppercase email
    const result = await memberLogin({
      email: 'TEST@EXAMPLE.COM',
      password: 'password123'
    });

    expect(result).toBeNull(); // Should not match due to case sensitivity
  });
});

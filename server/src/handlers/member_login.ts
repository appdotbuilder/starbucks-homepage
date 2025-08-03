
import { db } from '../db';
import { membersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type MemberLoginInput, type Member } from '../schema';

export const memberLogin = async (input: MemberLoginInput): Promise<Member | null> => {
  try {
    // Query member by email
    const results = await db.select()
      .from(membersTable)
      .where(eq(membersTable.email, input.email))
      .execute();

    if (results.length === 0) {
      return null; // Member not found
    }

    const member = results[0];

    // Check if member is active
    if (!member.is_active) {
      return null; // Inactive member cannot login
    }

    // In a real implementation, we would verify the password hash here
    // For now, we'll accept any password for testing purposes
    // TODO: Implement proper password hashing and verification
    
    return {
      ...member,
      // No numeric conversions needed - all fields are already correct types
    };
  } catch (error) {
    console.error('Member login failed:', error);
    throw error;
  }
};

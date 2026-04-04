import { describe, it, expect } from 'vitest';
import { usersTable, SessionChatTable } from '@/config/schema';

describe('Database Schema', () => {
  it('should have usersTable defined with correct structure', () => {
    expect(usersTable).toBeDefined();
    expect(usersTable.id).toBeDefined();
    expect(usersTable.name).toBeDefined();
    expect(usersTable.email).toBeDefined();
  });

  it('should have SessionChatTable defined with correct structure', () => {
    expect(SessionChatTable).toBeDefined();
    expect(SessionChatTable.id).toBeDefined();
    expect(SessionChatTable.sessionId).toBeDefined();
    expect(SessionChatTable.createdBy).toBeDefined();
  });
});

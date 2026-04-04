import { describe, it, expect } from 'vitest';
import { usersTable, SessionChatTable } from '@/config/schema';
import { getTableConfig } from 'drizzle-orm/pg-core';

describe('Database Schema', () => {
  describe('usersTable', () => {
    it('should have correct structure and constraints', () => {
      const config = getTableConfig(usersTable);
      
      expect(config.name).toBe('users');
      
      // Verify columns
      const columnNames = config.columns.map(c => c.name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('credits');
      
      // Check constraints (email unique)
      const emailCol = config.columns.find(c => c.name === 'email');
      expect(emailCol?.isUnique).toBe(true);
      expect(emailCol?.notNull).toBe(true);
    });
  });

  describe('SessionChatTable', () => {
    it('should have correct structure and relationship to usersTable', () => {
      const config = getTableConfig(SessionChatTable);
      
      expect(config.name).toBe('sessionChatTable');
      
      const columnNames = config.columns.map(c => c.name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('sessionId');
      expect(columnNames).toContain('notes');
      expect(columnNames).toContain('selectedDoctor');
      expect(columnNames).toContain('conversation');
      expect(columnNames).toContain('report');
      expect(columnNames).toContain('createdBy');
      expect(columnNames).toContain('createdOn');

      // Check foreign key reference (indirectly via column definition if possible)
      const createdByCol = config.columns.find(c => c.name === 'createdBy');
      // In Drizzle, references are usually in config.foreignKeys
      expect(config.foreignKeys.length).toBeGreaterThan(0);
      const fk = config.foreignKeys[0].reference();
      expect(fk.foreignTable === usersTable).toBe(true);
    });
  });
});

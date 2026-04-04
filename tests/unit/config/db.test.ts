import { describe, it, expect, vi, beforeEach } from 'vitest';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// We need to unmock the database config if it's mocked globally
vi.unmock('@/config/db');

// We need to mock the dependencies before importing the module that uses them
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn((url: string) => ({ url })),
}));

vi.mock('drizzle-orm/neon-http', () => ({
  drizzle: vi.fn((client: any) => ({ client })),
}));

describe('Database Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('should initialize neon with the DATABASE_URL', async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    
    // Import inside the test to ensure mocks are applied and env is loaded
    await import('@/config/db');
    
    expect(neon).toHaveBeenCalledWith(process.env.DATABASE_URL);
  });

  it('should export a drizzle instance', async () => {
    const { db } = await import('@/config/db');
    
    expect(db).toBeDefined();
    expect(drizzle).toHaveBeenCalled();
  });
});

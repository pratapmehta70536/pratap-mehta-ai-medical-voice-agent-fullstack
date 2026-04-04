import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/users/route';
import { db } from '@/config/db';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}));

vi.mock('@/config/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  },
}));

describe('users API', () => {
  it('should return existing user if found in database', async () => {
    const mockRequest = {} as NextRequest;
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };

    (currentUser as any).mockResolvedValue({
      fullName: 'Test User',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    });

    // Mock select().from().where() to return existing user
    (db as any).where.mockResolvedValue([mockUser]);

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data).toEqual(mockUser);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('should create and return new user if not found in database', async () => {
    const mockRequest = {} as NextRequest;
    const mockNewUser = { id: 2, email: 'new@example.com', name: 'New User', credits: 10 };

    (currentUser as any).mockResolvedValue({
      fullName: 'New User',
      primaryEmailAddress: { emailAddress: 'new@example.com' },
    });

    // Mock select().from().where() to return empty array (user doesn't exist)
    (db as any).where.mockResolvedValue([]);
    // Mock insert().values().returning() to return new user
    (db as any).returning.mockResolvedValue([{ usersTable: mockNewUser }]);

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data).toEqual(mockNewUser);
    expect(db.insert).toHaveBeenCalled();
  });

  it('should handle errors gracefully during user lookup/creation', async () => {
    const mockRequest = {} as NextRequest;

    (currentUser as any).mockResolvedValue({
      primaryEmailAddress: { emailAddress: 'error@example.com' },
    });

    (db as any).where.mockRejectedValue(new Error('Database error'));

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data).toHaveProperty('message');
  });

  it('should handle users with no email address from Clerk', async () => {
    const mockRequest = {} as NextRequest;

    (currentUser as any).mockResolvedValue({
      fullName: 'No Email User',
      primaryEmailAddress: null,
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    // Since the code uses user?.primaryEmailAddress?.emailAddress, 
    // it will pass undefined to the DB query which might fail or be handled as error
    expect(response.status).toBe(200); // Current implementation returns 200 with error obj in catch
    expect(data).toBeDefined();
  });
});

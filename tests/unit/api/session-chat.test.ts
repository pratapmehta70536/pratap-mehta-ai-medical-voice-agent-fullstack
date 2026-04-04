import { describe, it, expect, vi } from 'vitest';
import { POST, GET } from '@/app/api/session-chat/route';
import { db } from '@/config/db';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}));

vi.mock('@/config/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1, sessionId: 'test-uuid' }]),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  },
}));

describe('session-chat API', () => {
  it('should create a new session (POST)', async () => {
    const mockRequest = {
      json: async () => ({ notes: 'Test notes', selectedDoctor: { id: 1 } }),
    } as NextRequest;

    (currentUser as any).mockResolvedValue({
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data).toHaveProperty('sessionId');
    expect(db.insert).toHaveBeenCalled();
  });

  it('should return 401 if user is not logged in (POST)', async () => {
    const mockRequest = {
      json: async () => ({}),
    } as NextRequest;

    (currentUser as any).mockResolvedValue(null);

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should get all sessions for user (GET)', async () => {
    const mockRequest = {
      url: 'http://localhost/api/session-chat?sessionId=all',
    } as NextRequest;

    (currentUser as any).mockResolvedValue({
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    });

    // Mock select result
    (db as any).execute.mockResolvedValue([{ id: 1, sessionId: 'test-uuid' }]);
    // Actually, drizzle-mock should return something for select().from()...
    // Since we mock the chain, let's make sure it returns something
    (db as any).from.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([{ id: 1, sessionId: 'test-uuid' }]),
    });

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
  });
});

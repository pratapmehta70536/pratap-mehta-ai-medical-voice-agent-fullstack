import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Global mocks for Authentication (Clerk)
vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-id' })),
  currentUser: vi.fn(() => Promise.resolve({ 
    id: 'test-user-id', 
    firstName: 'Test', 
    lastName: 'User',
    primaryEmailAddress: { emailAddress: 'test@example.com' } 
  })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: () => null,
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-id' })),
  currentUser: vi.fn(() => Promise.resolve({ 
    id: 'test-user-id', 
    firstName: 'Test', 
    lastName: 'User',
    primaryEmailAddress: { emailAddress: 'test@example.com' } 
  })),
}));

// Global mocks for Database (Drizzle)
vi.mock('@/config/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  },
}));

// Global mocks for External APIs (OpenAI)
vi.mock('@/config/OpenAiModel', () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: '{"doctors": []}' } }],
        }),
      },
    },
  },
}));

// Mocking Next.js response/request if needed
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

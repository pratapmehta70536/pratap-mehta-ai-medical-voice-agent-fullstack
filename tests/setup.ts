import { vi } from 'vitest';
import React from 'react';
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
  useUser: vi.fn(() => ({
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      fullName: 'Test User',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    },
  })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => React.createElement('div', { 'data-testid': 'user-button' }),
}));

// Global mock for Vapi Web SDK
vi.mock('@vapi-ai/web', () => {
  const mockVapiInstance = {
    start: vi.fn(),
    stop: vi.fn(),
    on: vi.fn(),
    removeAllListeners: vi.fn(),
  };
  return {
    default: vi.fn().mockImplementation(function() {
      return mockVapiInstance;
    }),
  };
});

// Mock next/navigation
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => mockRouter),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/'),
  useParams: vi.fn(() => ({ sessionId: 'test-session-id' })),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => React.createElement('img', props),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    p: ({ children, ...props }: any) => React.createElement('p', props, children),
    h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Global mocks for Database (Drizzle)
vi.mock('@/config/db', () => {
  const mockDb = {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
    execute: vi.fn().mockResolvedValue([]),
  };
  return { db: mockDb };
});

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

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

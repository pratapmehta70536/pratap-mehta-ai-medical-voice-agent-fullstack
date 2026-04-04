import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Automatically clean up after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Global mocks
vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
  auth: vi.fn(),
  clerkMiddleware: vi.fn((handler) => handler),
  createRouteMatcher: vi.fn((routes) => (req: any) => {
    const url = new URL(req.url)
    return routes.some((route: string) => {
      const pattern = route.replace('(.*)', '.*')
      return new RegExp(`^${pattern}$`).test(url.pathname)
    })
  }),
}))

vi.mock('@/config/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  },
}))

vi.mock('@/config/OpenAiModel', () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}))

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@vapi-ai/web', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      start: vi.fn(),
      stop: vi.fn(),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    })),
  }
})

vi.mock('uuidv4', () => ({
  uuid: vi.fn(() => 'test-uuid'),
}))

import { vi } from 'vitest'

export const mockCurrentUser = vi.fn()
export const mockAuth = vi.fn()

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: mockCurrentUser,
  auth: mockAuth,
}))

import { vi } from 'vitest'

export const mockOpenai = {
  chat: {
    completions: {
      create: vi.fn(),
    },
  },
}

vi.mock('@/config/OpenAiModel', () => ({
  openai: mockOpenai,
}))

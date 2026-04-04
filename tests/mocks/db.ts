import { vi } from 'vitest'

export const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn().mockReturnThis(),
  // Mock results
  _results: [] as any[],
  mockResults(results: any[]) {
    this._results = results
    this.returning.mockResolvedValue(results)
    this.where.mockResolvedValue(results)
    return this
  },
}

vi.mock('@/config/db', () => ({
  db: mockDb,
}))

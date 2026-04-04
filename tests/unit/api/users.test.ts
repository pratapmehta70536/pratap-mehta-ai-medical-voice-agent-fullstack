import { describe, expect, it, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/users/route'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/config/db'
import { NextRequest } from 'next/server'

const mockCurrentUser = currentUser as any
const mockDb = db as any

describe('Users API', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('creates a new user if one does not exist', async () => {
    // Mock Clerk user
    mockCurrentUser.mockResolvedValue({
      fullName: 'Pratap Mehta',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    } as any)

    // Mock DB: select returns empty array (user doesn't exist)
    mockDb.select.mockReturnThis()
    mockDb.from.mockReturnThis()
    mockDb.where.mockResolvedValue([]) // No user found

    // Mock DB: insert returns the new user
    const newUser = { id: 1, name: 'Pratap Mehta', email: 'test@example.com', credits: 10 }
    mockDb.insert.mockReturnThis()
    mockDb.values.mockReturnThis()
    mockDb.returning.mockResolvedValue([{ usersTable: newUser }])

    const req = new NextRequest('http://localhost/api/users', { method: 'POST' })
    const response = await POST(req)
    const data = await response.json()

    expect(data).toEqual(newUser)
    expect(mockDb.insert).toHaveBeenCalled()
  })

  it('returns existing user if one exists', async () => {
    const existingUser = { id: 1, name: 'Pratap Mehta', email: 'test@example.com', credits: 10 }
    
    mockCurrentUser.mockResolvedValue({
      fullName: 'Pratap Mehta',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    } as any)

    mockDb.select.mockReturnThis()
    mockDb.from.mockReturnThis()
    mockDb.where.mockResolvedValue([existingUser])

    const req = new NextRequest('http://localhost/api/users', { method: 'POST' })
    const response = await POST(req)
    const data = await response.json()

    expect(data).toEqual(existingUser)
    expect(mockDb.insert).not.toHaveBeenCalled()
  })

  it('handles errors gracefully', async () => {
    mockCurrentUser.mockRejectedValue(new Error('Auth failed'))

    const req = new NextRequest('http://localhost/api/users', { method: 'POST' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})

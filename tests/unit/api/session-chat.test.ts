import { describe, expect, it, vi, beforeEach } from 'vitest'
import { POST, GET } from '@/app/api/session-chat/route'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/config/db'
import { NextRequest } from 'next/server'
import { uuid } from 'uuidv4'

const mockCurrentUser = currentUser as any
const mockDb = db as any
const mockUuid = uuid as any

describe('Session Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST', () => {
    it('creates a new session successfully', async () => {
      mockCurrentUser.mockResolvedValue({
        primaryEmailAddress: { emailAddress: 'test@example.com' },
      } as any)

      mockUuid.mockReturnValue('test-uuid')

      const mockResult = [{ sessionId: 'test-uuid', id: 1 }]
      mockDb.insert.mockReturnThis()
      mockDb.values.mockReturnThis()
      mockDb.returning.mockResolvedValue(mockResult)

      const req = new NextRequest('http://localhost/api/session-chat', {
        method: 'POST',
        body: JSON.stringify({
          notes: 'Test notes',
          selectedDoctor: { name: 'Dr. Smith' },
        }),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult[0])
      expect(mockDb.insert).toHaveBeenCalled()
    })

    it('returns 401 if unauthorized', async () => {
      mockCurrentUser.mockResolvedValue(null)

      const req = new NextRequest('http://localhost/api/session-chat', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('GET', () => {
    it('fetches all sessions for a user', async () => {
      mockCurrentUser.mockResolvedValue({
        primaryEmailAddress: { emailAddress: 'test@example.com' },
      } as any)

      const mockSessions = [{ id: 1, sessionId: 's1' }, { id: 2, sessionId: 's2' }]
      mockDb.select.mockReturnThis()
      mockDb.from.mockReturnThis()
      mockDb.where.mockReturnThis()
      mockDb.orderBy.mockResolvedValue(mockSessions)

      const req = new NextRequest('http://localhost/api/session-chat?sessionId=all')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toEqual(mockSessions)
    })

    it('fetches a specific session by ID', async () => {
      mockCurrentUser.mockResolvedValue({
        primaryEmailAddress: { emailAddress: 'test@example.com' },
      } as any)

      const mockSession = { id: 1, sessionId: 's1' }
      mockDb.select.mockReturnThis()
      mockDb.from.mockReturnThis()
      mockDb.where.mockResolvedValue([mockSession])

      const req = new NextRequest('http://localhost/api/session-chat?sessionId=s1')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toEqual(mockSession)
    })
  })
})

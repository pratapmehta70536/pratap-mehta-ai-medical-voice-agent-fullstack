import { describe, expect, it, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/medical-report/route'
import { openai } from '@/config/OpenAiModel'
import { db } from '@/config/db'
import { NextRequest } from 'next/server'

const mockOpenai = openai as any
const mockDb = db as any

describe('Medical Report API', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('generates a report and saves it to the database', async () => {
    // Mock OpenAI response
    const mockReport = {
      sessionId: '123',
      agent: 'AI Doctor',
      user: 'Pratap Mehta',
      timestamp: '2026-04-04T14:47:01Z',
      chiefComplaint: 'Headache',
      summary: 'Patient has a headache for 2 days.',
      symptoms: ['Headache'],
      duration: '2 days',
      severity: 'mild',
      medicationsMentioned: [],
      recommendations: ['Rest'],
    }
    
    mockOpenai.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '```json' + JSON.stringify(mockReport) + '```' } }],
    })

    // Mock DB: update returns result
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
    mockDb.where.mockResolvedValue({ count: 1 })

    const req = new NextRequest('http://localhost/api/medical-report', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: '123',
        sessionDetail: { agent: 'AI Doctor' },
        messages: [{ role: 'user', content: 'I have a headache' }],
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(data).toEqual(mockReport)
    expect(mockOpenai.chat.completions.create).toHaveBeenCalled()
    expect(mockDb.update).toHaveBeenCalled()
  })

  it('handles invalid JSON from OpenAI', async () => {
    mockOpenai.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'Invalid JSON' } }],
    })

    const req = new NextRequest('http://localhost/api/medical-report', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: '123',
        sessionDetail: {},
        messages: [],
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})

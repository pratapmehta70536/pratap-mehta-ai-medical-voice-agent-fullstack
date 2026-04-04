import { describe, expect, it, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/suggest-doctors/route'
import { openai } from '@/config/OpenAiModel'
import { NextRequest } from 'next/server'
import { AIDoctorAgents } from '@/shared/list'

const mockOpenai = openai as any

describe('Suggest Doctors API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('suggests doctors based on symptoms successfully', async () => {
    // Mock OpenAI response returning a JSON array of IDs [1, 2]
    mockOpenai.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '```json\n[1, 2]\n```' } }],
    })

    const req = new NextRequest('http://localhost/api/suggest-doctors', {
      method: 'POST',
      body: JSON.stringify({ notes: 'fever and cough' }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.length).toBeGreaterThan(0)
    // ID 1 is General Physician
    expect(data.some((doc: any) => doc.id === 1)).toBe(true)
  })

  it('handles OpenAI returning an object with ids array', async () => {
    mockOpenai.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '{"ids": [1, 7]}' } }],
    })

    const req = new NextRequest('http://localhost/api/suggest-doctors', {
      method: 'POST',
      body: JSON.stringify({ notes: 'back pain' }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(data.some((doc: any) => doc.id === 1)).toBe(true)
    expect(data.some((doc: any) => doc.id === 7)).toBe(true)
  })

  it('falls back to General Physician (ID 1) if no doctors found', async () => {
    mockOpenai.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '[]' } }],
    })

    const req = new NextRequest('http://localhost/api/suggest-doctors', {
      method: 'POST',
      body: JSON.stringify({ notes: 'unknown' }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(data.length).toBe(1)
    expect(data[0].id).toBe(1)
  })

  it('handles errors from OpenAI gracefully', async () => {
    mockOpenai.chat.completions.create.mockRejectedValue(new Error('OpenAI failed'))

    const req = new NextRequest('http://localhost/api/suggest-doctors', {
      method: 'POST',
      body: JSON.stringify({ notes: 'test' }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})

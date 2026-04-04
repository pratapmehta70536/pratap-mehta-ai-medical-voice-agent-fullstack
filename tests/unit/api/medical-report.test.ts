import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/medical-report/route';
import { openai } from '@/config/OpenAiModel';
import { db } from '@/config/db';
import { NextRequest } from 'next/server';

vi.mock('@/config/OpenAiModel', () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

vi.mock('@/config/db', () => ({
  db: {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  },
}));

describe('medical-report API', () => {
  it('should generate a medical report and update the database', async () => {
    const mockRequest = {
      json: async () => ({ 
        sessionId: 'test-uuid', 
        sessionDetail: { agent: 'General Physician' }, 
        messages: [{ role: 'user', content: 'hello' }] 
      }),
    } as NextRequest;

    (openai.chat.completions.create as any).mockResolvedValue({
      choices: [{ message: { content: '{"sessionId": "test-uuid", "summary": "Patient is fine"}' } }],
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data.sessionId).toBe('test-uuid');
    expect(db.update).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    const mockRequest = {
      json: async () => ({ sessionId: 'test-uuid' }),
    } as NextRequest;

    (openai.chat.completions.create as any).mockRejectedValue(new Error('AI error'));

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data).toHaveProperty('message');
  });
});

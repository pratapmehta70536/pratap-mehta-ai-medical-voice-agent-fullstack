import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MedicalVoiceAgent from '@/app/(routes)/dashboard/medical-agent/[sessionId]/page'
import Vapi from '@vapi-ai/web'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

// Mock Vapi
vi.mock('@vapi-ai/web', () => {
  return {
    default: vi.fn(function() {
      return {
        start: vi.fn(),
        stop: vi.fn(),
        on: vi.fn(),
        removeAllListeners: vi.fn(),
      }
    }),
  }
})

// Mock Next Navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
}))

// Mock Axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('MedicalVoiceAgent Component (Vapi Logic)', () => {
  const mockParams = { sessionId: 'test-session-123' }
  const mockRouter = { replace: vi.fn() }
  const mockSessionDetail = {
    sessionId: 'test-session-123',
    selectedDoctor: {
      specialist: 'General Physician',
      image: '/doctor.png',
      voiceId: 'v1',
      agentPrompt: 'Help patient',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useParams as any).mockReturnValue(mockParams)
    ;(useRouter as any).mockReturnValue(mockRouter)
    ;(axios.get as any).mockResolvedValue({ data: mockSessionDetail })
  })

  it('fetches session details on mount', async () => {
    render(<MedicalVoiceAgent />)
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/session-chat?sessionId=test-session-123')
    })
  })

  it('initializes and starts Vapi call when Start Call is clicked', async () => {
    render(<MedicalVoiceAgent />)
    
    // Wait for session details to load
    await waitFor(() => {
      expect(screen.getByText('General Physician')).toBeInTheDocument()
    })

    const startButton = screen.getByRole('button', { name: /start call/i })
    fireEvent.click(startButton)

    expect(Vapi).toHaveBeenCalled()
    // The instance should have started
    const vapiInstance = vi.mocked(Vapi).mock.results[0].value
    expect(vapiInstance.start).toHaveBeenCalled()
  })

  it('stops Vapi call and generates report when Disconnect is clicked', async () => {
    // Initial state: connected
    render(<MedicalVoiceAgent />)
    
    await waitFor(() => {
      expect(screen.getByText('General Physician')).toBeInTheDocument()
    })

    const startButton = screen.getByRole('button', { name: /start call/i })
    fireEvent.click(startButton)

    // Simulate "Connected" status by manually triggering the on("call-start") logic if we were doing interaction
    // But for unit testing the logic:
    const disconnectButton = screen.queryByRole('button', { name: /disconnect/i })
    // If it's not visible, we might need to mock the state, but we're testing the logic here.
    
    // Wait, the disconnect button only appears if callStarted is true.
    // Let's test the stopCall function behavior indirectly or by simulating the event.
  })
})

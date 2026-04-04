import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MedicalVoiceAgent from '@/app/(routes)/dashboard/medical-agent/[sessionId]/page';
import Vapi from '@vapi-ai/web';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock axios and next/navigation
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('MedicalVoiceAgent (Vapi Integration)', () => {
  const mockSessionId = 'test-session-id';
  const mockSessionDetail = {
    id: 1,
    sessionId: mockSessionId,
    selectedDoctor: {
      specialist: 'General Physician',
      image: '/doctor.png',
      voiceId: 'voice-1',
      agentPrompt: 'You are a doctor.',
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockSessionDetail });
    mockedAxios.post.mockResolvedValue({ data: { message: 'Success' } });
  });

  it('renders the doctor information after fetching session details', async () => {
    render(<MedicalVoiceAgent />);
    
    await waitFor(() => {
      expect(screen.getByText('General Physician')).toBeInTheDocument();
    });
  });

  it('starts the Vapi call when "Start Call" button is clicked', async () => {
    render(<MedicalVoiceAgent />);
    
    await waitFor(() => screen.getByText('Start Call'));
    const startButton = screen.getByText('Start Call');
    
    fireEvent.click(startButton);
    
    expect(Vapi).toHaveBeenCalled();
    const vapiInstance = vi.mocked(Vapi).mock.results[0].value;
    expect(vapiInstance.start).toHaveBeenCalled();
  });

  it('updates the UI when Vapi call starts', async () => {
    render(<MedicalVoiceAgent />);
    
    await waitFor(() => screen.getByText('Start Call'));
    fireEvent.click(screen.getByText('Start Call'));
    
    const vapiInstance = vi.mocked(Vapi).mock.results[0].value;
    
    // Simulate 'call-start' event inside act()
    const callStartCallback = vapiInstance.on.mock.calls.find((call: any[]) => call[0] === 'call-start')[1];
    await act(async () => {
      callStartCallback();
    });
    
    expect(await screen.findByText('Connected..')).toBeInTheDocument();
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('handles incoming transcripts from Vapi', async () => {
    render(<MedicalVoiceAgent />);
    
    await waitFor(() => screen.getByText('Start Call'));
    fireEvent.click(screen.getByText('Start Call'));
    
    const vapiInstance = vi.mocked(Vapi).mock.results[0].value;
    const messageCallback = vapiInstance.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
    
    // Simulate final transcript message inside act()
    await act(async () => {
      messageCallback({
        type: 'transcript',
        transcriptType: 'final',
        role: 'assistant',
        transcript: 'Hello, how can I help you?'
      });
    });
    
    expect(await screen.findByText(/assistant: Hello, how can I help you?/i)).toBeInTheDocument();
  });

  it('stops the call, generates a report, and redirects to dashboard', async () => {
    render(<MedicalVoiceAgent />);
    
    // 1. Wait for doctor info and Start Call button
    const startButton = await screen.findByText('Start Call');
    fireEvent.click(startButton);
    
    // 2. Simulate Call Start
    await waitFor(() => expect(vi.mocked(Vapi)).toHaveBeenCalled());
    
    const vapiInstance = vi.mocked(Vapi).mock.results[0].value;
    const callStartCallback = vapiInstance.on.mock.calls.find((call: any[]) => call[0] === 'call-start')[1];
    
    await act(async () => {
      callStartCallback();
    });

    // 3. Disconnect
    const disconnectButton = await screen.findByText('Disconnect');
    fireEvent.click(disconnectButton);

    // 4. Verify SDK and API interactions
    await waitFor(() => {
      expect(vapiInstance.stop).toHaveBeenCalled();
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    }, { timeout: 5000 });
    
    // Use the shared mockRouter defined in setup.ts
    const { useRouter } = await import('next/navigation');
    const mockRouter = vi.mocked(useRouter());
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 5000 });
  });
});

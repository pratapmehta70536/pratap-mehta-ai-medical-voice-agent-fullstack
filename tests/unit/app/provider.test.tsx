import { render, waitFor } from '@testing-library/react';
import Provider from '@/app/provider';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock Clerk useUser
vi.mock('@clerk/nextjs', async () => {
  const actual = await vi.importActual('@clerk/nextjs');
  return {
    ...actual as any,
    useUser: vi.fn(),
  };
});

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Provider Component (Auth Sync)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers user synchronization when a user object is present', async () => {
    // Mock user being logged in
    (useUser as any).mockReturnValue({
      user: { id: 'test-user-id', fullName: 'Test User' },
    });

    mockedAxios.post.mockResolvedValue({ data: { name: 'Test User', credits: 10 } });

    render(
      <Provider>
        <div>Content</div>
      </Provider>
    );

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/users');
    });
  });

  it('does not trigger synchronization when no user is logged in', async () => {
    // Mock user being logged out
    (useUser as any).mockReturnValue({
      user: null,
    });

    render(
      <Provider>
        <div>Content</div>
      </Provider>
    );

    // Give it a moment to ensure useEffect isn't triggered
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('performs registration flow when a user logs in (Login-then-Sync sequence)', async () => {
    // 1. Start in logged-out state
    (useUser as any).mockReturnValue({
      user: null,
    });

    const { rerender } = render(
      <Provider>
        <div>Content</div>
      </Provider>
    );

    expect(mockedAxios.post).not.toHaveBeenCalled();

    // 2. Simulate User Logging In (effectively "adding" the test user)
    (useUser as any).mockReturnValue({
      user: { id: 'new-test-user', fullName: 'New Test User' },
    });

    // 3. Trigger a rerender to let useEffect catch the change
    rerender(
      <Provider>
        <div>Content</div>
      </Provider>
    );

    // 4. Verify synchronization is triggered exactly once
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/users');
  });
});

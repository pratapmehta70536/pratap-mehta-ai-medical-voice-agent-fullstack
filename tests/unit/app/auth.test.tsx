import { render, screen } from '@testing-library/react';
import SignInPage from '@/app/(auth)/sign-in/[[...sign-in]]/page';
import SignUpPage from '@/app/(auth)/sign-up/[[...sign-up]]/page';
import { describe, it, expect } from 'vitest';

describe('Authentication Pages', () => {
  it('renders the Clerk SignIn component on the sign-in page', () => {
    render(<SignInPage />);
    expect(screen.getByTestId('sign-in')).toBeInTheDocument();
  });

  it('renders the Clerk SignUp component on the sign-up page', () => {
    render(<SignUpPage />);
    expect(screen.getByTestId('sign-up')).toBeInTheDocument();
  });
});

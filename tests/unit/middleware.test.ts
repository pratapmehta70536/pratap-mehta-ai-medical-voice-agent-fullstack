import { describe, expect, it, vi, beforeEach } from 'vitest'
import clerkMiddlewareFile from '@/proxy'
import { createRouteMatcher } from '@clerk/nextjs/server'

describe('Clerk Middleware (proxy.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('correctly matches public routes', () => {
    const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])
    
    expect(isPublicRoute({ url: 'http://localhost/sign-in' } as any)).toBe(true)
    expect(isPublicRoute({ url: 'http://localhost/sign-up/extra' } as any)).toBe(true)
    expect(isPublicRoute({ url: 'http://localhost/dashboard' } as any)).toBe(false)
  })

  it('protects non-public routes', async () => {
    const mockAuth = {
      protect: vi.fn().mockResolvedValue({}),
    }
    const mockReq = { 
      url: 'http://localhost/dashboard' 
    }

    // Call the middleware function
    await clerkMiddlewareFile(mockAuth as any, mockReq as any)

    expect(mockAuth.protect).toHaveBeenCalled()
  })

  it('does not protect public routes', async () => {
    const mockAuth = {
      protect: vi.fn(),
    }
    const mockReq = { 
      url: 'http://localhost/sign-in' 
    }

    await clerkMiddlewareFile(mockAuth as any, mockReq as any)

    expect(mockAuth.protect).not.toHaveBeenCalled()
  })
})

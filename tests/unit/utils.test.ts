import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('merges tailwind classes', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  it('handles conditional classes', () => {
    expect(cn('bg-red-500', true && 'text-white', false && 'hidden')).toBe('bg-red-500 text-white')
  })

  it('merges conflicting tailwind classes', () => {
    // tailwind-merge should pick the last one
    expect(cn('p-4 p-8')).toBe('p-8')
  })
})

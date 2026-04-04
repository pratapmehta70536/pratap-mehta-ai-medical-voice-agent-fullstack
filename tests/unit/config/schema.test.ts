import { describe, expect, it } from 'vitest'
import { usersTable, SessionChatTable } from '@/config/schema'

describe('Database Schema', () => {
  it('defines usersTable with correct columns', () => {
    // Check if key columns are present
    expect(usersTable).toHaveProperty('id')
    expect(usersTable).toHaveProperty('name')
    expect(usersTable).toHaveProperty('email')
    expect(usersTable).toHaveProperty('credits')
  })

  it('defines SessionChatTable with correct columns', () => {
    // Check if key columns are present
    expect(SessionChatTable).toHaveProperty('id')
    expect(SessionChatTable).toHaveProperty('sessionId')
    expect(SessionChatTable).toHaveProperty('notes')
    expect(SessionChatTable).toHaveProperty('selectedDoctor')
    expect(SessionChatTable).toHaveProperty('report')
    expect(SessionChatTable).toHaveProperty('conversation')
    expect(SessionChatTable).toHaveProperty('createdBy')
    expect(SessionChatTable).toHaveProperty('createdOn')
  })
})

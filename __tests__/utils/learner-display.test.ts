import { getLearnerDisplayName, getLearnerFirstName, getLearnerInitial } from '@/lib/utils/learner-display'

describe('getLearnerDisplayName', () => {
  it('returns the name when a valid name is present', () => {
    expect(getLearnerDisplayName({ name: 'Barada' })).toBe('Barada')
  })

  it('returns the full name unmodified (does not split or truncate)', () => {
    expect(getLearnerDisplayName({ name: 'Barada Satpathy' })).toBe('Barada Satpathy')
  })

  it('falls back to "Learner" when name is missing', () => {
    expect(getLearnerDisplayName({})).toBe('Learner')
    expect(getLearnerDisplayName(null)).toBe('Learner')
    expect(getLearnerDisplayName(undefined)).toBe('Learner')
  })

  it('falls back to "Learner" when name is an empty string', () => {
    expect(getLearnerDisplayName({ name: '' })).toBe('Learner')
  })

  it('trims whitespace and falls back when name is whitespace-only', () => {
    expect(getLearnerDisplayName({ name: '   ' })).toBe('Learner')
  })

  it('trims leading/trailing whitespace from a valid name', () => {
    expect(getLearnerDisplayName({ name: '  Barada  ' })).toBe('Barada')
  })
})

describe('getLearnerFirstName', () => {
  it('returns just the first word of a multi-word name', () => {
    expect(getLearnerFirstName({ name: 'Barada Satpathy' })).toBe('Barada')
  })

  it('returns the whole name when it is a single word', () => {
    expect(getLearnerFirstName({ name: 'Barada' })).toBe('Barada')
  })

  it('falls back to "Learner" when name is missing', () => {
    expect(getLearnerFirstName(null)).toBe('Learner')
    expect(getLearnerFirstName({})).toBe('Learner')
  })
})

describe('getLearnerInitial', () => {
  it('extracts the first character, uppercased, from a valid name', () => {
    expect(getLearnerInitial({ name: 'barada' })).toBe('B')
  })

  it('extracts the first character from a multi-word name', () => {
    expect(getLearnerInitial({ name: 'Barada Satpathy' })).toBe('B')
  })

  it('falls back to "L" when identity is missing entirely', () => {
    expect(getLearnerInitial(null)).toBe('L')
    expect(getLearnerInitial(undefined)).toBe('L')
    expect(getLearnerInitial({})).toBe('L')
  })

  it('falls back to "L" when name is empty or whitespace-only', () => {
    expect(getLearnerInitial({ name: '' })).toBe('L')
    expect(getLearnerInitial({ name: '   ' })).toBe('L')
  })
})

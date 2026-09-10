import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CopyButton } from './shared'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
})

describe('CopyButton', () => {
  it('should render copy button with text', () => {
    render(<CopyButton value="test-value" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should copy text to clipboard when clicked', async () => {
    const testValue = 'test-copy-value'
    render(<CopyButton value={testValue} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testValue)
  })

  it('should show success state after copying', async () => {
    render(<CopyButton value="test" />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Should show check icon after copying
    await screen.findByTestId('check-icon', {}, { timeout: 100 })
  })
})
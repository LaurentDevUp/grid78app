import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    const { container } = render(<Badge>Default</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-blue-100')
  })

  it('applies success variant styles', () => {
    const { container } = render(<Badge variant="success">Success</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-green-100')
  })

  it('applies danger variant styles', () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-red-100')
  })

  it('applies warning variant styles', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-orange-100')
  })

  it('accepts custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>
    )
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('custom-class')
  })
})

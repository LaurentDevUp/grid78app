import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebounce, usePagination, useLocalStorage } from '../hooks'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('debounces value updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated' })

    // Value should not update immediately
    expect(result.current).toBe('initial')

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Value should update after delay
    expect(result.current).toBe('updated')
  })

  it('cancels previous timeout on rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    )

    rerender({ value: 'second' })
    act(() => {
      jest.advanceTimersByTime(250)
    })

    rerender({ value: 'third' })
    act(() => {
      jest.advanceTimersByTime(250)
    })

    // Should still be initial value
    expect(result.current).toBe('first')

    act(() => {
      jest.advanceTimersByTime(250)
    })

    // Should be the last value
    expect(result.current).toBe('third')
  })
})

describe('usePagination', () => {
  const items = Array.from({ length: 50 }, (_, i) => `item-${i}`)

  it('returns first page of items', () => {
    const { result } = renderHook(() => usePagination(items, 20))

    expect(result.current.items).toHaveLength(20)
    expect(result.current.items[0]).toBe('item-0')
    expect(result.current.items[19]).toBe('item-19')
    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(3)
  })

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination(items, 20))

    act(() => {
      result.current.nextPage()
    })

    expect(result.current.currentPage).toBe(2)
    expect(result.current.items[0]).toBe('item-20')
  })

  it('navigates to previous page', () => {
    const { result } = renderHook(() => usePagination(items, 20))

    act(() => {
      result.current.goToPage(2)
    })

    expect(result.current.currentPage).toBe(2)

    act(() => {
      result.current.previousPage()
    })

    expect(result.current.currentPage).toBe(1)
  })

  it('prevents going beyond last page', () => {
    const { result } = renderHook(() => usePagination(items, 20))

    act(() => {
      result.current.goToPage(5)
    })

    expect(result.current.currentPage).toBe(3) // Max page
  })

  it('resets to first page', () => {
    const { result } = renderHook(() => usePagination(items, 20))

    act(() => {
      result.current.goToPage(3)
    })

    expect(result.current.currentPage).toBe(3)

    act(() => {
      result.current.resetPage()
    })

    expect(result.current.currentPage).toBe(1)
  })

  it('calculates hasNextPage and hasPreviousPage correctly', () => {
    const { result } = renderHook(() => usePagination(items, 20))

    expect(result.current.hasPreviousPage).toBe(false)
    expect(result.current.hasNextPage).toBe(true)

    act(() => {
      result.current.goToPage(2)
    })

    expect(result.current.hasPreviousPage).toBe(true)
    expect(result.current.hasNextPage).toBe(true)

    act(() => {
      result.current.goToPage(3)
    })

    expect(result.current.hasPreviousPage).toBe(true)
    expect(result.current.hasNextPage).toBe(false)
  })
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    )

    expect(result.current[0]).toBe('initial')
  })

  it('stores and retrieves value from localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    )

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('test-key')).toBe('"updated"')
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', '"existing"')

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    )

    expect(result.current[0]).toBe('existing')
  })

  it('updates value with function', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 0)
    )

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })
})

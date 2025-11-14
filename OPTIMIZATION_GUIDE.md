# 🚀 Guide d'Optimisation GRID78

## React Query Optimizations

### Cache Strategy

```typescript
// Configured in src/app/providers.tsx
staleTime: 2 * 60 * 1000     // 2 minutes - data considered fresh
gcTime: 5 * 60 * 1000         // 5 minutes - cache cleanup
refetchOnWindowFocus: false   // Disable auto refetch
refetchOnMount: true          // Refetch if stale
refetchOnReconnect: true      // Refetch on network
```

### Per-Resource Stale Times

Adjust in hooks for optimal caching:

```typescript
// Fast-changing data (stats, realtime)
staleTime: 1 * 60 * 1000      // 1 minute

// Medium data (missions, flights)
staleTime: 2 * 60 * 1000      // 2 minutes

// Slow-changing (trainings, profiles)
staleTime: 5 * 60 * 1000      // 5 minutes
```

---

## Realtime Subscriptions

### Generic Hook

```typescript
import { useRealtimeSubscription } from '@/lib/supabase/realtime'

useRealtimeSubscription({
  table: 'missions',
  event: '*',
  filter: 'status=eq.planned',
  invalidateQueries: [['missions'], ['team-stats']],
})
```

### Pre-built Hooks

```typescript
// In components
import { useMissionsRealtimeSync } from '@/lib/supabase/realtime'

function MissionsPage() {
  useMissionsRealtimeSync()  // Auto invalidate on changes
  // ...
}
```

### Available Hooks

- `useAvailabilitiesRealtimeSync(userId)` - Availabilities
- `useMissionsRealtimeSync()` - Missions
- `useFlightsRealtimeSync(missionId)` - Flights
- `useTrainingsRealtimeSync(userId)` - Trainings
- `useSafetyGuidelinesRealtimeSync()` - Guidelines

---

## Performance Hooks

### Debounce Search

```typescript
import { useDebounce } from '@/lib/utils/hooks'

function SearchBar() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  
  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchAPI(debouncedSearch),
  })
}
```

### Pagination

```typescript
import { usePagination } from '@/lib/utils/hooks'

function MissionsList({ missions }: { missions: Mission[] }) {
  const {
    items,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  } = usePagination(missions, 20)

  return (
    <>
      {items.map(mission => <MissionCard key={mission.id} mission={mission} />)}
      
      <div className="pagination">
        <button onClick={previousPage} disabled={!hasPreviousPage}>
          Previous
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button onClick={nextPage} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </>
  )
}
```

### LocalStorage Persistence

```typescript
import { useLocalStorage } from '@/lib/utils/hooks'

function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}
```

---

## Component Optimizations

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react'

// Memo heavy components
export const MissionCard = memo(function MissionCard({ mission }: Props) {
  // Component logic
})

// Memo computed values
const sortedMissions = useMemo(() => {
  return missions.sort((a, b) => a.date.localeCompare(b.date))
}, [missions])

// Memo callbacks passed as props
const handleClick = useCallback(() => {
  onSelect(mission.id)
}, [mission.id, onSelect])
```

### Lazy Loading Routes

```typescript
import dynamic from 'next/dynamic'

// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
})

// Lazy load modals (only load when opened)
const MissionForm = dynamic(() => import('@/components/missions/MissionForm'))
```

---

## Error Handling

### Error Boundary

```typescript
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
```

### Suspense Boundaries

```typescript
import { Suspense } from 'react'
import { SuspenseFallback } from '@/components/shared/ErrorBoundary'

export default function Page() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AsyncComponent />
    </Suspense>
  )
}
```

### Loading Skeletons

```typescript
import { CardSkeleton, TableRowSkeleton } from '@/components/shared/ErrorBoundary'

function MissionsList() {
  const { data, isLoading } = useMissions()

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return /* ... */
}
```

---

## Best Practices

### ✅ DO

1. **Use Realtime hooks** for data that changes frequently
2. **Debounce search** inputs (500ms recommended)
3. **Paginate lists** over 20 items
4. **Memo heavy components** (charts, tables, lists)
5. **Lazy load** modals and heavy features
6. **Use Error Boundaries** around major sections
7. **Add loading skeletons** for better UX
8. **Keep staleTime appropriate** per resource
9. **Invalidate specific queries** not all
10. **Cleanup subscriptions** on unmount

### ❌ DON'T

1. **Don't refetch** on every window focus
2. **Don't cache forever** (max 10 min)
3. **Don't load all data** upfront (paginate)
4. **Don't subscribe globally** (filter by user/id)
5. **Don't re-render** unnecessarily (use memo)
6. **Don't fetch in loops** (batch requests)
7. **Don't block UI** (use suspense/async)
8. **Don't ignore errors** (add boundaries)
9. **Don't duplicate subscriptions** (check existing)
10. **Don't forget cleanup** (return from useEffect)

---

## Performance Metrics

### Target Metrics

| Metric | Target | Tool |
|--------|--------|------|
| **First Contentful Paint (FCP)** | < 1.8s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3.8s | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **Bundle Size** | < 300KB gzipped | webpack-bundle-analyzer |
| **Query Response** | < 200ms | React Query Devtools |

### Monitoring Tools

```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:3000 --view

# Bundle analyzer
npm install -D @next/bundle-analyzer
# Add to next.config.js

# React Query Devtools (dev only)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

---

## Quick Wins

### 1. Enable Pagination

```typescript
// Before: Load all missions
const { missions } = useMissions()

// After: Paginate
const { items } = usePagination(missions, 20)
```

### 2. Debounce Search

```typescript
// Before: Search on every keystroke
const { data } = useQuery(['search', searchTerm], ...)

// After: Debounce 500ms
const debouncedTerm = useDebounce(searchTerm, 500)
const { data } = useQuery(['search', debouncedTerm], ...)
```

### 3. Memo Components

```typescript
// Before: Re-render on every parent render
function MissionCard({ mission }) { ... }

// After: Only re-render if mission changes
const MissionCard = memo(function MissionCard({ mission }) { ... })
```

### 4. Lazy Load Modals

```typescript
// Before: Load upfront
import { MissionForm } from '@/components/missions/MissionForm'

// After: Load on open
const MissionForm = dynamic(() => import('@/components/missions/MissionForm'))
```

### 5. Add Realtime Sync

```typescript
// Before: Manual refetch
const { refetch } = useMissions()
setInterval(refetch, 5000)

// After: Realtime
useMissionsRealtimeSync()  // Auto-invalidate
```

---

## Testing Performance

### Before Optimization

```bash
npm run build
npm start
# Open DevTools > Performance
# Record page load
# Note: FCP, LCP, TTI
```

### After Optimization

```bash
# Compare metrics
# Expected improvements:
# - FCP: -20-30%
# - Bundle size: -15-25%
# - Re-renders: -40-60%
# - Query count: -30-50%
```

---

## Checklist

- [ ] React Query config optimized
- [ ] Realtime subscriptions added
- [ ] Search inputs debounced
- [ ] Large lists paginated
- [ ] Heavy components memoized
- [ ] Modals lazy loaded
- [ ] Error boundaries added
- [ ] Loading skeletons implemented
- [ ] Performance metrics checked
- [ ] Bundle size analyzed

---

**Next**: Run Lighthouse audit and fix remaining issues

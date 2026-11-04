import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router'
import { useState } from 'react'
import { AuthProvider } from '../features/auth/hooks/AuthProvider'
import { AppRoutes } from './router'

export default function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MotionConfig>
      </AuthProvider>
    </QueryClientProvider>
  )
}

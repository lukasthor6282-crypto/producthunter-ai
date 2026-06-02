import { useEffect, useState } from 'react'
import { mockDashboard } from '../data/mockStaticData'
import { getDashboard } from '../services/productApi'
import type { DashboardData } from '../types/product'

export function useProducts() {
  const [dashboard, setDashboard] = useState<DashboardData>(mockDashboard)
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    let mounted = true
    getDashboard()
      .then((data) => {
        if (mounted) {
          setDashboard(data)
          setUsingMockData(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setDashboard(mockDashboard)
          setUsingMockData(true)
        }
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  return { dashboard, loading, usingMockData }
}


import { useCallback, useRef, type MouseEvent } from 'react'

export function useMouseTilt(maxTilt = 7) {
  const elementRef = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const element = elementRef.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      const rotateX = (0.5 - y) * maxTilt
      const rotateY = (x - 0.5) * maxTilt
      element.style.setProperty('--spot-x', `${x * 100}%`)
      element.style.setProperty('--spot-y', `${y * 100}%`)
      element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    },
    [maxTilt],
  )

  const onMouseLeave = useCallback(() => {
    const element = elementRef.current
    if (!element) return
    element.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }, [])

  return [elementRef, onMouseMove, onMouseLeave] as const
}

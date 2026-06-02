import { FloatingIconLayer } from './FloatingIconLayer'
import { FloatingOrbs } from './FloatingOrbs'

export function SpatialBackground() {
  return (
    <div className="mesh-background fixed inset-0 -z-10">
      <div className="fine-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.18),rgba(5,7,10,0.9))]" />
      <FloatingOrbs />
      <FloatingIconLayer />
    </div>
  )
}


import { ParticleField } from "./ParticleField";

export function SpatialBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-field" />
      <ParticleField />
      <div className="spotlight-line left-[20%] top-16" />
      <div className="spotlight-line bottom-20 right-[4%]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/[0.06] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-obsidian to-transparent" />
    </div>
  );
}

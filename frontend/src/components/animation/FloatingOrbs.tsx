export function FloatingOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-ribbon left-[-16%] top-[18%]" />
      <div className="ambient-ribbon right-[-10%] top-[62%] rotate-[11deg] bg-[linear-gradient(90deg,transparent,rgba(248,184,92,0.12),rgba(195,129,255,0.06),transparent)]" />
      <div className="ambient-ribbon left-[34%] top-[-6%] w-[36vw] rotate-[4deg] opacity-45" />
      <div className="depth-scanline top-[29%]" />
      <div className="depth-scanline bottom-[18%] [animation-delay:4s]" />
    </div>
  );
}

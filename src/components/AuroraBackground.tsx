/** Ambient animated background: deep gradient + drifting aurora + faint grid + particles. */
export function AuroraBackground({ particles = 22 }: { particles?: number }) {
  const dots = Array.from({ length: particles }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 61) % 100}%`,
    delay: `${(i % 9) * 0.7}s`,
    size: 1 + (i % 3),
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,var(--glass-2),transparent_60%)]" />
      <div className="animate-aurora absolute -top-1/3 left-[-10%] h-[70vh] w-[70vw] rounded-full bg-cyan/20 blur-[120px]" />
      <div
        className="animate-aurora absolute top-[20%] right-[-15%] h-[60vh] w-[60vw] rounded-full bg-violet/20 blur-[130px]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="animate-aurora absolute bottom-[-25%] left-[20%] h-[55vh] w-[55vw] rounded-full bg-magenta/12 blur-[140px]"
        style={{ animationDelay: "-16s" }}
      />
      <div className="grid-faint absolute inset-0 opacity-40 [mask-image:radial-gradient(80%_60%_at_50%_30%,black,transparent)]" />
      {dots.map((d, i) => (
        <span
          key={i}
          className="animate-float-slow absolute rounded-full bg-foreground/40"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}

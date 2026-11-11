import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/ai/agents";
import { GlassPanel } from "@/components/Glass";
<<<<<<< HEAD
import { X, Activity } from "lucide-react";
=======
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

const ACCENT: Record<string, string> = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  magenta: "var(--magenta)",
  softblue: "var(--softblue)",
  success: "var(--success)",
};

<<<<<<< HEAD
/** Interactive SVG agent network with animated data flow, hover + click details. */
export function AgentNetwork() {
  const outer = AGENTS.filter((a) => a.key !== "coordinator").slice(0, 9);
  const [flow, setFlow] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Animate data flow
=======
/** 2D SVG agent network with animated data flow along connections. */
export function AgentNetwork() {
  const outer = AGENTS.filter((a) => a.key !== "coordinator").slice(0, 9);
  const [flow, setFlow] = useState(0);

>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
  useEffect(() => {
    const t = setInterval(() => setFlow((f) => (f + 1) % outer.length), 1400);
    return () => clearInterval(t);
  }, [outer.length]);

  const cx = 300;
  const cy = 220;
  const R = 165;
<<<<<<< HEAD

  const nodes = outer.map((a, i) => {
    const angle = (i / outer.length) * Math.PI * 2 - Math.PI / 2;
    return {
      agent: a,
      x: cx + Math.cos(angle) * R,
      y: cy + Math.sin(angle) * R,
    };
  });

  const coordinator = AGENTS.find((a) => a.key === "coordinator");
  const selectedAgent = AGENTS.find((a) => a.key === selected) ?? null;

  return (
    <GlassPanel level={2} className="relative overflow-hidden p-2">
      {/* SVG Network */}
      <svg
        viewBox="0 0 600 440"
        className="h-[420px] w-full"
        role="img"
        aria-label="Campus agent network"
      >
=======
  const nodes = outer.map((a, i) => {
    const angle = (i / outer.length) * Math.PI * 2 - Math.PI / 2;
    return { agent: a, x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
  });

  return (
    <GlassPanel level={2} className="overflow-hidden p-2">
      <svg viewBox="0 0 600 440" className="h-[420px] w-full" role="img" aria-label="Campus agent network">
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </radialGradient>
<<<<<<< HEAD
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind center */}
        <circle cx={cx} cy={cy} r={110} fill="url(#coreGlow)" opacity={0.35} />

        {/* Connection lines */}
        {nodes.map((n, i) => {
          const isActive = flow === i;
          const isHovered = hovered === n.agent.key;
          const isSelected = selected === n.agent.key;
          const emphasize = isActive || isHovered || isSelected;

          return (
            <g key={`line-${n.agent.key}`}>
              <line
                x1={cx}
                y1={cy}
                x2={n.x}
                y2={n.y}
                stroke={ACCENT[n.agent.accent]}
                strokeWidth={emphasize ? 2.5 : 1}
                opacity={emphasize ? 0.9 : 0.2}
                style={{ transition: "opacity 200ms, stroke-width 200ms" }}
              />
              {isActive ? (
                <circle r={5} fill={ACCENT[n.agent.accent]} filter="url(#nodeGlow)">
                  <animate
                    attributeName="cx"
                    values={`${cx};${n.x}`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${cy};${n.y}`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              ) : null}
            </g>
          );
        })}

        {/* Agent nodes */}
        {nodes.map((n, i) => {
          const isActive = flow === i;
          const isHovered = hovered === n.agent.key;
          const isSelected = selected === n.agent.key;
          const emphasize = isActive || isHovered || isSelected;
          const radius = emphasize ? 17 : 12;

          return (
            <g
              key={`node-${n.agent.key}`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(n.agent.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                setSelected(selected === n.agent.key ? null : n.agent.key)
              }
            >
              {/* Invisible hit area for easier clicking */}
              <circle cx={n.x} cy={n.y} r={24} fill="transparent" />

              {/* Halo when hovered/selected */}
              {emphasize && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={radius + 8}
                  fill={ACCENT[n.agent.accent]}
                  opacity={0.15}
                  style={{ transition: "r 200ms" }}
                />
              )}

              {/* Node circle */}
              <circle
                cx={n.x}
                cy={n.y}
                r={radius}
                fill="var(--background)"
                stroke={ACCENT[n.agent.accent]}
                strokeWidth={emphasize ? 2.5 : 1.6}
                filter={emphasize ? "url(#nodeGlow)" : undefined}
                style={{ transition: "r 200ms, stroke-width 200ms" }}
              />

              {/* Center dot */}
              <circle
                cx={n.x}
                cy={n.y}
                r={5}
                fill={ACCENT[n.agent.accent]}
                opacity={emphasize ? 1 : 0.6}
              />

              {/* Agent name label */}
              <text
                x={n.x}
                y={n.y + (n.y < cy ? -26 : 32)}
                textAnchor="middle"
                className="fill-muted-foreground font-mono pointer-events-none"
                style={{ fontSize: 9, letterSpacing: "0.12em" }}
              >
                {n.agent.name.replace(" Agent", "").toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Coordinator center */}
        <g
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHovered("coordinator")}
          onMouseLeave={() => setHovered(null)}
          onClick={() =>
            setSelected(selected === "coordinator" ? null : "coordinator")
          }
        >
          {hovered === "coordinator" || selected === "coordinator" ? (
            <circle
              cx={cx}
              cy={cy}
              r={56}
              fill="var(--cyan)"
              opacity={0.2}
              style={{ transition: "r 200ms" }}
            />
          ) : null}
          <circle
            cx={cx}
            cy={cy}
            r={46}
            fill="var(--glass-3)"
            stroke="var(--cyan)"
            strokeWidth={selected === "coordinator" ? 2.5 : 1.4}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="fill-foreground pointer-events-none"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            COORDINATOR
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            className="fill-muted-foreground pointer-events-none"
            style={{ fontSize: 10 }}
          >
            AGENT
          </text>
        </g>
      </svg>

      {/* Hint overlay (bottom) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Click any agent to see details
        </p>
      </div>

      {/* Detail panel */}
      {selectedAgent && (
        <div
          className="absolute inset-0 z-20 grid place-items-end bg-gradient-to-t from-background/80 via-background/40 to-transparent p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-3 w-full rounded-2xl p-4 shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span
                  className="grid size-10 place-items-center rounded-xl"
                  style={{
                    backgroundColor: `${ACCENT[selectedAgent.accent]}22`,
                    color: ACCENT[selectedAgent.accent],
                  }}
                >
                  <selectedAgent.icon className="size-5" />
                </span>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Agent
                  </p>
                  <p className="font-semibold text-sm">{selectedAgent.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-primary/10"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">{selectedAgent.role}</p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-primary/5 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: ACCENT[selectedAgent.accent] }}
                  />
                  Active
                </p>
              </div>
              <div className="rounded-lg bg-primary/5 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Network
                </p>
                <p className="mt-0.5 font-medium flex items-center gap-1.5">
                  <Activity className="size-3" />
                  Connected
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
=======
        </defs>
        <circle cx={cx} cy={cy} r={110} fill="url(#coreGlow)" opacity={0.35} />
        {nodes.map((n, i) => (
          <g key={n.agent.key}>
            <line
              x1={cx}
              y1={cy}
              x2={n.x}
              y2={n.y}
              stroke={ACCENT[n.agent.accent]}
              strokeWidth={flow === i ? 2 : 1}
              opacity={flow === i ? 0.9 : 0.25}
            />
            {flow === i ? (
              <circle r={4} fill={ACCENT[n.agent.accent]}>
                <animate attributeName="cx" values={`${cx};${n.x}`} dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="cy" values={`${cy};${n.y}`} dur="1.2s" repeatCount="indefinite" />
              </circle>
            ) : null}
          </g>
        ))}
        {nodes.map((n, i) => (
          <g key={`${n.agent.key}-node`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={flow === i ? 15 : 11}
              fill="var(--background)"
              stroke={ACCENT[n.agent.accent]}
              strokeWidth={1.6}
              opacity={0.95}
            />
            <circle cx={n.x} cy={n.y} r={5} fill={ACCENT[n.agent.accent]} opacity={flow === i ? 1 : 0.6} />
            <text
              x={n.x}
              y={n.y + (n.y < cy ? -22 : 28)}
              textAnchor="middle"
              className="fill-muted-foreground font-mono"
              style={{ fontSize: 9, letterSpacing: "0.12em" }}
            >
              {n.agent.name.replace(" Agent", "").toUpperCase()}
            </text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r={46} fill="var(--glass-3)" stroke="var(--cyan)" strokeWidth={1.4} />
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>
          COORDINATOR
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
          AGENT
        </text>
      </svg>
    </GlassPanel>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

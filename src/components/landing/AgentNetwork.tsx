import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/ai/agents";
import { GlassPanel } from "@/components/Glass";

const ACCENT: Record<string, string> = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  magenta: "var(--magenta)",
  softblue: "var(--softblue)",
  success: "var(--success)",
};

/** 2D SVG agent network with animated data flow along connections. */
export function AgentNetwork() {
  const outer = AGENTS.filter((a) => a.key !== "coordinator").slice(0, 9);
  const [flow, setFlow] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFlow((f) => (f + 1) % outer.length), 1400);
    return () => clearInterval(t);
  }, [outer.length]);

  const cx = 300;
  const cy = 220;
  const R = 165;
  const nodes = outer.map((a, i) => {
    const angle = (i / outer.length) * Math.PI * 2 - Math.PI / 2;
    return { agent: a, x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
  });

  return (
    <GlassPanel level={2} className="overflow-hidden p-2">
      <svg viewBox="0 0 600 440" className="h-[420px] w-full" role="img" aria-label="Campus agent network">
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </radialGradient>
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

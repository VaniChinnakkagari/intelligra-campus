import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { useState, useRef } from "react";
import { 
  Play, 
  RefreshCw, 
  GitBranch, 
  Target,
  Layers,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  CAMPUS_NODES, 
  CAMPUS_EDGES, 
  bfs, 
  dfs, 
  astar,
  nodeById,
  walkMinutes,
  type SearchResult
} from "@/lib/campus-graph";
import { solveCsp, type CspVariable, type CspResult } from "@/lib/engine";

export const Route = createFileRoute("/_authenticated/algorithms")({
  component: Page,
});

type Algorithm = 'bfs' | 'dfs' | 'astar' | 'csp';

function Page() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [startNode, setStartNode] = useState('gate');
  const [goalNode, setGoalNode] = useState('lab4');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [cspResult, setCspResult] = useState<CspResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runAlgorithm = () => {
    if (algorithm === 'csp') {
      runCsp();
      return;
    }
    
    let res: SearchResult;
    switch (algorithm) {
      case 'bfs':
        res = bfs(startNode, goalNode);
        break;
      case 'dfs':
        res = dfs(startNode, goalNode);
        break;
      case 'astar':
        res = astar(startNode, goalNode);
        break;
      default:
        return;
    }
    setResult(res);
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const runCsp = () => {
    const variables: CspVariable[] = [
      { id: 'monday', label: 'Monday', domain: ['CS301', 'CS302', 'AI301'] },
      { id: 'tuesday', label: 'Tuesday', domain: ['CS401', 'AI302', 'EC301'] },
      { id: 'wednesday', label: 'Wednesday', domain: ['CS301', 'CS302', 'AI301'] },
      { id: 'thursday', label: 'Thursday', domain: ['CS401', 'AI302', 'EC301'] },
      { id: 'friday', label: 'Friday', domain: ['CS301', 'CS302', 'AI301'] },
    ];
    const conflicts: Array<[string, string]> = [
      ['monday', 'wednesday'],
      ['tuesday', 'thursday'],
      ['monday', 'friday'],
    ];
    const res = solveCsp(variables, conflicts);
    setCspResult(res);
    setResult(null);
  };

  const nextStep = () => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const playSteps = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    setIsPlaying(true);
    let i = currentStep;
    intervalRef.current = setInterval(() => {
      if (i < (result?.steps.length || 0) - 1) {
        i++;
        setCurrentStep(i);
      } else {
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 500);
  };

  const resetVisualization = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setResult(null);
    setCspResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const renderGraph = () => {
    const step = result?.steps[currentStep];
    const path = result?.path || [];
    const visited = step?.visited || [];
    const frontier = step?.frontier || [];

    return (
      <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-background/50 p-4">
        <svg viewBox="-50 -50 600 500" className="h-full w-full">
          {/* Edges */}
          {CAMPUS_EDGES.map(([a, b], i) => {
            const from = nodeById(a);
            const to = nodeById(b);
            const isInPath = path.includes(a) && path.includes(b) && 
              Math.abs(path.indexOf(a) - path.indexOf(b)) === 1;
            const isVisited = visited.includes(a) && visited.includes(b);
            
            return (
              <line
                key={i}
                x1={from.x + 20}
                y1={from.y + 20}
                x2={to.x + 20}
                y2={to.y + 20}
                stroke={isInPath ? '#00d4ff' : isVisited ? 'rgba(100,100,255,0.3)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isInPath ? 3 : 1.5}
                strokeDasharray={isInPath ? 'none' : '4 4'}
              />
            );
          })}

          {/* Nodes */}
          {CAMPUS_NODES.map((node) => {
            const isStart = node.id === startNode;
            const isGoal = node.id === goalNode;
            const isVisited = visited.includes(node.id);
            const isFrontier = frontier.includes(node.id);
            const isInPath = path.includes(node.id);
            const isCurrent = step?.node === node.id;

            let fill = 'rgba(255,255,255,0.1)';
            let stroke = 'rgba(255,255,255,0.2)';
            let r = 16;

            if (isStart) { fill = '#00d4ff'; stroke = '#00d4ff'; r = 20; }
            else if (isGoal) { fill = '#ff6b6b'; stroke = '#ff6b6b'; r = 20; }
            else if (isCurrent) { fill = '#ffd93d'; stroke = '#ffd93d'; r = 22; }
            else if (isInPath) { fill = '#00d4ff'; stroke = '#00d4ff'; r = 18; }
            else if (isVisited) { fill = 'rgba(100,100,255,0.4)'; stroke = 'rgba(100,100,255,0.6)'; }
            else if (isFrontier) { fill = 'rgba(255,200,50,0.3)'; stroke = 'rgba(255,200,50,0.6)'; }

            return (
              <g key={node.id}>
                <circle
                  cx={node.x + 20}
                  cy={node.y + 20}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x + 20}
                  y={node.y + 20 + 4}
                  textAnchor="middle"
                  className="text-[8px] font-medium fill-foreground"
                >
                  {node.label.slice(0, 8)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-[#00d4ff]" /> Start
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-[#ff6b6b]" /> Goal
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-[#ffd93d]" /> Current
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-blue-400/40" /> Visited
          </span>
        </div>
      </div>
    );
  };

  const renderCspResult = () => {
    if (!cspResult) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <GlassPanel className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className={`text-lg font-semibold ${cspResult.solved ? 'text-green-400' : 'text-red-400'}`}>
              {cspResult.solved ? '✅ Solved' : '❌ Unsolved'}
            </p>
          </GlassPanel>
          <GlassPanel className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Variables</p>
            <p className="text-lg font-semibold">{Object.keys(cspResult.assignment).length}</p>
          </GlassPanel>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-semibold mb-2 text-green-400">Hard Constraints ✓</p>
            {cspResult.hardChecks.map((check, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {check.ok ? <Check className="size-3 text-green-400" /> : <X className="size-3 text-red-400" />}
                <span className={check.ok ? 'text-green-400/80' : 'text-red-400/80'}>{check.name}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold mb-2 text-yellow-400">Soft Constraints</p>
            {cspResult.softChecks.map((check, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {check.ok ? <Check className="size-3 text-green-400" /> : <X className="size-3 text-red-400" />}
                <span className={check.ok ? 'text-green-400/80' : 'text-red-400/80'}>{check.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded bg-primary/5 p-3">
          <p className="text-xs font-semibold mb-2">Assignment</p>
          {Object.entries(cspResult.assignment).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">{String(key)}:</span>
              <span className="font-medium text-cyan-400">{String(value)}</span>
            </div>
          ))}
        </div>

        <div className="max-h-32 overflow-y-auto space-y-1">
          {cspResult.trace.slice(-5).map((t, i) => (
            <div key={i} className="rounded bg-primary/5 p-2 text-xs">
              <span className="text-muted-foreground">{t.variable}</span>
              {t.assigned ? (
                <span className="text-green-400"> → {t.assigned}</span>
              ) : (
                <span className="text-red-400"> backtracked</span>
              )}
              <span className="block text-[10px] text-muted-foreground">{t.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader 
        title="Algorithm Lab" 
        subtitle="Interactive BFS, DFS, A* and CSP visualisations on the campus graph." 
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Visualization */}
        <div>
          <GlassPanel level={2} className="overflow-hidden p-4">
            {algorithm === 'csp' ? (
              <div className="min-h-[400px] p-4">
                {cspResult ? renderCspResult() : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Run CSP to see results
                  </div>
                )}
              </div>
            ) : (
              renderGraph()
            )}
          </GlassPanel>

          {/* Algorithm Info */}
          {result && (
            <GlassPanel level={2} className="mt-4 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Algorithm: <span className="font-semibold text-cyan-400">{result.algorithm}</span></span>
                  <span className="text-muted-foreground">Explored: <span className="font-semibold">{result.explored}</span></span>
                  <span className="text-muted-foreground">Cost: <span className="font-semibold">{result.cost}m</span></span>
                  <span className="text-muted-foreground">Time: <span className="font-semibold">{walkMinutes(result.cost)}min</span></span>
                </div>
                {result.path.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.path.map((node, i) => (
                      <span key={i} className="text-xs">
                        {nodeById(node).label}
                        {i < result.path.length - 1 && ' → '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </GlassPanel>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <GlassPanel level={2} className="p-4">
            <h3 className="text-sm font-semibold mb-3">Algorithm Selection</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bfs', label: 'BFS', icon: GitBranch },
                { id: 'dfs', label: 'DFS', icon: GitBranch },
                { id: 'astar', label: 'A*', icon: Target },
                { id: 'csp', label: 'CSP', icon: Layers },
              ].map((algo) => {
                const Icon = algo.icon;
                return (
                  <button
                    key={algo.id}
                    onClick={() => {
                      setAlgorithm(algo.id as Algorithm);
                      resetVisualization();
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                      algorithm === algo.id 
                        ? 'glass border-primary/50 text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="size-4" />
                    {algo.label}
                  </button>
                );
              })}
            </div>
          </GlassPanel>

          {algorithm !== 'csp' && (
            <GlassPanel level={2} className="p-4">
              <h3 className="text-sm font-semibold mb-3">Graph Settings</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Start</p>
                  <select
                    value={startNode}
                    onChange={(e) => setStartNode(e.target.value)}
                    className="w-full rounded-lg bg-background/50 px-3 py-2 text-sm"
                  >
                    {CAMPUS_NODES.map((node) => (
                      <option key={node.id} value={node.id}>{node.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Goal</p>
                  <select
                    value={goalNode}
                    onChange={(e) => setGoalNode(e.target.value)}
                    className="w-full rounded-lg bg-background/50 px-3 py-2 text-sm"
                  >
                    {CAMPUS_NODES.map((node) => (
                      <option key={node.id} value={node.id}>{node.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </GlassPanel>
          )}

          <GlassPanel level={2} className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={runAlgorithm} className="flex-1 gap-2">
                <Play className="size-4" /> Run
              </Button>
              <Button variant="outline" onClick={resetVisualization} className="gap-2">
                <RefreshCw className="size-4" /> Reset
              </Button>
            </div>

            {result && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                  ←
                </Button>
                <Button size="sm" variant="outline" onClick={playSteps} className="flex-1">
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </Button>
                <Button size="sm" variant="outline" onClick={nextStep} disabled={currentStep >= (result.steps.length - 1)}>
                  →
                </Button>
                <span className="flex items-center text-xs text-muted-foreground">
                  {currentStep + 1}/{result.steps.length}
                </span>
              </div>
            )}

            {result && result.steps[currentStep] && (
              <div className="mt-3 rounded bg-primary/5 p-2 text-xs">
                <p className="text-muted-foreground">Step {currentStep + 1}</p>
                <p className="font-medium">{result.steps[currentStep].note}</p>
                {result.steps[currentStep].g !== undefined && (
                  <div className="flex gap-3 mt-1 text-[10px]">
                    <span>g(n): {result.steps[currentStep].g}</span>
                    <span>h(n): {result.steps[currentStep].h}</span>
                    <span>f(n): {result.steps[currentStep].f}</span>
                  </div>
                )}
              </div>
            )}
          </GlassPanel>

          {/* Formula Display for A* */}
          {algorithm === 'astar' && (
            <GlassPanel level={2} className="p-4">
              <h3 className="text-sm font-semibold mb-2">A* Formula</h3>
              <div className="rounded bg-primary/5 p-3 text-center font-mono text-sm">
                f(n) = g(n) + h(n)
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Where g(n) = cost from start, h(n) = heuristic distance to goal
              </p>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}
/** Campus navigation graph used by BFS / DFS / A* implementations. */
export type CampusNode = {
  id: string;
  label: string;
  x: number; // metres, campus plan coordinates
  y: number;
  kind: "gate" | "academic" | "lab" | "amenity" | "transport" | "residence" | "sport";
};

export const CAMPUS_NODES: CampusNode[] = [
  { id: "gate", label: "Main Gate", x: 0, y: 0, kind: "gate" },
  { id: "parking", label: "Parking", x: 90, y: -70, kind: "transport" },
  { id: "busstop", label: "Bus Stop", x: -80, y: -60, kind: "transport" },
  { id: "academic", label: "Academic Block", x: 140, y: 60, kind: "academic" },
  { id: "cse", label: "CSE Block", x: 260, y: 120, kind: "academic" },
  { id: "lab4", label: "Lab 4", x: 320, y: 40, kind: "lab" },
  { id: "library", label: "Library", x: 120, y: 200, kind: "amenity" },
  { id: "auditorium", label: "Auditorium", x: 20, y: 150, kind: "amenity" },
  { id: "cafeteria", label: "Cafeteria", x: 220, y: 240, kind: "amenity" },
  { id: "hostel", label: "Hostel", x: 380, y: 250, kind: "residence" },
  { id: "sports", label: "Sports Complex", x: -60, y: 250, kind: "sport" },
  { id: "sciencelab", label: "Science Lab", x: 200, y: -40, kind: "lab" },
];

export const CAMPUS_EDGES: Array<[string, string]> = [
  ["gate", "parking"],
  ["gate", "busstop"],
  ["gate", "academic"],
  ["gate", "auditorium"],
  ["parking", "sciencelab"],
  ["academic", "sciencelab"],
  ["academic", "cse"],
  ["academic", "library"],
  ["cse", "lab4"],
  ["cse", "cafeteria"],
  ["sciencelab", "lab4"],
  ["library", "cafeteria"],
  ["library", "auditorium"],
  ["cafeteria", "hostel"],
  ["auditorium", "sports"],
  ["sports", "library"],
  ["hostel", "cse"],
  ["busstop", "auditorium"],
];

export const nodeById = (id: string) => CAMPUS_NODES.find((n) => n.id === id)!;

export function dist(a: string, b: string) {
  const p = nodeById(a);
  const q = nodeById(b);
  return Math.round(Math.hypot(p.x - q.x, p.y - q.y));
}

export function adjacency(): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const n of CAMPUS_NODES) adj[n.id] = [];
  for (const [a, b] of CAMPUS_EDGES) {
    adj[a]!.push(b);
    adj[b]!.push(a);
  }
  for (const k of Object.keys(adj)) adj[k]!.sort();
  return adj;
}

export type SearchStep = {
  node: string;
  frontier: string[];
  visited: string[];
  note: string;
  g?: number;
  h?: number;
  f?: number;
};

export type SearchResult = {
  algorithm: "BFS" | "DFS" | "A*";
  path: string[];
  steps: SearchStep[];
  explored: number;
  cost: number;
};

function reconstruct(parent: Record<string, string | null>, goal: string) {
  const path: string[] = [];
  let cur: string | null = goal;
  while (cur) {
    path.unshift(cur);
    cur = parent[cur] ?? null;
  }
  return path;
}

function pathCost(path: string[]) {
  let c = 0;
  for (let i = 1; i < path.length; i++) c += dist(path[i - 1]!, path[i]!);
  return c;
}

export function bfs(start: string, goal: string): SearchResult {
  const adj = adjacency();
  const queue = [start];
  const visited: string[] = [];
  const parent: Record<string, string | null> = { [start]: null };
  const steps: SearchStep[] = [];

  while (queue.length) {
    const node = queue.shift()!;
    if (visited.includes(node)) continue;
    visited.push(node);
    steps.push({
      node,
      frontier: [...queue],
      visited: [...visited],
      note: node === goal ? "Goal reached" : `Dequeued ${nodeById(node).label}`,
    });
    if (node === goal) break;
    for (const nb of adj[node]!) {
      if (!visited.includes(nb) && !queue.includes(nb)) {
        parent[nb] = node;
        queue.push(nb);
      }
    }
  }
  const path = visited.includes(goal) ? reconstruct(parent, goal) : [];
  return { algorithm: "BFS", path, steps, explored: visited.length, cost: pathCost(path) };
}

export function dfs(start: string, goal: string): SearchResult {
  const adj = adjacency();
  const stack = [start];
  const visited: string[] = [];
  const parent: Record<string, string | null> = { [start]: null };
  const steps: SearchStep[] = [];

  while (stack.length) {
    const node = stack.pop()!;
    if (visited.includes(node)) continue;
    visited.push(node);
    steps.push({
      node,
      frontier: [...stack],
      visited: [...visited],
      note: node === goal ? "Goal reached" : `Popped ${nodeById(node).label}`,
    });
    if (node === goal) break;
    for (const nb of [...adj[node]!].reverse()) {
      if (!visited.includes(nb)) {
        parent[nb] = node;
        stack.push(nb);
      }
    }
  }
  const path = visited.includes(goal) ? reconstruct(parent, goal) : [];
  return { algorithm: "DFS", path, steps, explored: visited.length, cost: pathCost(path) };
}

export function astar(start: string, goal: string): SearchResult {
  const adj = adjacency();
  const h = (n: string) => dist(n, goal);
  const g: Record<string, number> = { [start]: 0 };
  const parent: Record<string, string | null> = { [start]: null };
  const open = new Set([start]);
  const closed: string[] = [];
  const steps: SearchStep[] = [];

  while (open.size) {
    const node = [...open].sort((a, b) => (g[a]! + h(a)) - (g[b]! + h(b)))[0]!;
    open.delete(node);
    closed.push(node);
    steps.push({
      node,
      frontier: [...open],
      visited: [...closed],
      note: node === goal ? "Goal reached — optimal path found" : `Expanded ${nodeById(node).label}`,
      g: g[node],
      h: h(node),
      f: g[node]! + h(node),
    });
    if (node === goal) break;
    for (const nb of adj[node]!) {
      const tentative = g[node]! + dist(node, nb);
      if (g[nb] === undefined || tentative < g[nb]!) {
        g[nb] = tentative;
        parent[nb] = node;
        if (!closed.includes(nb)) open.add(nb);
      }
    }
  }
  const path = closed.includes(goal) ? reconstruct(parent, goal) : [];
  return { algorithm: "A*", path, steps, explored: closed.length, cost: pathCost(path) };
}

export const walkMinutes = (metres: number) => Math.max(1, Math.round(metres / 80));

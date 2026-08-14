import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls, Sphere } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { AGENTS } from "@/lib/ai/agents";

const ACCENT: Record<string, string> = {
  cyan: "#5ee7f5",
  violet: "#a98bff",
  magenta: "#ff86d0",
  softblue: "#7fb2ff",
  success: "#63e6bd",
};

function Core({ pulse }: { pulse: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const s = 1 + (pulse ? Math.sin(t * 2) * 0.05 : 0);
    ref.current.scale.setScalar(s);
    ref.current.rotation.y = t * 0.2;
  });
  return (
    <group>
      <Sphere ref={ref} args={[1.05, 32, 32]}>
        <meshStandardMaterial
          color="#0d1730"
          emissive="#5ee7f5"
          emissiveIntensity={1.1}
          roughness={0.25}
          metalness={0.6}
        />
      </Sphere>
      <Sphere args={[1.55, 24, 24]}>
        <meshBasicMaterial color="#5ee7f5" transparent opacity={0.07} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={6} color="#5ee7f5" distance={12} />
    </group>
  );
}

function AgentNode({
  position,
  color,
  active,
  label,
  onSelect,
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
  label: string;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar((active ? 1.25 : 1) * (hover ? 1.3 : 1) * (1 + Math.sin(t * 2.4) * 0.04));
  });
  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <icosahedronGeometry args={[0.26, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 2.2 : 0.9}
          roughness={0.3}
        />
      </mesh>
      <mesh visible={active || hover}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <mesh visible={false} name={label} />
    </group>
  );
}

function Link({
  to,
  color,
  active,
}: {
  to: [number, number, number];
  color: string;
  active: boolean;
}) {
  const points = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...to)],
    [to],
  );
  return (
    <Line points={points} color={color} lineWidth={active ? 1.8 : 0.7} transparent opacity={active ? 0.85 : 0.25} />
  );
}

function Particles({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#9fd8ff" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Rig({ enabled }: { enabled: boolean }) {
  useFrame(({ camera, clock }) => {
    if (!enabled) return;
    const t = clock.getElapsedTime() * 0.12;
    camera.position.x = Math.sin(t) * 7.5;
    camera.position.z = Math.cos(t) * 7.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export type AICore3DProps = {
  activeAgent?: string | null;
  onSelectAgent?: (key: string) => void;
  quality?: "full" | "light";
  autoOrbit?: boolean;
  controls?: boolean;
};

export default function AICore3D({
  activeAgent = null,
  onSelectAgent,
  quality = "full",
  autoOrbit = true,
  controls = false,
}: AICore3DProps) {
  const agents = AGENTS.slice(0, 10);
  const nodes = agents.map((a, i) => {
    const angle = (i / agents.length) * Math.PI * 2;
    const radius = 3.1;
    const y = Math.sin(i * 1.7) * 0.9;
    return {
      agent: a,
      pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
    };
  });

  return (
    <Canvas
      dpr={quality === "full" ? [1, 1.8] : [1, 1.2]}
      camera={{ position: [0, 1.6, 7.5], fov: 48 }}
      gl={{ antialias: quality === "full", alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={0.7} color="#a98bff" />
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Core pulse={quality === "full"} />
      </Float>
      {nodes.map(({ agent, pos }) => (
        <group key={agent.key}>
          <Link to={pos} color={ACCENT[agent.accent]!} active={activeAgent === agent.key} />
          <AgentNode
            position={pos}
            color={ACCENT[agent.accent]!}
            active={activeAgent === agent.key}
            label={agent.name}
            onSelect={() => onSelectAgent?.(agent.key)}
          />
        </group>
      ))}
      <Particles count={quality === "full" ? 260 : 90} />
      {controls ? (
        <OrbitControls enablePan={false} minDistance={5} maxDistance={13} enableDamping />
      ) : (
        <Rig enabled={autoOrbit} />
      )}
    </Canvas>
  );
}

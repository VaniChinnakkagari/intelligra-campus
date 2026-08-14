import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type Building = {
  id: string;
  label: string;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  accent: string;
};

export const CAMPUS_BUILDINGS: Building[] = [
  { id: "gate", label: "Main Gate", x: -8, z: 7, w: 2.4, d: 1, h: 0.8, accent: "#7fb2ff" },
  { id: "academic", label: "Academic Block", x: -3.4, z: 2.6, w: 4.2, d: 2.6, h: 2.6, accent: "#5ee7f5" },
  { id: "cse", label: "CSE Block", x: 2.4, z: 2.2, w: 3.4, d: 2.4, h: 3.4, accent: "#a98bff" },
  { id: "library", label: "Library", x: -4.6, z: -2.4, w: 3, d: 2.4, h: 1.8, accent: "#63e6bd" },
  { id: "complab", label: "Computer Lab", x: 6.4, z: 2.6, w: 2.4, d: 2.2, h: 1.6, accent: "#5ee7f5" },
  { id: "sciencelab", label: "Science Lab", x: 6.6, z: -0.6, w: 2.2, d: 2, h: 1.4, accent: "#ff86d0" },
  { id: "auditorium", label: "Auditorium", x: -8.2, z: -0.6, w: 3, d: 3, h: 1.6, accent: "#a98bff" },
  { id: "cafeteria", label: "Cafeteria", x: 1.2, z: -2.8, w: 2.6, d: 2, h: 1.2, accent: "#f4d06f" },
  { id: "sports", label: "Sports Complex", x: -7.6, z: -5.4, w: 4.4, d: 2.6, h: 0.9, accent: "#63e6bd" },
  { id: "hostel", label: "Hostel", x: 6.2, z: -4.6, w: 3, d: 2.2, h: 2.8, accent: "#7fb2ff" },
  { id: "parking", label: "Parking", x: -1.4, z: 6.4, w: 3.4, d: 1.6, h: 0.4, accent: "#9fb3d1" },
  { id: "busstop", label: "Bus Stop", x: 3.6, z: 6.4, w: 2, d: 1.2, h: 0.6, accent: "#f4d06f" },
];

function Block({
  b,
  selected,
  onSelect,
}: {
  b: Building;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const target = selected || hover ? 1.08 : 1;
    ref.current.scale.y += (target - ref.current.scale.y) * 0.12;
    if (selected) ref.current.position.y = b.h / 2 + Math.sin(clock.getElapsedTime() * 2) * 0.04;
  });
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh
        ref={ref}
        position={[0, b.h / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={[b.w, b.h, b.d]} />
        <meshPhysicalMaterial
          color="#0e1a33"
          emissive={b.accent}
          emissiveIntensity={selected ? 0.85 : hover ? 0.5 : 0.22}
          transparent
          opacity={0.82}
          roughness={0.2}
          metalness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[b.w * 1.5, b.d * 1.5]} />
        <meshBasicMaterial color={b.accent} transparent opacity={selected ? 0.18 : 0.06} />
      </mesh>
    </group>
  );
}

function Bus({ path, color = "#f4d06f", speed = 0.06 }: { path: THREE.Vector3[]; color?: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path, true), [path]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * speed) % 1;
    const p = curve.getPointAt(t);
    ref.current.position.set(p.x, 0.3, p.z);
    const tan = curve.getTangentAt(t);
    ref.current.rotation.y = Math.atan2(tan.x, tan.z);
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.9, 0.45, 0.45]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
    </mesh>
  );
}

function RouteLine({ path, color }: { path: THREE.Vector3[]; color: string }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(path, true);
    return new THREE.TubeGeometry(curve, 90, 0.035, 6, true);
  }, [path]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

export type Campus3DProps = {
  selected?: string | null;
  onSelect?: (id: string) => void;
  quality?: "full" | "light";
  showTransport?: boolean;
};

export default function Campus3D({
  selected = null,
  onSelect,
  quality = "full",
  showTransport = false,
}: Campus3DProps) {
  const routeA = useMemo(
    () =>
      [
        [-8, 0, 7],
        [-1.4, 0, 6.4],
        [3.6, 0, 6.4],
        [6.6, 0, 2.6],
        [2.4, 0, -1],
        [-4.6, 0, -2.4],
        [-8.2, 0, 0.4],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [],
  );
  const routeB = useMemo(
    () =>
      [
        [6.2, 0, -4.6],
        [1.2, 0, -2.8],
        [-4.6, 0, -2.4],
        [-7.6, 0, -5.4],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [],
  );

  return (
    <Canvas
      dpr={quality === "full" ? [1, 1.8] : [1, 1.2]}
      camera={{ position: [0, 11, 15], fov: 45 }}
      gl={{ antialias: quality === "full", alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 12, 6]} intensity={0.9} color="#bcd8ff" />
      <directionalLight position={[-8, 6, -6]} intensity={0.5} color="#a98bff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#080f1f" roughness={0.9} metalness={0.1} />
      </mesh>
      <gridHelper args={[40, 40, "#1d2b4d", "#141f39"]} position={[0, 0.005, 0]} />
      {CAMPUS_BUILDINGS.map((b) => (
        <Block key={b.id} b={b} selected={selected === b.id} onSelect={() => onSelect?.(b.id)} />
      ))}
      {showTransport ? (
        <>
          <RouteLine path={routeA} color="#5ee7f5" />
          <RouteLine path={routeB} color="#ff86d0" />
          <Bus path={routeA} speed={0.05} />
          <Bus path={routeB} color="#ff86d0" speed={0.08} />
        </>
      ) : null}
      <OrbitControls
        enablePan={false}
        minDistance={9}
        maxDistance={26}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
      />
    </Canvas>
  );
}

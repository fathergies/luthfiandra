"use client";

import { Bounds, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import { CanvasTexture, Color, Mesh, MeshPhysicalMaterial, PMREMGenerator, SRGBColorSpace } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { GarageBuild } from "@/data/garageData";

export type GarageCarId = "ferrari" | "toy-car";

type CarShowroomProps = {
  build: GarageBuild;
  carId: GarageCarId;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
};

export function CarShowroom({ build, carId, onCanvasReady }: CarShowroomProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [6.8, 3.5, 7.4], fov: 34 }}
      gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#eadfd1");
        gl.outputColorSpace = SRGBColorSpace;
        onCanvasReady(gl.domElement);
      }}
    >
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#fff7ed", "#8096b2", 1.8]} />
      <spotLight position={[4, 9, 6]} intensity={85} angle={0.42} penumbra={0.8} castShadow />
      <spotLight position={[-5, 5, -4]} intensity={45} color="#b9d0ec" />
      <LocalStudioEnvironment />
      <Suspense fallback={<LoadingMarker />}>
        <Bounds fit clip observe margin={1.22}>
          <CarAsset key={carId} carId={carId} build={build} />
        </Bounds>
      </Suspense>
      <ContactShadows position={[0, -0.03, 0]} opacity={0.55} scale={14} blur={2.5} far={5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <circleGeometry args={[10, 96]} />
        <meshStandardMaterial color="#cabdad" roughness={0.88} />
      </mesh>
      <OrbitControls makeDefault enablePan={false} minDistance={4} maxDistance={13} autoRotate autoRotateSpeed={0.35} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.05} />
    </Canvas>
  );
}

function CarAsset({ carId, build }: { carId: GarageCarId; build: GarageBuild }) {
  const path = carId === "ferrari" ? "/models/garage/ferrari.glb" : "/models/garage/toy-car.glb";
  const gltf = useGLTF(path);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const bodyColor = build.bodyAccent ? "#851033" : carId === "ferrari" ? "#b8bdc4" : "#789fd0";

  useEffect(() => {
    scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const name = object.name.toLowerCase();
      if (carId === "toy-car" && name === "toycar" && !Array.isArray(object.material)) {
        const material = object.material.clone() as MeshPhysicalMaterial;
        if ("color" in material) material.color.set(bodyColor);
        object.material = material;
      }
      if (name.includes("body") || name.includes("paint") || name.includes("carrosserie")) {
        object.material = new MeshPhysicalMaterial({ color: bodyColor, metalness: .82, roughness: .2, clearcoat: 1, clearcoatRoughness: .12 });
      }
      if (name.includes("glass") || name.includes("window")) {
        object.material = new MeshPhysicalMaterial({ color: new Color("#101c28"), metalness: .15, roughness: .08, transparent: true, opacity: Math.max(.35, 1 - build.tint / 125) });
      }
      if (name.includes("rim")) {
        object.material = new MeshPhysicalMaterial({ color: build.wheels === "sport" ? "#22262c" : "#d9dde0", metalness: 1, roughness: build.wheels === "classic" ? .08 : .2 });
      }
    });

    if (carId === "ferrari") {
      const body = scene.getObjectByName("body") as Mesh | undefined;
      if (body) body.material = new MeshPhysicalMaterial({ color: bodyColor, metalness: .86, roughness: .18, clearcoat: 1, clearcoatRoughness: .1 });
      const glass = scene.getObjectByName("glass") as Mesh | undefined;
      if (glass) glass.material = new MeshPhysicalMaterial({ color: "#10202d", metalness: .15, roughness: .05, transparent: true, opacity: Math.max(.3, 1 - build.tint / 120) });
      ["rim_fl","rim_fr","rim_rl","rim_rr","trim"].forEach(name => {
        const mesh = scene.getObjectByName(name) as Mesh | undefined;
        if (mesh) mesh.material = new MeshPhysicalMaterial({ color: build.wheels === "sport" ? "#1d2228" : "#e1e4e6", metalness: 1, roughness: build.wheels === "classic" ? .07 : .18 });
      });
    }
  }, [scene, carId, bodyColor, build.tint, build.wheels]);

  const config = carId === "ferrari"
    ? { scale: 1.5, rotation: [0, Math.PI, 0] as [number,number,number], plate: [0, .35, -2.25] as [number,number,number], plateRotation: [0,0,0] as [number,number,number] }
    : { scale: 1.1, rotation: [0, 0, 0] as [number,number,number], plate: [0, .48, 2.05] as [number,number,number], plateRotation: [0,Math.PI,0] as [number,number,number] };

  return (
    <group rotation={config.rotation} scale={config.scale}>
      <primitive object={scene} />
      <DynamicPlate text={build.plate} position={config.plate} rotation={config.plateRotation} />
      {build.roofRack && <RoofRack />}
      {build.roofBox && <mesh position={[0, 1.65, 0]} castShadow><boxGeometry args={[1.8,.34,.82]}/><meshPhysicalMaterial color="#242831" metalness={.65} roughness={.22}/></mesh>}
      {build.sticker !== "none" && <mesh position={[1.05,.9,-.86]} rotation={[0,0,.05]}><planeGeometry args={[.7,.22]}/><meshBasicMaterial color={build.sticker==="heart"?"#d33f67":"#fff2e8"}/></mesh>}
    </group>
  );
}

function DynamicPlate({ text, position, rotation }: { text: string; position: [number,number,number]; rotation: [number,number,number] }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 160;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#111318"; ctx.fillRect(0,0,512,160);
    ctx.strokeStyle = "#e6e4dc"; ctx.lineWidth = 10; ctx.strokeRect(8,8,496,144);
    ctx.fillStyle = "#f6f3e8"; ctx.font = "bold 68px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text || "ANDRA",256,80);
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map;
  }, [text]);
  return <mesh position={position} rotation={rotation}><boxGeometry args={[1.05,.34,.035]}/><meshStandardMaterial map={texture} roughness={.55}/></mesh>;
}

function RoofRack() {
  return <group position={[0,1.55,0]}>{[-.6,.6].map(x=><mesh key={x} position={[x,0,0]}><boxGeometry args={[.06,.07,1.55]}/><meshStandardMaterial color="#20242a" metalness={.8}/></mesh>)}</group>;
}

function LoadingMarker() {
  const { camera } = useThree();
  return <mesh position={camera.position.clone().multiplyScalar(.4)}><sphereGeometry args={[.2,16,16]}/><meshBasicMaterial color="#d34e72"/></mesh>;
}

function LocalStudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const environment = generator.fromScene(new RoomEnvironment(), .04).texture;
    scene.environment = environment;
    return () => {
      scene.environment = null;
      environment.dispose();
      generator.dispose();
    };
  }, [gl, scene]);
  return null;
}

useGLTF.preload("/models/garage/ferrari.glb");
useGLTF.preload("/models/garage/toy-car.glb");

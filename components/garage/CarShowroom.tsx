"use client";

import { Bounds, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import { Box3, CanvasTexture, Color, DoubleSide, Mesh, MeshPhysicalMaterial, PMREMGenerator, SRGBColorSpace, Vector3 } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { GarageBuild } from "@/data/garageData";

export type GarageCarId = "ferrari" | "car-concept" | "bmw-m3" | "audi-s4" | "bmw-m3-gtr";

export const garageCars: { id: GarageCarId; name: string; detail: string; bay: string }[] = [
  { id: "ferrari", name: "Ferrari 458 Italia", detail: "Italian supercar · silver edition", bay: "01" },
  { id: "car-concept", name: "Khronos Car Concept", detail: "Futuristic grand tourer", bay: "02" },
  { id: "bmw-m3", name: "BMW M3 E46", detail: "Realistic street-spec performance coupe", bay: "03" },
  { id: "audi-s4", name: "Audi S4 2006", detail: "Detailed PBR German sport sedan", bay: "04" },
  { id: "bmw-m3-gtr", name: "BMW M3 GTR", detail: "Detailed race-spec hero car", bay: "05" }
];

const carPaths: Record<GarageCarId, string> = {
  ferrari: "/models/garage/ferrari.glb",
  "car-concept": "/models/garage/car-concept.glb",
  "bmw-m3": "/models/garage/bmw-m3.glb",
  "audi-s4": "/models/garage/audi-s4.glb",
  "bmw-m3-gtr": "/models/garage/bmw-m3-gtr.glb"
};

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
  const gltf = useGLTF(carPaths[carId]);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const factoryColors: Record<GarageCarId, string> = {
    ferrari: "#b8bdc4", "car-concept": "#8fa7bf", "bmw-m3": "#b9bec5",
    "audi-s4": "#aeb5bd", "bmw-m3-gtr": "#315f9d"
  };
  const bodyColor = build.bodyAccent ? "#851033" : factoryColors[carId];
  const normalized = useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = 4.5 / Math.max(size.x, size.z, .001);
    return {
      scale,
      position: [-center.x * scale, -box.min.y * scale, -center.z * scale] as [number, number, number],
      width: size.x * scale,
      height: size.y * scale,
      length: size.z * scale
    };
  }, [scene]);

  useEffect(() => {
    scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const name = object.name.toLowerCase();
      let hierarchyName = name;
      let parent = object.parent;
      while (parent) { hierarchyName += ` ${parent.name.toLowerCase()}`; parent = parent.parent; }
      const originalMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const isWheelMesh = hierarchyName.includes("rim") || hierarchyName.includes("wheel") || hierarchyName.includes("tyre") || hierarchyName.includes("tire");

      if (isWheelMesh) {
        if (!object.userData.originalScale) object.userData.originalScale = object.scale.clone();
        const originalScale = object.userData.originalScale as Vector3;
        const scale = build.wheels === "sport" ? 1.08 : build.wheels === "classic" ? .96 : 1;
        object.scale.copy(originalScale).multiplyScalar(scale);
      }

      const styledMaterials = originalMaterials.map(material => {
        const materialName = material.name.toLowerCase();
        const isPaint = materialName.includes("paint") || materialName.includes("body_color") || materialName.includes("carrosserie") || (carId === "ferrari" && name === "body") || (carId === "bmw-m3" && materialName.endsWith("mm_ext"));
        const isGlass = materialName.includes("glass") || materialName.includes("window") || name.includes("glass") || name.includes("window");
        const isRim = materialName.includes("rim") || materialName.includes("wheel") || (isWheelMesh && !materialName.includes("tire") && !materialName.includes("tyre") && !materialName.includes("brake") && !materialName.includes("rotor") && !materialName.includes("rubber"));

        if (isPaint) {
          const styled = new MeshPhysicalMaterial({ color: bodyColor, metalness: .76, roughness: .22, clearcoat: 1, clearcoatRoughness: .1 });
          styled.name = material.name;
          return styled;
        }
        if (isGlass) {
          const styled = new MeshPhysicalMaterial({ color: new Color("#101c28"), metalness: .08, roughness: .06, transparent: true, opacity: .28 + (build.tint / 100) * .68 });
          styled.name = material.name;
          return styled;
        }
        if (isRim) {
          const styled = new MeshPhysicalMaterial({
            color: build.wheels === "sport" ? "#171b20" : build.wheels === "classic" ? "#f0e2c8" : "#b8c0c8",
            metalness: 1, roughness: build.wheels === "classic" ? .08 : build.wheels === "sport" ? .28 : .34, clearcoat: 1
          });
          styled.name = material.name;
          return styled;
        }
        return material.clone();
      });
      object.material = Array.isArray(object.material) ? styledMaterials : styledMaterials[0];
    });
  }, [scene, carId, bodyColor, build.tint, build.wheels]);

  const rotation: [number, number, number] = carId === "ferrari" ? [0, Math.PI, 0] : [0, 0, 0];

  return (
    <group rotation={rotation}>
      <group scale={normalized.scale} position={normalized.position}><primitive object={scene} /></group>
      <DynamicPlate text={build.plate} position={[0, Math.max(.34, normalized.height * .23), -normalized.length / 2 - .04]} rotation={[0,0,0]} />
      {build.roofRack && <RoofRack y={normalized.height + .03} width={normalized.width} length={normalized.length} />}
      {build.roofBox && <RoofBox y={normalized.height + .3} />}
      {build.sticker !== "none" && <StickerDecals style={build.sticker} x={normalized.width / 2 + .02} y={normalized.height * .48} length={normalized.length} />}
      <FogLights color={build.lights} x={normalized.width * .31} y={Math.max(.3, normalized.height * .24)} z={-normalized.length / 2 - .055} />
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

function RoofRack({ y, width, length }: { y: number; width: number; length: number }) {
  const rackWidth = Math.min(width * .7, 1.45);
  const rackLength = Math.min(length * .48, 1.75);
  return <group position={[0,y,0]}>{[-rackWidth / 2,rackWidth / 2].map(x=><mesh key={`rail-${x}`} position={[x,0,0]} castShadow><boxGeometry args={[.07,.08,rackLength]}/><meshStandardMaterial color="#20242a" metalness={.8} roughness={.2}/></mesh>)}{[-rackLength * .36,rackLength * .36].map(z=><mesh key={`bar-${z}`} position={[0,.025,z]} castShadow><boxGeometry args={[rackWidth + .1,.06,.07]}/><meshStandardMaterial color="#303640" metalness={.8} roughness={.2}/></mesh>)}</group>;
}

function RoofBox({ y }: { y: number }) {
  return <group position={[0,y,0]}><mesh rotation={[Math.PI / 2,0,0]} castShadow><capsuleGeometry args={[.42,1.25,8,18]}/><meshPhysicalMaterial color="#242831" metalness={.62} roughness={.2} clearcoat={1}/></mesh><mesh position={[0,-.25,0]} scale={[1.5,.35,1]}><boxGeometry args={[1,.25,1.45]}/><meshStandardMaterial color="#14171c" metalness={.7} roughness={.25}/></mesh></group>;
}

function FogLights({ color, x, y, z }: { color: GarageBuild["lights"]; x: number; y: number; z: number }) {
  const lightColor = color === "warm" ? "#ffd28a" : color === "ice" ? "#a9dcff" : "#ffffff";
  return <group>{[-x,x].map(lightX=><group key={lightX} position={[lightX,y,z]}><mesh rotation={[0,Math.PI,0]}><circleGeometry args={[.13,24]}/><meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={3}/></mesh><pointLight color={lightColor} intensity={1.4} distance={2.2}/></group>)}</group>;
}

function StickerDecals({ style, x, y, length }: { style: GarageBuild["sticker"]; x: number; y: number; length: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768; canvas.height = 220;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = style === "heart" ? "#d33f67" : "#fff7ec";
    ctx.font = style === "heart" ? "bold 150px serif" : "bold 86px serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const label = style === "luthfiandra" ? "LUTHFIANDRA" : style === "initials" ? "L + A" : style === "angie" ? "MADE BY ANGIE" : "♥";
    ctx.fillText(label, canvas.width / 2, canvas.height / 2);
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map;
  }, [style]);

  useEffect(() => () => texture.dispose(), [texture]);

  return <group>{[-1,1].map(side=><mesh key={side} position={[side * x,y,0]} rotation={[0,side * Math.PI / 2,0]}><planeGeometry args={[Math.min(length * .42,1.5),.33]}/><meshBasicMaterial map={texture} transparent side={DoubleSide} depthWrite={false}/></mesh>)}</group>;
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
useGLTF.preload("/models/garage/car-concept.glb");
useGLTF.preload("/models/garage/bmw-m3.glb");
useGLTF.preload("/models/garage/audi-s4.glb");
useGLTF.preload("/models/garage/bmw-m3-gtr.glb");

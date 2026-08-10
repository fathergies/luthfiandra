"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";
import { defaultGarageBuild, stickerOptions, type GarageBuild, type LightColor, type WheelStyle } from "@/data/garageData";
import type { GarageCarId } from "@/components/garage/CarShowroom";
import { LoadingScreen } from "@/components/LoadingScreen";

const GARAGE_STORE = "luthfiandra-garage-build-v2";

const CarShowroom = dynamic(() => import("@/components/garage/CarShowroom").then(module => module.CarShowroom), {
  ssr: false,
  loading: () => <LoadingScreen variant="garage" compact />
});

export function GarageCustomizer() {
  const [build, setBuild] = useState<GarageBuild>(defaultGarageBuild);
  const [compareOriginal, setCompareOriginal] = useState(false);
  const [message, setMessage] = useState("Drag left or right to rotate · use arrows for precision");
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [rendererKey, setRendererKey] = useState(0);
  const [carId, setCarId] = useState<GarageCarId>("ferrari");

  useEffect(() => {
    const saved = localStorage.getItem(GARAGE_STORE);
    if (!saved) return;
    try {
      setBuild({ ...defaultGarageBuild, ...(JSON.parse(saved) as Partial<GarageBuild>) });
      setMessage("Your saved build is back in the garage ♡");
    } catch {
      localStorage.removeItem(GARAGE_STORE);
    }
  }, []);

  const displayBuild = compareOriginal ? defaultGarageBuild : build;
  const update = <K extends keyof GarageBuild>(key: K, value: GarageBuild[K]) => setBuild(current => ({ ...current, [key]: value }));
  const saveBuild = () => { localStorage.setItem(GARAGE_STORE, JSON.stringify(build)); setMessage("Build saved in this browser ✓"); };
  const resetBuild = () => { setBuild(defaultGarageBuild); setCompareOriginal(false); setMessage("Back to factory silver."); };
  const takeScreenshot = () => {
    if (!canvas) return setMessage("Showroom is still loading…");
    const link = document.createElement("a");
    link.download = `andra-innova-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setMessage("Showroom image downloaded ✓");
  };

  return (
    <main className="min-h-screen bg-[#eee1d2] text-[#3b1723]">
      <section className="relative border-b-2 border-[#790826] bg-[radial-gradient(circle_at_75%_-20%,#b9cee8_0%,#fff8ef_48%,#f2d5dc_100%)] px-5 pb-9 pt-10 md:px-8">
        <div className="mx-auto flex max-w-[1450px] flex-wrap items-end justify-between gap-6">
          <div>
            <Link href="/" className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#790826]/55 transition hover:text-[#790826]">← back to Luthfiandra</Link>
            <p className="mt-7 font-mono text-[10px] font-black uppercase tracking-[.28em] text-[#31527e]">Luthfi&apos;s private garage · bay 01</p>
            <h1 className="mt-2 font-serif text-5xl font-black sm:text-7xl">Innova <span className="font-normal italic text-[#c34268]">Silver 2022</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="rotate-2 border-2 border-[#790826] bg-[#f4c4cf] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-wider shadow-[4px_5px_0_#9eb9da]">built for ndut<br/>with love ♡</div>
            <Link href="/for-you" className="bg-[#790826] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-wider text-white shadow-[4px_5px_0_#9eb9da] transition hover:-translate-y-1">next room →</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1450px] border-x border-[#790826]/15 xl:grid-cols-[1fr_390px]">
        <div className="relative min-h-[620px] overflow-hidden border-b border-[#790826]/15 bg-[#eadfd1] xl:min-h-[760px] xl:border-b-0 xl:border-r">
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(#bfae9e_1px,transparent_1px),linear-gradient(90deg,#bfae9e_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="absolute inset-x-0 top-5 z-20 flex justify-center">
            <div className="flex rounded-full border border-[#790826]/20 bg-white/80 p-1 shadow-md backdrop-blur">
              <button onClick={()=>setCompareOriginal(true)} className={`rounded-full px-5 py-2 font-mono text-[10px] font-black ${compareOriginal?"bg-[#31527e] text-white":"text-[#65434f]"}`}>Before</button>
              <button onClick={()=>setCompareOriginal(false)} className={`rounded-full px-5 py-2 font-mono text-[10px] font-black ${!compareOriginal?"bg-[#851033] text-white":"text-[#65434f]"}`}>My Build</button>
            </div>
          </div>

          <div className="absolute inset-0 pb-12 pt-16">
            <WebGLErrorBoundary
              key={rendererKey}
              fallback={
                <WebGLHelp onRetry={() => {
                  setCanvas(null);
                  setRendererKey(key => key + 1);
                }} />
              }
            >
              <CarShowroom build={displayBuild} carId={carId} onCanvasReady={setCanvas} />
            </WebGLErrorBoundary>
          </div>
          <p className="pointer-events-none absolute inset-x-0 bottom-6 z-20 text-center font-mono text-[9px] font-black uppercase tracking-[.18em] text-[#6d4c57]">{message}</p>
        </div>

        <aside className="bg-[#fff8ef] p-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-[#790826]/15 pb-5">
            <div><p className="font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#31527e]">build configurator</p><h2 className="mt-1 font-serif text-3xl font-black">make it his.</h2></div><span className="text-3xl text-[#c43f67]">⌁</span>
          </div>
          <div className="garage-scrollbar mt-6 max-h-[570px] space-y-7 overflow-y-auto pr-2 xl:max-h-[585px]">
            <Control label="00 · Choose car">
              <div className="grid grid-cols-2 gap-2">
                <Choice active={carId==="ferrari"} click={()=>setCarId("ferrari")}>GT Sport</Choice>
                <Choice active={carId==="toy-car"} click={()=>setCarId("toy-car")}>Concept Car</Choice>
              </div>
            </Control>
            <Control label="01 · Wheels"><div className="grid grid-cols-3 gap-2">{(["touring","sport","classic"] as WheelStyle[]).map(x=><Choice key={x} active={build.wheels===x} click={()=>update("wheels",x)}>{x}</Choice>)}</div></Control>
            <Control label="02 · Roof"><Toggle label="Roof rack" checked={build.roofRack} change={x=>update("roofRack",x)}/><Toggle label="Roof box" checked={build.roofBox} change={x=>update("roofBox",x)}/></Control>
            <Control label="03 · Window tint"><input type="range" min="10" max="90" value={build.tint} onChange={e=>update("tint",Number(e.target.value))} className="w-full accent-[#851033]"/><div className="mt-2 flex justify-between font-mono text-[9px] text-[#7b5b66]"><span>clear</span><span>{build.tint}% tint</span><span>dark</span></div></Control>
            <Control label="04 · Foglamp color"><div className="grid grid-cols-3 gap-2">{(["white","warm","ice"] as LightColor[]).map(x=><Choice key={x} active={build.lights===x} click={()=>update("lights",x)}>{x}</Choice>)}</div></Control>
            <Control label="05 · Side sticker"><div className="grid grid-cols-2 gap-2">{stickerOptions.map(x=><Choice key={x.value} active={build.sticker===x.value} click={()=>update("sticker",x.value)}>{x.label}</Choice>)}</div></Control>
            <Control label="06 · Custom plate"><input value={build.plate} maxLength={12} onChange={e=>update("plate",e.target.value.toUpperCase())} className="w-full rounded-lg border-2 border-[#31527e] bg-white px-4 py-3 text-center font-mono text-sm font-black uppercase tracking-[.2em] outline-none"/></Control>
            <Control label="07 · Body"><Toggle label="Burgundy body accent" checked={build.bodyAccent} change={x=>update("bodyAccent",x)}/></Control>
          </div>
          <div className="mt-6 grid gap-2 border-t border-[#790826]/15 pt-6">
            <button onClick={saveBuild} className="rounded-lg bg-[#851033] px-5 py-3.5 font-mono text-xs font-black text-white shadow-[4px_5px_0_#dca0b2] transition hover:-translate-y-1">Save My Build</button>
            <div className="grid grid-cols-2 gap-2"><button onClick={resetBuild} className="rounded-lg border-2 border-[#31527e] px-4 py-3 font-mono text-[10px] font-black text-[#31527e]">Reset Car</button><button onClick={takeScreenshot} className="rounded-lg border-2 border-[#31527e] px-4 py-3 font-mono text-[10px] font-black text-[#31527e]">Save Image</button></div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Control({label,children}:{label:string;children:ReactNode}) { return <fieldset><legend className="mb-3 font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#8a5666]">{label}</legend>{children}</fieldset> }
function Choice({active,click,children}:{active:boolean;click:()=>void;children:ReactNode}) { return <button onClick={click} className={`rounded-lg border-2 px-2 py-2.5 font-mono text-[9px] font-black capitalize transition ${active?"border-[#31527e] bg-[#bcd1e9] text-[#203d65] shadow-[2px_3px_0_#e0a3b4]":"border-[#d8bdc4] bg-white text-[#72505c] hover:border-[#31527e]"}`}>{children}</button> }
function Toggle({label,checked,change}:{label:string;checked:boolean;change:(x:boolean)=>void}) { return <label className="mb-2 flex cursor-pointer items-center justify-between rounded-lg border border-[#d7bcc3] bg-white px-4 py-3 font-mono text-[10px] font-black text-[#62424e]">{label}<input type="checkbox" checked={checked} onChange={e=>change(e.target.checked)} className="peer sr-only"/><span className="relative h-6 w-11 rounded-full bg-[#d5c2c5] transition peer-checked:bg-[#851033] after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"/></label> }

function WebGLHelp({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <div className="max-w-lg border-2 border-[#790826] bg-[#fff8ef] p-8 shadow-[8px_9px_0_#9eb9da]">
        <span className="text-5xl">⚙️</span>
        <h2 className="mt-4 font-serif text-3xl font-black">WebGL belum diizinkan Chrome</h2>
        <p className="mt-3 font-mono text-[11px] leading-6 text-[#6c4a56]">
          Buka Chrome Settings → System, aktifkan “Use graphics acceleration when available”, lalu relaunch Chrome. Kamu juga bisa cek statusnya di chrome://gpu.
        </p>
        <button type="button" onClick={onRetry} className="mt-6 bg-[#790826] px-6 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#d99aae]">
          retry 3D showroom
        </button>
      </div>
    </div>
  );
}

class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("WebGL showroom failed:", error.message, info.componentStack);
  }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useMemo, useState } from "react";

type FlowerName = "Rose" | "Tulip" | "Sunflower" | "Baby’s Breath" | "Lily" | "Daisy";
type PlacedFlower = { id: string; type: FlowerName; x: number; y: number; rotate: number; scale: number };
type StudioMode = "bouquet" | "letter";

type SavedBouquet = {
  id: string;
  kind: "bouquet";
  createdAt: string;
  flowers: PlacedFlower[];
  wrap: string;
  ribbon: string;
  title?: string;
  description?: string;
};

type SavedLetter = {
  id: string;
  kind: "letter";
  createdAt: string;
  recipient: string;
  paper: string;
  sticker: string;
  stamp: string;
  template: string;
  content: string;
};

type SavedCreation = SavedBouquet | SavedLetter;

const flowerOptions: { name: FlowerName; color: string }[] = [
  { name: "Rose", color: "#d74e70" },
  { name: "Tulip", color: "#ec8fa9" },
  { name: "Sunflower", color: "#efb735" },
  { name: "Baby’s Breath", color: "#f7f4e8" },
  { name: "Lily", color: "#f4c2d0" },
  { name: "Daisy", color: "#fff3b3" }
];

const wraps = [
  { name: "Blush Grid", color: "#e9aebe", pattern: "linear-gradient(135deg,rgba(255,255,255,.45) 25%,transparent 25%)" },
  { name: "Blue Letter", color: "#a9c7e8", pattern: "repeating-linear-gradient(0deg,transparent 0 16px,rgba(47,74,115,.18) 17px)" },
  { name: "Kraft Love", color: "#d7b68a", pattern: "radial-gradient(#9a7555 1px,transparent 1px)" },
  { name: "Cherry Check", color: "#8c1637", pattern: "linear-gradient(90deg,rgba(255,255,255,.12) 50%,transparent 50%)" }
];

const ribbons = [
  { name: "Cherry", color: "#8c1637" },
  { name: "Baby Blue", color: "#7fa5d0" },
  { name: "Soft Pink", color: "#e98ca7" },
  { name: "Butter", color: "#edc85e" },
  { name: "Ivory", color: "#fff4dc" }
];

const paperStyles = [
  { name: "Classic", bg: "#fffaf0", accent: "#811435", pattern: "repeating-linear-gradient(0deg,transparent 0 27px,rgba(115,73,84,.12) 28px)" },
  { name: "Blue Pink", bg: "#e5effc", accent: "#d85c7e", pattern: "linear-gradient(135deg,rgba(237,151,177,.28),transparent 52%)" },
  { name: "Vintage", bg: "#e8d1a8", accent: "#704a35", pattern: "radial-gradient(circle at 20% 10%,rgba(112,74,53,.15),transparent 30%)" },
  { name: "Cute Note", bg: "#ffe7ed", accent: "#bf4568", pattern: "radial-gradient(#fff 2px,transparent 2px)" },
  { name: "Polaroid Letter", bg: "#f7f6f1", accent: "#31527e", pattern: "linear-gradient(90deg,#dce9f7 4px,transparent 4px)" }
];

const stickers = ["♡", "🐻", "🎀", "⭐", "🍒", "☁️"];
const stamps = ["For Lutpi", "From Lutpi", "For Angie", "From Angie", "Open When You Miss Me", "Read This Slowly", "Special Delivery"];

const letterTemplates = [
  {
    name: "A Little Reminder",
    text: "Hi love,\n\nJust a little reminder that I’m always proud of you—even on the days when you don’t feel like your best self. Thank you for being exactly who you are.\n\nI’m always on your side. ♡"
  },
  {
    name: "Open When You Miss Me",
    text: "My love,\n\nIf you’re reading this because you miss me, close your eyes for a second and imagine the biggest hug from me. This distance, this moment, it will pass. I’m right here loving you.\n\nSee you soon, okay? ♡"
  },
  {
    name: "Thank You, Love",
    text: "To my favorite person,\n\nThank you for the quiet kindness, the silly moments, and every ordinary day that feels special because you are in it. Life is softer with you around.\n\nYours, always. ♡"
  },
  {
    name: "Birthday Wish",
    text: "Happy birthday, sayang!\n\nI hope this new chapter brings you more reasons to laugh, dream, and feel loved. You deserve a life that feels warm and wonderful.\n\nI love you endlessly. ♡"
  },
  {
    name: "After a Hard Day",
    text: "Hi love,\n\nYou made it through today, and that is enough. You don’t need to solve everything tonight. Let your shoulders rest and let me stay beside you, even from far away.\n\nTomorrow can wait. ♡"
  },
  {
    name: "Things I Adore About You",
    text: "My favorite person,\n\nThere are so many little things about you that I adore—the way you laugh, the way you care, and the way ordinary moments feel warmer when you are there.\n\nI would choose you in all the little moments. ♡"
  },
  {
    name: "I’m Sorry",
    text: "Hi love,\n\nI’m sorry for the part of this that hurt you. I care more about understanding each other than being right, and I want to do better—not only say it.\n\nWhen you’re ready, I’m here to listen. ♡"
  },
  {
    name: "Our Future",
    text: "To you,\n\nI think about all the versions of us we haven’t met yet: new places, slow mornings, difficult days we’ll get through, and stories we’ll tell over and over.\n\nI can’t wait to meet them with you. ♡"
  },
  {
    name: "Just Because",
    text: "Hi sayang,\n\nThere is no special occasion. I just wanted to leave proof that, in the middle of an ordinary day, you crossed my mind and made it softer.\n\nThat’s all. I love you. ♡"
  }
];

const STORAGE_KEY = "luthfiandra-love-studio";

export function LoveStudioPage() {
  const [mode, setMode] = useState<StudioMode>("bouquet");
  const [selectedFlower, setSelectedFlower] = useState<FlowerName>("Rose");
  const [flowers, setFlowers] = useState<PlacedFlower[]>([]);
  const [bouquetTitle, setBouquetTitle] = useState("A Little Garden for You");
  const [bouquetDescription, setBouquetDescription] = useState("Picked slowly, with all my love.");
  const [wrap, setWrap] = useState(wraps[0].name);
  const [ribbon, setRibbon] = useState(ribbons[0].name);
  const [paper, setPaper] = useState(paperStyles[0].name);
  const [sticker, setSticker] = useState(stickers[0]);
  const [stamp, setStamp] = useState(stamps[0]);
  const [customStamp, setCustomStamp] = useState("");
  const [recipient, setRecipient] = useState("Luthfi");
  const [customRecipient, setCustomRecipient] = useState("");
  const [template, setTemplate] = useState(letterTemplates[0].name);
  const [customTemplateTitle, setCustomTemplateTitle] = useState("");
  const [letter, setLetter] = useState(letterTemplates[0].text);
  const [saved, setSaved] = useState<SavedCreation[]>([]);
  const [toast, setToast] = useState("");
  const [openedItem, setOpenedItem] = useState<SavedCreation | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const activeWrap = wraps.find((item) => item.name === wrap) ?? wraps[0];
  const activeRibbon = ribbons.find((item) => item.name === ribbon) ?? ribbons[0];
  const activePaper = paperStyles.find((item) => item.name === paper) ?? paperStyles[0];
  const displayRecipient = recipient === "Custom name…" ? customRecipient.trim() || "Someone Special" : recipient;
  const displayStamp = stamp === "Custom stamp…" ? customStamp.trim() || "Made With Love" : stamp;
  const displayTemplateTitle = template === "Custom letter…" ? customTemplateTitle.trim() || "Untitled Letter" : template;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setSaved(JSON.parse(stored) as SavedCreation[]);
    } catch {
      setSaved([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const flowerCounts = useMemo(() => flowerOptions.map((option) => ({
    ...option,
    count: flowers.filter((flower) => flower.type === option.name).length
  })), [flowers]);

  const placeFlower = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    if (y > 78) return;
    setFlowers((current) => [...current, {
      id: `${Date.now()}-${current.length}`,
      type: selectedFlower,
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(75, y)),
      rotate: ((current.length * 37) % 34) - 17,
      scale: 1 + ((current.length * 13) % 23) / 100
    }]);
  };

  const saveBouquet = () => {
    if (!flowers.length) return setToast("Add at least one flower first ♡");
    if (!bouquetTitle.trim()) return setToast("Give your bouquet a name first ♡");
    const item: SavedBouquet = { id: crypto.randomUUID(), kind: "bouquet", createdAt: new Date().toISOString(), flowers, wrap, ribbon, title: bouquetTitle.trim(), description: bouquetDescription.trim() };
    setSaved((current) => [item, ...current]);
    setToast("Bouquet tucked safely into your mailbox!");
  };

  const saveLetter = () => {
    if (!letter.trim()) return setToast("Your letter is still empty ♡");
    const item: SavedLetter = { id: crypto.randomUUID(), kind: "letter", createdAt: new Date().toISOString(), recipient: displayRecipient, paper, sticker, stamp: displayStamp, template: displayTemplateTitle, content: letter };
    setSaved((current) => [item, ...current]);
    setToast("Letter sealed & saved to your mailbox!");
  };

  const sendWhatsApp = (kind: StudioMode) => {
    const message = kind === "bouquet"
      ? `I made you a bouquet on Luthfiandra: “${bouquetTitle.trim() || "A bouquet for you"}” 🌷♡${bouquetDescription.trim() ? `\n\n${bouquetDescription.trim()}` : ""}`
      : `I made you a letter on Luthfiandra for ${displayRecipient} 💌\n\n${letter}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const loadCreation = (item: SavedCreation) => {
    if (item.kind === "bouquet") {
      setFlowers(item.flowers);
      setWrap(item.wrap);
      setRibbon(item.ribbon);
      setBouquetTitle(item.title ?? `${item.flowers.length} Little Flowers`);
      setBouquetDescription(item.description ?? "");
      setMode("bouquet");
    } else {
      if (["Angie", "Luthfi"].includes(item.recipient)) {
        setRecipient(item.recipient);
      } else {
        setRecipient("Custom name…");
        setCustomRecipient(item.recipient);
      }
      setPaper(item.paper);
      setSticker(item.sticker);
      if (stamps.includes(item.stamp)) {
        setStamp(item.stamp);
      } else {
        setStamp("Custom stamp…");
        setCustomStamp(item.stamp);
      }
      if (letterTemplates.some((entry) => entry.name === item.template)) {
        setTemplate(item.template);
      } else {
        setTemplate("Custom letter…");
        setCustomTemplateTitle(item.template);
      }
      setLetter(item.content);
      setMode("letter");
    }
    setOpenedItem(null);
    window.scrollTo({ top: 250, behavior: "smooth" });
    setToast("Loaded back onto your studio desk!");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7efe5] text-[#3b1723]">
      <section className="studio-hero relative border-b-2 border-[#6e1730] px-5 pb-20 pt-16 md:px-8">
        <div className="absolute left-[7%] top-16 hidden rotate-[-14deg] text-7xl text-[#d75c7d] md:block">✂</div>
        <div className="absolute right-[8%] top-20 hidden rotate-[9deg] border-2 border-[#38567f] bg-[#b9d0ec] px-6 py-4 font-mono text-xs font-black shadow-[5px_6px_0_#d98ca4] md:block">made by hand<br />sent with love ♡</div>
        <div className="relative mx-auto max-w-6xl text-center">
          <p className="font-mono text-[10px] font-black uppercase tracking-[.35em] text-[#bd3f62]">welcome to our tiny creative room</p>
          <h1 className="mt-5 font-serif text-6xl font-black leading-[.85] text-[#511426] sm:text-8xl">
            love <span className="relative inline-block font-normal italic text-[#d34e72]">studio<span className="absolute -right-7 -top-5 text-3xl">♡</span></span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl font-mono text-sm leading-6 text-[#674653]">pick some flowers, write what your heart is holding, and send a tiny piece of love from this little studio.</p>
          <div className="mt-10 flex justify-center gap-3">
            {(["bouquet", "letter"] as StudioMode[]).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`studio-tab px-6 py-3 font-mono text-xs font-black uppercase tracking-wider transition ${mode === item ? "bg-[#790826] text-white shadow-[5px_6px_0_#9ebce1]" : "border-2 border-[#790826] bg-[#fffaf4] text-[#790826] hover:-translate-y-1"}`}>
                {item === "bouquet" ? "❀ bouquet bench" : "✉ letter desk"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-16 md:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(#8e6270_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative mx-auto max-w-7xl">
          {mode === "bouquet" ? (
            <div className="studio-switch grid gap-8 lg:grid-cols-[360px_1fr]">
              <aside className="h-fit border-2 border-[#5b1a2d] bg-[#fffaf5] shadow-[8px_9px_0_#dca4b3]">
                <div className="border-b-2 border-[#5b1a2d] bg-[#8b1739] px-5 py-4 text-white">
                  <p className="font-serif text-2xl font-black italic">the flower cart</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/75">choose, then click the canvas</p>
                </div>
                <div className="p-5">
                  <ToolLabel step="00" text="name your bouquet" />
                  <label className="mt-4 block font-mono text-[9px] font-black uppercase tracking-widest text-[#503245]">
                    bouquet title
                    <input value={bouquetTitle} onChange={(event) => setBouquetTitle(event.target.value)} maxLength={60} placeholder="e.g. Sunday Morning Flowers" className="mt-2 w-full border-2 border-[#790826] bg-white px-3 py-3 font-serif text-base normal-case outline-none focus:shadow-[4px_5px_0_#e2a3b5]" />
                  </label>
                  <label className="mt-4 block font-mono text-[9px] font-black uppercase tracking-widest text-[#503245]">
                    little description
                    <textarea value={bouquetDescription} onChange={(event) => setBouquetDescription(event.target.value)} maxLength={180} rows={3} placeholder="What is this bouquet trying to say?" className="mt-2 w-full resize-none border-2 border-[#790826] bg-white px-3 py-3 font-mono text-[10px] leading-5 normal-case outline-none focus:shadow-[4px_5px_0_#e2a3b5]" />
                  </label>
                  <ToolLabel step="01" text="pick your flowers" className="mt-7" />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {flowerCounts.map((flower) => (
                      <button key={flower.name} type="button" onClick={() => setSelectedFlower(flower.name)} className={`relative min-h-32 border p-2 text-center transition hover:-translate-y-1 ${selectedFlower === flower.name ? "border-[#790826] bg-[#f8d9e1] shadow-[3px_4px_0_#9ebce1]" : "border-[#d8bec5] bg-white"}`}>
                        <span className="mx-auto block h-20 w-20"><FlowerArt type={flower.name} color={flower.color} /></span>
                        <span className="mt-1 block font-mono text-[9px] font-black">{flower.name}</span>
                        {!!flower.count && <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[#790826] font-mono text-[9px] text-white">{flower.count}</span>}
                      </button>
                    ))}
                  </div>

                  <ToolLabel step="02" text="choose wrapping" className="mt-7" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {wraps.map((item) => (
                      <button key={item.name} type="button" onClick={() => setWrap(item.name)} title={item.name} className={`h-10 w-10 rounded-full border-2 transition hover:scale-110 ${wrap === item.name ? "border-[#790826] ring-4 ring-[#ead0d8]" : "border-white shadow"}`} style={{ backgroundColor: item.color, backgroundImage: item.pattern, backgroundSize: "12px 12px" }} />
                    ))}
                  </div>

                  <ToolLabel step="03" text="tie the ribbon" className="mt-7" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ribbons.map((item) => (
                      <button key={item.name} type="button" onClick={() => setRibbon(item.name)} title={item.name} className={`h-8 w-12 border transition hover:rotate-3 ${ribbon === item.name ? "border-[#511426] shadow-[3px_3px_0_#a9c6e7]" : "border-white"}`} style={{ backgroundColor: item.color }} />
                    ))}
                  </div>
                </div>
              </aside>

              <StudioCanvas title={bouquetTitle.trim() || "your bouquet"} subtitle={`${flowers.length} flowers · ${activeWrap.name} · ${activeRibbon.name}`}>
                <div className="bouquet-canvas relative mx-auto aspect-[4/5] w-full max-w-[520px] cursor-crosshair overflow-hidden" onClick={placeFlower} aria-label="Click to place selected flower">
                  <div className="absolute inset-x-[15%] bottom-[3%] z-[2] h-[64%] origin-bottom [clip-path:polygon(2%_3%,50%_17%,98%_3%,78%_100%,22%_100%)] opacity-90" style={{ backgroundColor: activeWrap.color, backgroundImage: activeWrap.pattern, backgroundSize: "18px 18px" }} />
                  {!flowers.length && (
                    <div className="absolute inset-x-0 top-[28%] z-10 text-center">
                      <span className="text-5xl opacity-35">✿</span>
                      <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#775866]">choose a flower<br />then plant it here</p>
                    </div>
                  )}
                  {flowers.map((flower) => {
                    const info = flowerOptions.find((item) => item.name === flower.type)!;
                    return (
                      <div key={flower.id} className="bouquet-flower pointer-events-none absolute z-10 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center drop-shadow-[0_7px_5px_rgba(68,47,38,.22)] sm:h-36 sm:w-36" style={{ left: `${flower.x}%`, top: `${flower.y}%`, transform: `translate(-50%,-50%) rotate(${flower.rotate}deg) scale(${flower.scale})` }}>
                        <FlowerArt type={flower.type} color={info.color} showStem={false} />
                        <button type="button" title={`Remove ${flower.type}`} aria-label={`Remove ${flower.type}`} onClick={(event) => { event.stopPropagation(); setFlowers((current) => current.filter((item) => item.id !== flower.id)); }} className="bouquet-remove pointer-events-auto absolute left-1/2 top-[42%] z-20 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/0 bg-transparent transition hover:border-white/80 hover:bg-[#790826]/15 focus-visible:border-white focus-visible:bg-[#790826]/20 focus-visible:outline-none" />
                      </div>
                    );
                  })}
                  <div className="pointer-events-none absolute inset-x-[15%] bottom-[3%] z-20 h-[52%] [clip-path:polygon(2%_0,50%_25%,98%_0,78%_100%,22%_100%)] opacity-95 shadow-lg" style={{ backgroundColor: activeWrap.color, backgroundImage: activeWrap.pattern, backgroundSize: "18px 18px" }} />
                  <div className="pointer-events-none absolute left-1/2 top-[72%] z-30 h-8 w-[50%] -translate-x-1/2 -rotate-1 rounded-sm shadow-md" style={{ backgroundColor: activeRibbon.color }} />
                  <div className="pointer-events-none absolute left-1/2 top-[70%] z-40 -translate-x-1/2">
                    <span className="absolute right-[-3px] top-5 h-24 w-8 origin-top rotate-[14deg] [clip-path:polygon(0_0,100%_0,72%_100%,48%_82%,20%_100%)]" style={{ backgroundColor: activeRibbon.color }} />
                    <span className="absolute left-[-3px] top-5 h-24 w-8 origin-top -rotate-[14deg] [clip-path:polygon(0_0,100%_0,80%_100%,52%_82%,28%_100%)]" style={{ backgroundColor: activeRibbon.color }} />
                    <span className="absolute right-1 top-0 h-14 w-20 -translate-y-1/2 translate-x-[84%] rotate-[-12deg] rounded-[55%_45%_55%_45%] border-4 border-black/10" style={{ backgroundColor: activeRibbon.color }} />
                    <span className="absolute left-1 top-0 h-14 w-20 -translate-x-[84%] -translate-y-1/2 rotate-[12deg] rounded-[45%_55%_45%_55%] border-4 border-black/10" style={{ backgroundColor: activeRibbon.color }} />
                    <span className="absolute left-1/2 top-0 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-black/10 shadow-sm" style={{ backgroundColor: activeRibbon.color }} />
                  </div>
                </div>
                <p className="mt-3 text-center font-mono text-[10px] text-[#826773]">tip: tap only the center of a flower to remove it</p>
                <StudioActions onSave={saveBouquet} onSend={() => sendWhatsApp("bouquet")} onClear={() => setFlowers([])} />
              </StudioCanvas>
            </div>
          ) : (
            <div className="studio-switch grid gap-8 lg:grid-cols-[380px_1fr]">
              <aside className="h-fit border-2 border-[#31527e] bg-[#f6faff] shadow-[8px_9px_0_#df9eb1]">
                <div className="border-b-2 border-[#31527e] bg-[#31527e] px-5 py-4 text-white">
                  <p className="font-serif text-2xl font-black italic">the stationery drawer</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/75">pick a template, make it yours</p>
                </div>
                <div className="space-y-6 p-5">
                  <SelectField label="send this to" value={recipient} onChange={setRecipient} options={["Angie", "Luthfi", "Custom name…"]} />
                  {recipient === "Custom name…" && (
                    <CustomField label="recipient's name" value={customRecipient} onChange={setCustomRecipient} placeholder="Type any name..." />
                  )}
                  <SelectField label="letter template" value={template} onChange={(value) => {
                    setTemplate(value);
                    if (value === "Custom letter…") {
                      setLetter("");
                    } else {
                      setLetter(letterTemplates.find((item) => item.name === value)?.text ?? "");
                    }
                  }} options={[...letterTemplates.map((item) => item.name), "Custom letter…"]} />
                  {template === "Custom letter…" && (
                    <CustomField label="your custom letter title" value={customTemplateTitle} onChange={setCustomTemplateTitle} placeholder="Name this letter..." />
                  )}
                  <div>
                    <ToolLabel step="01" text="paper style" />
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {paperStyles.map((item) => <button key={item.name} type="button" title={item.name} onClick={() => setPaper(item.name)} className={`aspect-square border-2 ${paper === item.name ? "border-[#790826] ring-2 ring-[#dfb2bf]" : "border-white shadow"}`} style={{ backgroundColor: item.bg, backgroundImage: item.pattern, backgroundSize: "14px 14px" }} />)}
                    </div>
                  </div>
                  <div>
                    <ToolLabel step="02" text="add a sticker" />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stickers.map((item) => <button key={item} type="button" onClick={() => setSticker(item)} className={`grid h-11 w-11 place-items-center text-xl transition hover:rotate-6 hover:scale-110 ${sticker === item ? "bg-[#f6c9d5] shadow-[3px_3px_0_#9ebce1]" : "bg-white"}`}>{item}</button>)}
                    </div>
                  </div>
                  <SelectField label="seal with a stamp" value={stamp} onChange={setStamp} options={[...stamps, "Custom stamp…"]} />
                  {stamp === "Custom stamp…" && (
                    <CustomField label="write your own stamp" value={customStamp} onChange={setCustomStamp} placeholder="e.g. Only For My Ndut" maxLength={32} />
                  )}
                  <div>
                    <ToolLabel step="03" text="edit your words" />
                    <textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={11} className="mt-3 w-full resize-y border-2 border-[#31527e] bg-white p-3 font-mono text-xs leading-5 outline-none focus:shadow-[4px_5px_0_#e2a3b5]" />
                  </div>
                </div>
              </aside>

              <StudioCanvas title={displayTemplateTitle} subtitle={`${paper} paper · sealed for ${displayRecipient}`}>
                <LetterPreview paper={activePaper} recipient={displayRecipient} content={letter} sticker={sticker} stamp={displayStamp} />
                <StudioActions onSave={saveLetter} onSend={() => sendWhatsApp("letter")} onClear={() => setLetter("")} />
              </StudioCanvas>
            </div>
          )}
        </div>
      </section>

      <section className="relative border-y-2 border-[#5a1930] bg-[#b9cfea] px-5 py-20 md:px-8">
        <div className="absolute left-[5%] top-14 hidden rotate-[-8deg] text-6xl text-[#29436d] md:block">⌁</div>
        <div className="mx-auto max-w-7xl">
          <header className="text-center">
            <p className="font-mono text-[10px] font-black uppercase tracking-[.32em] text-[#29436d]">saved with care</p>
            <h2 className="mt-3 font-serif text-5xl font-black text-[#431524]">digital mailbox <span className="text-[#c84066]">✉</span></h2>
            <p className="mx-auto mt-4 max-w-md font-mono text-xs leading-5">Every bouquet and letter you save waits right here. Open it whenever you need a little love.</p>
          </header>

          {!saved.length ? (
            <div className="mx-auto mt-12 max-w-lg border-2 border-dashed border-[#405d87] bg-white/35 px-8 py-14 text-center">
              <p className="text-5xl">📭</p>
              <p className="mt-4 font-serif text-2xl font-black">your mailbox is waiting</p>
              <p className="mt-2 font-mono text-xs">create something above and save it here ♡</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((item, index) => (
                <article key={item.id} className={`mail-item relative border-2 border-[#521426] bg-[#fffaf2] p-5 shadow-[6px_7px_0_#d6809b] ${index % 2 ? "sm:translate-y-5" : ""}`}>
                  <span className="absolute -top-3 left-1/2 h-7 w-20 -translate-x-1/2 rotate-[-3deg] bg-[#e6c2b6]/80" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[9px] font-black uppercase tracking-widest text-[#c23e63]">{item.kind === "bouquet" ? "handpicked bouquet" : `letter for ${item.recipient}`}</p>
                      <h3 className="mt-2 font-serif text-2xl font-black">{item.kind === "bouquet" ? item.title ?? `${item.flowers.length} little flowers` : item.template}</h3>
                      {item.kind === "bouquet" && item.description && <p className="mt-2 line-clamp-2 font-mono text-[10px] leading-4 text-[#71525e]">{item.description}</p>}
                    </div>
                    <span className="text-4xl">{item.kind === "bouquet" ? "💐" : "💌"}</span>
                  </div>
                  <p className="mt-5 font-mono text-[9px] text-[#80616d]">{new Date(item.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => setOpenedItem(item)} className="flex-1 bg-[#790826] px-3 py-2.5 font-mono text-[10px] font-black text-white">open again</button>
                    <button type="button" onClick={() => setSaved((current) => current.filter((entry) => entry.id !== item.id))} className="border border-[#790826] px-3 py-2 font-mono text-[10px] font-black text-[#790826]" aria-label="Delete saved item">delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {toast && <div className="studio-toast fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap bg-[#40121f] px-6 py-3 font-mono text-xs font-black text-white shadow-[5px_6px_0_#d98da4]" role="status">{toast}</div>}

      {openedItem && (
        <div className="gift-modal fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-[#2d1020]/65 px-4 py-8 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setOpenedItem(null)}>
          <div className="gift-dialog relative w-full max-w-xl border-2 border-[#531628] bg-[#fffaf2] p-6 shadow-[10px_12px_0_rgba(30,42,68,.4)]">
            <button type="button" onClick={() => setOpenedItem(null)} className="absolute right-4 top-3 z-10 text-3xl">×</button>
            {openedItem.kind === "letter" ? (
              <LetterPreview paper={paperStyles.find((item) => item.name === openedItem.paper) ?? paperStyles[0]} recipient={openedItem.recipient} content={openedItem.content} sticker={openedItem.sticker} stamp={openedItem.stamp} compact />
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto h-28 w-28"><FlowerArt type={openedItem.flowers[0]?.type ?? "Rose"} color={flowerOptions.find((item) => item.name === (openedItem.flowers[0]?.type ?? "Rose"))?.color ?? "#d74e70"} /></div>
                <h3 className="mt-5 font-serif text-3xl font-black">{openedItem.title ?? `${openedItem.flowers.length} flowers for you`}</h3>
                {openedItem.description && <p className="mx-auto mt-3 max-w-sm font-mono text-xs leading-5 text-[#71525e]">{openedItem.description}</p>}
                <p className="mt-2 font-mono text-xs">{openedItem.wrap} · {openedItem.ribbon} ribbon</p>
                <div className="mt-5 flex flex-wrap justify-center -space-x-5">{openedItem.flowers.map((flower) => <span key={flower.id} className="h-20 w-20">{<FlowerArt type={flower.type} color={flowerOptions.find((item) => item.name === flower.type)?.color ?? "#d74e70"} />}</span>)}</div>
              </div>
            )}
            <button type="button" onClick={() => loadCreation(openedItem)} className="mt-5 w-full bg-[#790826] px-5 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#b9d0ec]">put this back on my desk →</button>
          </div>
        </div>
      )}
    </main>
  );
}

function ToolLabel({ step, text, className = "" }: { step: string; text: string; className?: string }) {
  return <p className={`font-mono text-[10px] font-black uppercase tracking-widest text-[#6d3346] ${className}`}><span className="mr-2 rounded-full bg-[#790826] px-2 py-1 text-white">{step}</span>{text}</p>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block font-mono text-[10px] font-black uppercase tracking-widest text-[#503245]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border-2 border-[#31527e] bg-white px-3 py-3 font-mono text-xs normal-case outline-none">
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function CustomField({ label, value, onChange, placeholder, maxLength = 60 }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; maxLength?: number }) {
  return (
    <label className="note-reveal block border-l-4 border-[#d85c7e] bg-[#fbe6ec] p-3 font-mono text-[9px] font-black uppercase tracking-widest text-[#503245]">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} placeholder={placeholder} autoFocus className="mt-2 w-full border-2 border-[#31527e] bg-white px-3 py-3 font-mono text-xs normal-case outline-none focus:shadow-[3px_4px_0_#dca1b1]" />
    </label>
  );
}

function StudioCanvas({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative border-2 border-[#58172b] bg-[#e8ded2] p-3 shadow-[10px_12px_0_rgba(49,82,126,.2)] sm:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-[#8c6975] pb-3">
        <div><h2 className="font-serif text-2xl font-black italic">{title}</h2><p className="font-mono text-[9px] uppercase tracking-wider text-[#80616c]">{subtitle}</p></div>
        <div className="flex gap-1.5"><i className="h-3 w-3 rounded-full bg-[#d34e72]" /><i className="h-3 w-3 rounded-full bg-[#edc85e]" /><i className="h-3 w-3 rounded-full bg-[#6d96c5]" /></div>
      </div>
      <div className="bg-[#fffaf4] p-4 sm:p-7">{children}</div>
    </div>
  );
}

function StudioActions({ onSave, onSend, onClear }: { onSave: () => void; onSend: () => void; onClear: () => void }) {
  return (
    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
      <button type="button" onClick={onSave} className="bg-[#790826] px-6 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#d99aae] transition hover:-translate-y-1">save to mailbox</button>
      <button type="button" onClick={onSend} className="bg-[#31527e] px-6 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#a9c7e8] transition hover:-translate-y-1">send via WhatsApp ↗</button>
      <button type="button" onClick={onClear} className="border-2 border-[#80616d] px-4 py-3 font-mono text-[10px] font-black text-[#684653]">clear</button>
    </div>
  );
}

function LetterPreview({ paper, recipient, content, sticker, stamp, compact = false }: { paper: typeof paperStyles[number]; recipient: string; content: string; sticker: string; stamp: string; compact?: boolean }) {
  return (
    <div className={`letter-paper relative mx-auto w-full max-w-2xl overflow-hidden border border-[#9f7d71] p-7 shadow-[7px_8px_0_rgba(49,82,126,.2)] sm:p-10 ${compact ? "min-h-[420px]" : "min-h-[610px]"}`} style={{ backgroundColor: paper.bg, backgroundImage: paper.pattern, backgroundSize: "28px 28px" }}>
      <div className="flex items-start justify-between">
        <div><p className="font-mono text-[9px] font-black uppercase tracking-[.25em]" style={{ color: paper.accent }}>a tiny letter for</p><h3 className="mt-1 font-serif text-4xl font-black" style={{ color: paper.accent }}>{recipient},</h3></div>
        <span className="rotate-12 text-4xl drop-shadow">{sticker}</span>
      </div>
      <p className="mt-9 whitespace-pre-wrap font-serif text-[17px] leading-8 text-[#4e3440]">{content || "Your words will appear here..."}</p>
      <div className="absolute bottom-7 right-7 rotate-[-5deg] border-2 border-current px-3 py-2 text-center font-mono text-[9px] font-black uppercase tracking-wider opacity-75" style={{ color: paper.accent }}>{stamp}</div>
      <span className="absolute bottom-5 left-6 font-serif text-3xl italic" style={{ color: paper.accent }}>with love, ♡</span>
    </div>
  );
}

function FlowerArt({ type, color, showStem = true }: { type: FlowerName; color: string; showStem?: boolean }) {
  const petal = color;
  const outline = "#6d3547";
  const leaf = "#75966a";
  const viewBox = showStem ? "0 0 100 100" : "0 0 100 72";

  if (type === "Tulip") {
    return (
      <svg viewBox={viewBox} className="h-full w-full overflow-visible" aria-hidden="true">
        {showStem && <><path d="M51 88C49 67 49 48 50 34" fill="none" stroke={leaf} strokeWidth="4" strokeLinecap="round" /><path d="M49 70C34 58 30 68 47 78M52 63C67 51 72 60 54 71" fill={leaf} stroke="#4f744e" strokeWidth="1.5" /></>}
        <path d="M28 22c5 2 12 8 22 18 9-11 16-17 22-19 2 25-6 37-22 37S26 46 28 22Z" fill={petal} stroke={outline} strokeWidth="2" />
        <path d="M39 27c3 5 7 10 11 13 4-5 8-10 12-14" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "Sunflower" || type === "Daisy") {
    const petals = Array.from({ length: type === "Sunflower" ? 14 : 12 });
    return (
      <svg viewBox={viewBox} className="h-full w-full overflow-visible" aria-hidden="true">
        {showStem && <><path d="M50 90V51" stroke={leaf} strokeWidth="4" strokeLinecap="round" /><path d="M50 73c-16-13-20 0-3 9M52 66c15-12 20 1 2 9" fill={leaf} stroke="#4f744e" strokeWidth="1.5" /></>}
        <g transform="translate(50 39)">
          {petals.map((_, index) => <ellipse key={index} cx="0" cy="-23" rx={type === "Sunflower" ? 8 : 7} ry={type === "Sunflower" ? 17 : 19} fill={petal} stroke={outline} strokeWidth="1.3" transform={`rotate(${index * (360 / petals.length)})`} />)}
          <circle r={type === "Sunflower" ? 16 : 13} fill={type === "Sunflower" ? "#70452d" : "#e8ae3d"} stroke={outline} strokeWidth="2" />
          {type === "Sunflower" && <circle r="10" fill="#93613a" strokeDasharray="2 3" stroke="#d49b50" strokeWidth="2" />}
        </g>
      </svg>
    );
  }

  if (type === "Baby’s Breath") {
    const blooms = [[30,25],[48,18],[66,27],[24,43],[44,38],[63,44],[76,40],[35,55],[57,58]];
    return (
      <svg viewBox={viewBox} className="h-full w-full overflow-visible" aria-hidden="true">
        {showStem && blooms.map(([x,y], index) => <path key={index} d={`M50 91Q${x} ${y + 20} ${x} ${y}`} fill="none" stroke={leaf} strokeWidth="1.8" />)}
        {blooms.map(([x,y], index) => <g key={index} transform={`translate(${x} ${y})`}><circle cx="-5" cy="0" r="5" fill="#fffdf7" stroke="#a98c91"/><circle cx="4" cy="-3" r="5" fill="#fffdf7" stroke="#a98c91"/><circle cx="2" cy="5" r="5" fill="#fffdf7" stroke="#a98c91"/><circle r="2.5" fill="#e8c966"/></g>)}
      </svg>
    );
  }

  if (type === "Lily") {
    const petals = Array.from({ length: 6 });
    return (
      <svg viewBox={viewBox} className="h-full w-full overflow-visible" aria-hidden="true">
        {showStem && <path d="M50 92V50" stroke={leaf} strokeWidth="4" strokeLinecap="round" />}
        <g transform="translate(50 40)">
          {petals.map((_, index) => <path key={index} d="M0 2C-12-12-9-30 0-36 9-28 12-10 0 2Z" fill={petal} stroke={outline} strokeWidth="1.5" transform={`rotate(${index * 60})`} />)}
          <circle r="7" fill="#f0b853" />
          <path d="M0 0v-18M0 0l13-13M0 0l-13-13" stroke="#8e6a48" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox={viewBox} className="h-full w-full overflow-visible" aria-hidden="true">
      {showStem && <><path d="M50 91V52" stroke={leaf} strokeWidth="4" strokeLinecap="round" /><path d="M49 73C33 61 30 74 47 81M52 66c15-12 21 1 2 10" fill={leaf} stroke="#4f744e" strokeWidth="1.5" /></>}
      <g transform="translate(50 39)">
        {[0,60,120,180,240,300].map((rotation) => <ellipse key={rotation} cx="0" cy="-18" rx="13" ry="22" fill={petal} stroke={outline} strokeWidth="1.6" transform={`rotate(${rotation})`} />)}
        <circle r="15" fill="#bd3f62" stroke={outline} strokeWidth="2" />
        <path d="M-8-2c4-9 15-9 17 0 1 7-8 12-15 8-6-4-2-11 5-12" fill="none" stroke="#f5a9bb" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

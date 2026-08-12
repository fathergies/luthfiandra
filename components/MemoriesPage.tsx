"use client";

import { useMemo, useState } from "react";

const categories = ["Favorite Photos", "Favorite Dates", "Random Screenshots", "Funniest Moments", "Favorite Trips", "Little Things I Love About You"] as const;
type Category = typeof categories[number];
type Month = "April" | "May" | "June" | "July" | "August";
type Shape = "polaroid" | "ticket" | "chat" | "camera" | "key" | "flower" | "receipt";
type Memory = { id: number; title: string; date: string; month: Month; category: Category; shape: Shape; icon: string; story: string; color: string; image: string };

const timeline = [
  ["April 2026", "first time we met", "👋", "The beginning didn’t announce itself. It just quietly became my favorite plot twist.", "#e59ab0"],
  ["April 2026", "our first proper date", "🍽️", "A little nervous, a lot of talking, and somehow time moved much too quickly.", "#a9c5e8"],
  ["May 2026", "a random favorite memory", "📸", "Nothing big happened—and that is why I love it. Just us being us.", "#efd19a"],
  ["June 2026", "the funniest moment", "😂", "The kind of laugh that hurts your stomach and becomes an inside joke forever.", "#d58aac"],
  ["July 2026", "a day I’ll never forget", "🎟️", "A day I wish I could fold up and keep safely in my pocket.", "#91b4df"],
  ["Today · August 2026", "still writing our story", "♡", "Five months of tiny moments, loud laughs, and choosing each other. More, please.", "#b90f42"]
] as const;

const memories: Memory[] = [
  [1,"The first photo I kept looking at","Apr 12","April","Favorite Photos","polaroid","📷","This is where your face started feeling familiar in the nicest way. Replace this with the real photo and story.","#f0b5c4"],
  [2,"Table for two","Apr 21","April","Favorite Dates","ticket","🍽️","Our first proper date. I remember the table, the conversation, and wanting the night to last longer.","#a9c8e8"],
  [3,"Our accidental meme","Apr 27","April","Random Screenshots","chat","💬","One screenshot, zero context, somehow still hilarious. This slot is ready for that chat you can never delete.","#f4d29b"],
  [4,"The laugh-snort incident","May 05","May","Funniest Moments","camera","🎥","A serious moment ruined in the best possible way. Insert the video evidence here later.","#dc94ac"],
  [5,"A drive with no destination","May 17","May","Favorite Trips","key","🔑","The destination barely mattered. The playlist, the road, and having you beside me were the whole trip.","#8eadd4"],
  [6,"The way you always check in","May 29","May","Little Things I Love About You","flower","🌼","You remember to ask if I’m okay, even during your busy days. A small habit that makes me feel loved.","#f0c35d"],
  [7,"Soft light, favorite face","Jun 03","June","Favorite Photos","polaroid","📷","One of those unplanned photos that feels more honest than anything posed.","#e7a1b5"],
  [8,"Our comfort-food night","Jun 11","June","Favorite Dates","receipt","🧾","Not fancy, not planned, completely perfect. This is a receipt I would actually keep forever.","#dbc39f"],
  [9,"Voice note at 1:13 AM","Jun 19","June","Random Screenshots","chat","🎙️","Too sleepy to make sense, too cute to delete. A museum-worthy artifact.","#a4c6e9"],
  [10,"That one wrong turn","Jun 28","June","Funniest Moments","ticket","↪️","We were definitely lost. We were also laughing too hard to care. Ten out of ten navigation.","#e49aae"],
  [11,"A small escape together","Jul 06","July","Favorite Trips","key","🗺️","Placeholder for a favorite July trip: the views, the snacks, and everything that went off-plan.","#89afd9"],
  [12,"Your very specific food order","Jul 12","July","Little Things I Love About You","receipt","🥤","I love learning the tiny details: what you order, what you avoid, and what you steal from my plate.","#edc768"],
  [13,"A photo that feels like home","Jul 20","July","Favorite Photos","polaroid","🏠","This placeholder is waiting for a photo that instantly takes you back to a very good day.","#d98fa9"],
  [14,"The date that almost got cancelled","Jul 29","July","Favorite Dates","ticket","🎫","Plans changed three times, but we made it—and it turned into one of my favorites.","#9ab9df"],
  [15,"No-context masterpiece","Aug 02","August","Random Screenshots","chat","📱","Future us will have no idea why this was funny. Current us knows it belongs here.","#f0cb87"],
  [16,"Could not stop laughing","Aug 09","August","Funniest Moments","camera","🤣","Add the most chaotic video from August here. The blurrier, the better.","#e390aa"],
  [17,"Our favorite road so far","Aug 16","August","Favorite Trips","key","🚗","A trip memory isn’t only the view. It’s the snacks, missed exits, and songs we replayed.","#83a8d2"],
  [18,"You remembered","Aug 25","August","Little Things I Love About You","flower","🌷","You remembered something small I said weeks ago. I acted normal; my heart absolutely did not.","#eeb4c3"]
].map(([id,title,date,month,category,shape,icon,story,color]) => ({
  id,title,date,month,category,shape,icon,story,color,
  image: `/assets/memories/shelf/memory-${String(id).padStart(2, "0")}.jpg`
} as Memory));

const sushi = [
  ["recreate the pose","🍣","Find an old photo, recreate the pose right now, and take the new version.","PHOTO MISSION"],
  ["camera-roll race","🍙","First person to find the oldest screenshot of us wins. No deleting evidence.","30 SECOND CHALLENGE"],
  ["tell your version","🍤","Pick our first date and tell the story separately. Compare the details you remember.","STORY MISSION"],
  ["the soundtrack","🥟","Choose one song that belongs in the soundtrack of us, then play both picks.","MUSIC MISSION"],
  ["tiny detail check","🍥","Name one tiny thing the other person does that always makes you feel cared for.","SWEET CHALLENGE"],
  ["blind memory draw","🍣","One person describes a favorite photo while the other draws it without looking.","CHAOS MISSION"],
  ["three-word review","🍡","Review your most recent date using exactly three words. Defend every word.","DATE REVIEW"],
  ["send it again","🥢","Find a message that still makes you smile and send it to each other one more time.","CHAT MISSION"],
  ["next empty frame","🍱","Plan one small memory you want to make before this month ends.","FUTURE MISSION"],
  ["dealer's choice","🍵","Give the other person one harmless dare inspired by a memory on this page.","WILD CARD"]
] as const;

const months: ("All Months" | Month)[] = ["All Months","April","May","June","July","August"];

export function MemoriesPage() {
  const [month, setMonth] = useState<(typeof months)[number]>("All Months");
  const [category, setCategory] = useState<"Everything" | Category>("Everything");
  const [active, setActive] = useState<Memory | null>(null);
  const [activeSushi, setActiveSushi] = useState<number | null>(null);
  const filtered = useMemo(() => memories.filter(m => (month === "All Months" || m.month === month) && (category === "Everything" || m.category === category)), [month, category]);
  const activeTimeline = active ? timeline.find(item => item[0].includes(active.month)) ?? timeline[timeline.length-1] : null;

  return (
    <main className="overflow-hidden bg-[#f2eadf] text-[#351624]">
      <section className="museum-hero relative min-h-[620px] border-b-[8px] border-[#64162d] px-5 py-20 md:px-8">
        <span className="absolute left-[5%] top-14 hidden rotate-[-9deg] border border-[#64162d] bg-[#f1b6c6] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-widest shadow-[4px_5px_0_#92b0d4] md:block">admit two · always</span>
        <span className="absolute right-[7%] top-20 hidden text-7xl text-[#49688f] md:block">⌁</span>
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-mono text-[10px] font-black uppercase tracking-[.38em] text-[#b63258]">COLLECTION OF OUR MEMORIES NDUT</p>
          <h1 className="mt-7 font-serif text-6xl font-black leading-[.82] text-[#481222] sm:text-8xl lg:text-9xl">the little<br/><span className="font-normal italic text-[#c94168]">museum of us</span></h1>
          <p className="mx-auto mt-9 max-w-xl font-mono text-xs leading-6 text-[#674550]">since april and a growing collection of days I never want to forget.</p>
          <a href="#shelf" className="mt-10 inline-flex h-28 w-28 rotate-6 items-center justify-center rounded-full border-2 border-[#64162d] bg-[#a9c5e5] text-center font-mono text-[9px] font-black uppercase leading-4 shadow-[6px_7px_0_#df8fa8] transition hover:rotate-0">enter the<br/>exhibition<br/>↓</a>
        </div>
      </section>

      <section id="shelf" className="museum-room relative border-y-2 border-[#541529] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading number="room 01" title="the memory shelf" subtitle="tap any object to open its story and see where it belongs in our timeline" />
          <div className="mt-12 border-2 border-[#541529] bg-[#f8f0e5] p-4 shadow-[8px_10px_0_#92afd2]">
            <div className="flex flex-wrap items-center gap-2"><span className="mr-2 font-mono text-[9px] font-black uppercase tracking-widest">month:</span>{months.map(x=><Filter key={x} active={month===x} click={()=>setMonth(x)}>{x}</Filter>)}</div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-[#c5a8b0] pt-4"><span className="mr-2 font-mono text-[9px] font-black uppercase tracking-widest">collection:</span><Filter active={category==="Everything"} click={()=>setCategory("Everything")}>Everything</Filter>{categories.map(x=><Filter key={x} active={category===x} click={()=>setCategory(x)}>{x}</Filter>)}</div>
          </div>
          <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-widest text-[#755461]">showing {filtered.length} museum objects</p>
          {filtered.length ? <div className="mt-7 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((m,i)=><MemoryObject key={m.id} memory={m} index={i} open={()=>setActive(m)}/>)}</div> : <div className="mt-10 border-2 border-dashed border-[#9d7180] bg-white/45 p-16 text-center font-mono text-xs">This little shelf is empty for now ♡</div>}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#173754] px-5 py-24 text-[#fff8eb] md:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]"/>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] font-black uppercase tracking-[.35em] text-[#ef9ab3]">room 02 · memory missions</p>
            <h2 className="mt-4 font-serif text-5xl font-black sm:text-7xl">pick a plate,<br/><span className="font-normal italic text-[#f2b8c8]">make a new memory.</span></h2>
            <p className="mx-auto mt-5 max-w-lg font-mono text-xs leading-6 text-white/70">The shelf keeps the past. This conveyor gives you ten tiny missions to do together right now.</p>
          </div>
          <div className="relative mt-16 overflow-hidden border-y-8 border-[#0e2438] bg-[#9ab4ce] py-10 shadow-inner">
            <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 bg-[#456785]"/>
            <div className="sushi-belt flex w-max gap-9 px-8">
              {[...sushi,...sushi].map((x,i)=><button key={`${x[0]}-${i}`} type="button" onClick={()=>setActiveSushi(i%10)} className="group relative flex w-40 shrink-0 flex-col items-center"><span className="relative z-10 block h-24 w-36 transition group-hover:-translate-y-4 group-hover:rotate-6"><SushiArt index={i%10}/></span><span className="mt-[-14px] block h-9 w-32 rounded-[50%] border-4 border-white bg-[#df809c] shadow-[0_7px_0_rgba(14,36,56,.35)]"/><span className="mt-4 font-mono text-[9px] font-black uppercase tracking-wider text-[#15324d]">plate {i%10+1}</span></button>)}
            </div>
          </div>
          <div className="mx-auto mt-10 min-h-48 max-w-2xl">
            {activeSushi===null ? <div className="border border-dashed border-white/30 p-10 text-center font-mono text-xs text-white/60">tap any plate to receive your mission ♡</div> :
              <article key={activeSushi} className="sushi-reveal relative border-2 border-[#f1cbd5] bg-[#fff8ed] p-8 text-center text-[#351624] shadow-[9px_10px_0_#c45276]">
                <span className="absolute -top-12 left-1/2 block h-24 w-36 -translate-x-1/2"><SushiArt index={activeSushi}/></span><p className="mt-10 font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#bf3e63]">mission plate no. {activeSushi+1}</p><h3 className="mt-3 font-serif text-3xl font-black">{sushi[activeSushi][0]}</h3><p className="mx-auto mt-3 max-w-lg font-mono text-xs leading-6 text-[#684a55]">{sushi[activeSushi][2]}</p><div className="mx-auto mt-6 inline-block rotate-[-2deg] border-2 border-[#541529] bg-[#f1c05f] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-widest shadow-[4px_5px_0_#91afd3]">{sushi[activeSushi][3]}</div>
              </article>}
          </div>
        </div>
      </section>

      {active && <div className="memory-modal fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#1b1015]/75 px-4 py-8 backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&setActive(null)}>
        <article className="memory-dialog relative w-full max-w-2xl border-2 border-[#541529] bg-[#fff9ef] p-6 shadow-[12px_14px_0_rgba(137,174,214,.55)] sm:p-9">
          <button type="button" onClick={()=>setActive(null)} className="absolute right-4 top-3 z-10 text-3xl">×</button>
          <div className="grid gap-7 sm:grid-cols-[.85fr_1.15fr]"><div className="relative grid aspect-[4/5] place-items-center overflow-hidden border-[10px] border-white text-center shadow-md" style={{backgroundColor:active.color}}><span><b className="block text-7xl">{active.icon}</b><small className="mt-4 block font-mono text-[8px] font-black uppercase tracking-widest">your media here</small></span><img src={active.image} alt={active.title} className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /></div><div className="self-center"><p className="font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#bd3c61]">{active.date} · {active.category}</p><h2 className="mt-3 font-serif text-4xl font-black leading-tight">{active.title}</h2><p className="mt-5 font-mono text-xs leading-6 text-[#684955]">{active.story}</p><span className="mt-7 inline-block rotate-[-3deg] bg-[#b6cce7] px-5 py-2 font-serif text-lg font-black italic">keep this one forever ♡</span></div></div>
          {activeTimeline&&<div className="mt-8 border-t-2 border-dashed border-[#c6a5af] pt-6"><p className="font-mono text-[8px] font-black uppercase tracking-[.28em] text-[#31527e]">how we got here · timeline chapter</p><div className="mt-4 flex gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-[#541529] text-2xl" style={{backgroundColor:activeTimeline[4]}}>{activeTimeline[2]}</span><div><p className="font-mono text-[8px] font-black uppercase text-[#b6385d]">{activeTimeline[0]}</p><h3 className="mt-1 font-serif text-2xl font-black">{activeTimeline[1]}</h3><p className="mt-2 font-mono text-[10px] leading-5 text-[#70515c]">{activeTimeline[3]}</p></div></div></div>}
        </article>
      </div>}
    </main>
  );
}

function Heading({number,title,subtitle}:{number:string;title:string;subtitle:string}) { return <header className="text-center"><p className="font-mono text-[9px] font-black uppercase tracking-[.32em] text-[#bd3c61]">{number}</p><h2 className="mt-3 font-serif text-5xl font-black sm:text-6xl">{title}</h2><p className="mx-auto mt-4 max-w-lg font-mono text-xs leading-5 text-[#74535e]">{subtitle}</p></header> }
function SushiArt({index}:{index:number}) { const column=index%5;const row=Math.floor(index/5);return <span aria-hidden="true" className="block h-full w-full bg-no-repeat" style={{backgroundImage:"url('/assets/memories/sushi-sprite.png')",backgroundSize:"500% 200%",backgroundPosition:`${column*25}% ${row*100}%`}}/> }
function Filter({active,click,children}:{active:boolean;click:()=>void;children:React.ReactNode}) { return <button type="button" onClick={click} className={`rounded-full border px-3 py-2 font-mono text-[9px] font-black transition ${active?"border-[#64162d] bg-[#64162d] text-white shadow-[2px_3px_0_#a9c4e3]":"border-[#a8818d] bg-white text-[#6c4350] hover:-translate-y-1"}`}>{children}</button> }
function MemoryObject({memory,index,open}:{memory:Memory;index:number;open:()=>void}) {
  const shapes:Record<Shape,string>={polaroid:"rotate-[-3deg] border-[10px] border-b-[42px] border-white",ticket:"rotate-2 [clip-path:polygon(0_0,96%_0,100%_12%,96%_24%,100%_36%,96%_48%,100%_60%,96%_72%,100%_84%,96%_100%,0_100%,4%_84%,0_72%,4%_60%,0_48%,4%_36%,0_24%,4%_12%)]",chat:"rounded-[2rem] rounded-bl-sm",camera:"rounded-[2rem] border-[10px] border-[#422432]",key:"rounded-[50%_15%_50%_15%]",flower:"rounded-[50%]",receipt:"rotate-[-2deg] [clip-path:polygon(0_0,100%_0,100%_95%,92%_100%,84%_95%,76%_100%,68%_95%,60%_100%,52%_95%,44%_100%,36%_95%,28%_100%,20%_95%,12%_100%,4%_95%,0_100%)]"};
  return <button type="button" onClick={open} className="memory-object group relative mx-auto w-full max-w-sm pt-4 text-left"><span className={`relative grid min-h-64 place-items-center overflow-hidden p-7 shadow-[7px_9px_0_#a9bdd5] transition duration-300 group-hover:-translate-y-3 group-hover:rotate-1 ${shapes[memory.shape]}`} style={{backgroundColor:memory.color}}><span className="absolute inset-0 opacity-25 [background-image:radial-gradient(#4d2130_1px,transparent_1px)] [background-size:15px_15px]"/><span className="relative text-center"><b className="block text-6xl">{memory.icon}</b><small className="mt-3 block font-mono text-[8px] font-black uppercase tracking-[.2em]">object no. {String(index+1).padStart(2,"0")}</small></span><img src={memory.image} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /><span className="absolute bottom-2 right-2 rounded-full bg-[#fff8ef]/90 px-2 py-1 font-mono text-[7px] font-black text-[#541529]">#{String(memory.id).padStart(2,"0")}</span></span><span className="mt-4 block font-mono text-[9px] font-black uppercase tracking-wider text-[#ba3c60]">{memory.date} · {memory.month}</span><span className="mt-1 block font-serif text-2xl font-black">{memory.title}</span><span className="mt-1 block font-mono text-[9px] text-[#74525e]">{memory.category} →</span></button>
}

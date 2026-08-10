"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";

type GameId = "bingo" | "memory" | "month" | "cards" | "quiz" | "psychic" | "archive" | "fake";
type Player = { id: string; name: string; avatar: string; color: string; points: number; games: number };

const defaultPlayers: Player[] = [
  { id: "angie", name: "Angie", avatar: "🎀", color: "#e88ba8", points: 0, games: 0 },
  { id: "andra", name: "Andra", avatar: "🧢", color: "#789fd0", points: 0, games: 0 }
];

const games: { id: GameId; number: string; title: string; icon: string; description: string; color: string; tag: string }[] = [
  { id: "bingo", number: "01", title: "Family 100: Couple Edition", icon: "🏆", description: "Pilih kategori, jawab pertanyaannya, lalu buka jawaban dan kumpulkan poinnya.", color: "#e68ca7", tag: "survey says!" },
  { id: "memory", number: "02", title: "Who Said That?", icon: "💬", description: "Baca potongan chat-nya dan tebak: ini dikirim Angie atau Andra?", color: "#8eafd7", tag: "10 chat rounds" },
  { id: "month", number: "03", title: "Telepathy Test", icon: "⚡", description: "Dapatkan satu kategori, tulis satu kata diam-diam, lalu lihat apakah pikiran kalian sama.", color: "#efc65c", tag: "same word wins" },
  { id: "cards", number: "04", title: "Draw Our Memory", icon: "✎", description: "Draw the prompt before time runs out, then compare your masterpiece with what actually happened.", color: "#c86488", tag: "10 chaotic sketches" },
  { id: "quiz", number: "05", title: "The Password Is Us", icon: "🔐", description: "Inspect four objects, connect the clues, and crack our secret four-digit password.", color: "#759ac8", tag: "mini escape room" },
  { id: "psychic", number: "06", title: "This or That: Psychic Edition", icon: "🔮", description: "Choose in secret, then let your partner predict your answer. How well can you read each other?", color: "#9277bd", tag: "predict your partner" },
  { id: "archive", number: "07", title: "Two Truths & A Lie: Archive Edition", icon: "🗂️", description: "Three stories from our archive. One is fake—find the lie and inspect the receipt.", color: "#73a58f", tag: "evidence included" },
  { id: "fake", number: "08", title: "Photo or Fake?", icon: "📸", description: "Decide whether the caption is a real memory or something that literally never happened.", color: "#dd9a59", tag: "real or made up" }
];

type FamilyQuestion = { question: string; answer: string; points: number };
type FamilyCategory = { name: string; icon: string; color: string; questions: FamilyQuestion[] };

const familyCategories: FamilyCategory[] = [
  { name: "Tentang Kita", icon: "♡", color: "#d95f83", questions: [
    { question: "Siapa yang biasanya bilang kangen duluan?", answer: "Angie", points: 10 },
    { question: "Apa kegiatan sederhana yang paling sering kita lakukan bareng?", answer: "Makan bareng", points: 20 },
    { question: "Di bulan apa cerita kita mulai makin dekat?", answer: "April", points: 30 },
    { question: "Apa yang selalu berhasil bikin suasana kita membaik?", answer: "Ngobrol baik-baik sambil makan", points: 40 },
    { question: "Satu kata yang paling cocok menggambarkan hubungan kita?", answer: "Rumah", points: 50 }
  ]},
  { name: "Siapa Paling...", icon: "☝", color: "#789fd0", questions: [
    { question: "Siapa yang paling mungkin ketiduran saat telepon?", answer: "Andra", points: 10 },
    { question: "Siapa yang paling sering mencuri makanan pasangan?", answer: "Dua-duanya", points: 20 },
    { question: "Siapa yang paling lama pilih makanan?", answer: "Angie", points: 30 },
    { question: "Siapa yang paling mungkin nyasar saat jalan bareng?", answer: "Andra", points: 40 },
    { question: "Siapa yang lebih dulu minta maaf setelah berantem?", answer: "Yang sudah nggak tahan kangen", points: 50 }
  ]},
  { name: "Favorit Kita", icon: "★", color: "#e3b94f", questions: [
    { question: "Pilihan date spontan favorit kita?", answer: "Random food hunting", points: 10 },
    { question: "Waktu favorit untuk ngobrol panjang?", answer: "Malam hari", points: 20 },
    { question: "Apa yang wajib ada saat road trip?", answer: "Playlist dan camilan", points: 30 },
    { question: "Jenis foto kita yang justru paling berkesan?", answer: "Foto candid yang blur", points: 40 },
    { question: "Date mana yang paling ingin kita ulang?", answer: "First proper date", points: 50 }
  ]},
  { name: "Memory Check", icon: "◷", color: "#9474b7", questions: [
    { question: "Apa benda yang paling banyak menyimpan memori kita?", answer: "Camera roll", points: 10 },
    { question: "Apa yang pernah mengubah salah jalan jadi memori bagus?", answer: "Road trip dadakan", points: 20 },
    { question: "Hal random apa yang layak masuk museum hubungan kita?", answer: "Screenshot tanpa konteks", points: 30 },
    { question: "Memori sederhana apa yang terasa paling hangat?", answer: "Comfort-food date", points: 40 },
    { question: "Apa detail kecil yang bikin seseorang merasa sangat dicintai?", answer: "Saat pasangannya mengingat cerita kecil", points: 50 }
  ]},
  { name: "Masa Depan", icon: "✦", color: "#6faa91", questions: [
    { question: "Hal kecil apa yang harus lebih sering kita lakukan?", answer: "Quality time tanpa distraksi", points: 10 },
    { question: "Destinasi sederhana untuk petualangan berikutnya?", answer: "Kota yang belum pernah dikunjungi", points: 20 },
    { question: "Tradisi tahunan apa yang seru untuk kita mulai?", answer: "Recreate foto atau first date", points: 30 },
    { question: "Apa yang harus selalu dibawa ke masa depan kita?", answer: "Humor dan komunikasi", points: 40 },
    { question: "Berapa banyak memori lagi yang mau kita buat?", answer: "Sebanyak mungkin", points: 50 }
  ]}
];

const whoSaidRounds = [
  { message: "mau makan apa? tapi jangan jawab terserah yaa", sender: "angie", time: "19:42", reaction: "🍜" },
  { message: "aku udah di depan, keluarnya santai ajaa", sender: "andra", time: "17:16", reaction: "🚗" },
  { message: "tadi aku liat sesuatu terus langsung keinget kamu", sender: "angie", time: "21:08", reaction: "🥺" },
  { message: "jangan lupa kabarin kalau udah sampai rumah ya", sender: "andra", time: "22:31", reaction: "♡" },
  { message: "aku nggak ngambek kok... cuma sedikit aja", sender: "angie", time: "20:05", reaction: "🙄" },
  { message: "besok aku jemput, kamu tinggal siap cantik aja", sender: "andra", time: "23:12", reaction: "🫡" },
  { message: "ini lucu banget tapi kayaknya cuma kita yang ngerti", sender: "angie", time: "14:27", reaction: "😭" },
  { message: "kalau capek cerita aja, aku dengerin", sender: "andra", time: "00:03", reaction: "🤍" },
  { message: "aku pengen jajan tapi nggak tau pengen apa", sender: "angie", time: "16:44", reaction: "🍟" },
  { message: "udah jangan overthinking, sini telepon aku", sender: "andra", time: "01:19", reaction: "📞" }
];

const telepathyPrompts = [
  { category: "Anak UI", hint: "Sebut satu hal yang langsung terlintas saat dengar ‘anak UI’." },
  { category: "Makanan Tengah Malam", hint: "Sebut satu makanan yang paling ingin dipesan tengah malam." },
  { category: "Tempat Date", hint: "Sebut satu tempat untuk date spontan malam ini." },
  { category: "Kalau Lagi Kangen", hint: "Sebut satu hal yang pertama kali ingin dilakukan." },
  { category: "Liburan Bareng", hint: "Sebut satu kota atau tempat yang ingin dikunjungi bersama." }
];

const drawingPrompts = [
  { prompt: "Draw our first date", seconds: 20, photo: "/assets/hero/photo-01.jpg" },
  { prompt: "Draw Andra in 10 seconds", seconds: 10, photo: "/assets/hero/photo-02.jpg" },
  { prompt: "Draw Angie when she is ngambek", seconds: 15, photo: "/assets/hero/photo-03.jpg" },
  { prompt: "Draw our dream road trip", seconds: 20, photo: "/assets/hero/photo-04.jpg" },
  { prompt: "Draw us fighting over food", seconds: 15, photo: "/assets/hero/photo-05.jpg" },
  { prompt: "Draw our most chaotic selfie", seconds: 15, photo: "/assets/hero/photo-06.jpg" },
  { prompt: "Draw Andra trying to be romantic", seconds: 10, photo: "/assets/hero/photo-07.jpg" },
  { prompt: "Draw us 10 years from now", seconds: 20, photo: "/assets/hero/photo-08.jpg" },
  { prompt: "Draw our perfect lazy Sunday", seconds: 20, photo: "/assets/hero/photo-09.jpg" },
  { prompt: "Draw the moment we laughed too hard", seconds: 15, photo: "/assets/hero/photo-10.jpg" }
];

const escapePuzzles = [
  { title:"The Beginning", password:"4273", reward:"A letter for my favorite person.", clues:[
    {icon:"📷",label:"Polaroid",text:"Our story got close in April.",hint:"Month number"},{icon:"📝",label:"Sticky Note",text:"It takes two people to make an us.",hint:"How many people?"},{icon:"📅",label:"Calendar",text:"July 17 is circled in red.",hint:"Use the last digit"},{icon:"💬",label:"Chat",text:"I typed ‘I miss you’ three times today.",hint:"How many times?"}]},
  { title:"Date Night", password:"8152", reward:"One unlimited spontaneous-date coupon.", clues:[
    {icon:"🕗",label:"Receipt",text:"Dinner was paid at 20:14.",hint:"Convert 20:00 to the 12-hour clock"},{icon:"🎟️",label:"Movie Ticket",text:"Cinema 1 · seats A5 and A6.",hint:"Cinema number"},{icon:"🍜",label:"Order Note",text:"One ramen for each of us.",hint:"Total bowls"},{icon:"♡",label:"Doodle",text:"There are two hearts, but use the number between 1 and 3.",hint:"The middle number"}]},
  { title:"Camera Roll", password:"6094", reward:"A secret photo marked ‘never delete’.", clues:[
    {icon:"📱",label:"Gallery",text:"The album says JUNE.",hint:"Month number"},{icon:"⭕",label:"Deleted Folder",text:"Nothing was deleted today.",hint:"How many deleted?"},{icon:"📸",label:"Burst Photo",text:"Nine nearly identical selfies.",hint:"Photo count"},{icon:"🗓️",label:"Timestamp",text:"APR · 11:48 PM.",hint:"Month number"}]},
  { title:"Road Trip", password:"7318", reward:"A playlist for our next wrong turn.", clues:[
    {icon:"🛣️",label:"Road Sign",text:"Exit 17 — only the final digit fits.",hint:"Last digit"},{icon:"🥤",label:"Cup Holder",text:"Three drinks somehow fit here.",hint:"Drink count"},{icon:"⛽",label:"Fuel Slip",text:"Pump number 1.",hint:"Pump number"},{icon:"🎵",label:"Playlist",text:"Eighteen songs downloaded offline.",hint:"Last digit"}]},
  { title:"The Future", password:"2510", reward:"The final file: more memories, coming soon.", clues:[
    {icon:"👫",label:"Guest List",text:"Just the two of us.",hint:"People count"},{icon:"✋",label:"Promise Note",text:"Five tiny promises for our future.",hint:"Promise count"},{icon:"💍",label:"Tiny Box",text:"One little circle with no ending.",hint:"Circle count"},{icon:"🔟",label:"Time Capsule",text:"Open this again in ten years.",hint:"Use the final digit"}]}
];

const psychicQuestions = [
  ["Stay in", "Go out"], ["Flowers", "Food"], ["Long drive", "Long call"],
  ["Fancy dinner", "Street food"], ["Beach", "Mountains"], ["Matching outfits", "Matching playlists"],
  ["Plan everything", "Be spontaneous"], ["Morning date", "Midnight date"],
  ["Fight one horse-sized duck", "Fight 100 duck-sized horses"],
  ["Read each other's mind", "Pause time together"],
  ["Only whisper forever", "Only sing forever"],
  ["Be stuck in traffic together", "Get lost together"]
] as const;

const archiveRounds = [
  { statements:["We have fought over food","We have taken a blurry favorite photo","We met for the first time on a boat"],lie:2,receipt:"No boats were involved in this love story.",photo:"/assets/hero/photo-01.jpg" },
  { statements:["We accidentally joined a marathon","We once got a little lost together","We have shared a playlist"],lie:0,receipt:"Wrong turns happened. A 42K run absolutely did not.",photo:"/assets/hero/photo-02.jpg" },
  { statements:["One of us has fallen asleep on call","We adopted a goat named Bambang","We have done random food hunting"],lie:1,receipt:"Many cute things happened. Bambang is not one of them.",photo:"/assets/hero/photo-03.jpg" },
  { statements:["Our first date was at an airport","A date almost got cancelled","We laughed until it hurt"],lie:0,receipt:"The date was real; the airport setting was fabricated.",photo:"/assets/hero/photo-04.jpg" },
  { statements:["Andra once waited much longer than planned","We won a karaoke competition","Angie has said she was not ngambek while ngambek"],lie:1,receipt:"There is still no karaoke trophy in the archive.",photo:"/assets/hero/photo-05.jpg" },
  { statements:["We never steal each other's food","We have a screenshot with zero context","A comfort-food date became a favorite"],lie:0,receipt:"The empty plate is evidence. Food theft is very real.",photo:"/assets/hero/photo-06.jpg" },
  { statements:["A tiny remembered detail made someone emotional","We both love waking up before sunrise","We have planned a future trip"],lie:1,receipt:"Romance is real. Shared enthusiasm for early alarms is not.",photo:"/assets/hero/photo-07.jpg" },
  { statements:["We have never taken an ugly candid","One ordinary evening became a core memory","We have recreated an old pose"],lie:0,receipt:"The camera roll strongly disagrees with statement one.",photo:"/assets/hero/photo-08.jpg" }
];

const photoFakeRounds = [
  { caption:"We took this photo right after a silly fight.",real:true,photo:"/assets/hero/photo-01.jpg",receipt:"Peace treaty accepted. The camera came out immediately after." },
  { caption:"We booked a helicopter just to get this photo.",real:false,photo:"",receipt:"This literally never happened. Budget said no." },
  { caption:"This was supposed to be a quick food stop, but became a full date.",real:true,photo:"/assets/hero/photo-03.jpg",receipt:"Real memory. ‘Quick food’ is never actually quick with us." },
  { caption:"We met a celebrity five seconds after taking this.",real:false,photo:"",receipt:"Made up. No celebrity receipt exists in the archive." },
  { caption:"One of us said ‘don't take a photo’ immediately before this photo.",real:true,photo:"/assets/hero/photo-05.jpg",receipt:"Real—and naturally, the photo was taken anyway." },
  { caption:"We took this after getting slightly lost on the way.",real:true,photo:"/assets/hero/photo-06.jpg",receipt:"Real memory. Wrong direction, correct company." },
  { caption:"This photo was taken during our secret wedding in Italy.",real:false,photo:"",receipt:"This literally never happened... yet?" },
  { caption:"We laughed at something nobody else would understand here.",real:true,photo:"/assets/hero/photo-08.jpg",receipt:"Real. The joke remains classified information." },
  { caption:"We won matching cars in a lucky draw that day.",real:false,photo:"",receipt:"Made up. We would definitely have posted the cars." },
  { caption:"This ordinary moment ended up becoming one of the favorites.",real:true,photo:"/assets/hero/photo-10.jpg",receipt:"Real memory. The best ones rarely announce themselves." }
];

const questionData: Record<string, string[]> = {
  "About Us": ["What was one moment that made us feel closer?","What do you remember most from our early days?","When did we start feeling like a real team?","What is one ordinary moment you want more of?"],
  "Funny Moments": ["What is our funniest random argument?","What photo of us should never be public?","What inside joke would sound ridiculous to anyone else?","When did one of us laugh at the worst time?"],
  "Deep Talk": ["What are you most grateful for in this relationship?","What should we do more often together?","What makes you feel safest with me?","What dream would you love for us to build?"],
  "Favorites": ["What food do we always end up craving?","What song reminds you of us?","Which date would you replay?","What is your favorite photo of us?"],
  "This or That": ["Fancy dinner or random food hunt?","Road trip or staycation?","Long call or long drive?","Matching outfits or matching playlists?"],
  "Who’s More Likely To": ["Who is more likely to fall asleep during a movie?","Who is more likely to say sorry first?","Who takes more candid photos?","Who would get us lost on a trip?"],
  "Memory Check": ["What did we eat on our first proper date?","What month holds our funniest memory?","What was our first shared favorite song?","Where did we take our favorite candid?"]
};

const STORE = "luthfiandra-game-players";

export function GamesPage() {
  const [players, setPlayers] = useState<Player[]>(defaultPlayers);
  const [activePlayerId, setActivePlayerId] = useState("angie");
  const [game, setGame] = useState<GameId | null>(null);
  const [pendingGame, setPendingGame] = useState<GameId | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(["angie", "andra"]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const activePlayer = players.find(p => p.id === activePlayerId) ?? players[0];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const parsed = JSON.parse(raw) as { players: Player[]; active: string };
        if (parsed.players?.length) { setPlayers(parsed.players); setActivePlayerId(parsed.active || parsed.players[0].id); }
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORE, JSON.stringify({ players, active: activePlayerId })); }, [players, activePlayerId, hydrated]);

  const addPlayer = (event: FormEvent) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const colors = ["#d69aba","#7eacd4","#e5bd59","#91b98d"];
    const p: Player = { id: `${Date.now()}`, name, avatar: ["⭐","🐻","🍒","🎮"][players.length % 4], color: colors[players.length % colors.length], points: 0, games: 0 };
    setPlayers(current => [...current,p]); setActivePlayerId(p.id); setNewName(""); setShowAdd(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f0e4] text-[#351522]">
      {pendingGame&&<GameSetup players={players} selected={selectedPlayers} setSelected={setSelectedPlayers} onClose={()=>setPendingGame(null)} onAdd={()=>setShowAdd(true)} onStart={()=>{if(selectedPlayers[0])setActivePlayerId(selectedPlayers[0]);setGame(pendingGame);setPendingGame(null)}}/>}
      <section className="arcade-hero relative border-b-4 border-[#591329] px-5 py-16 md:px-8">
        <div className="absolute left-[5%] top-16 hidden rotate-[-8deg] border-2 border-[#591329] bg-[#efbe55] px-5 py-3 font-mono text-[9px] font-black shadow-[5px_6px_0_#81a7d0] md:block">INSERT LOVE<br/>PRESS PLAY ♡</div>
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-mono text-[10px] font-black uppercase tracking-[.38em] text-[#c33d64]">eight games · unlimited rematches</p>
          <h1 className="mt-5 font-serif text-6xl font-black leading-[.85] sm:text-8xl">love arcade<span className="text-[#ca456c]">!</span></h1>
          <p className="mx-auto mt-6 max-w-lg font-mono text-xs leading-6">Pick your player, choose a game, and settle every very important relationship question.</p>

          <div className="mx-auto mt-10 max-w-3xl border-2 border-[#591329] bg-[#fffaf2] p-4 shadow-[7px_8px_0_#d989a2]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="mr-2 font-mono text-[9px] font-black uppercase tracking-widest">who&apos;s playing?</span>
              {players.map(p => <div key={p.id} className="flex items-center gap-2 rounded-full border-2 border-[#b797a1] bg-white px-3 py-2"><span className="h-3 w-3 rounded-full" style={{backgroundColor:p.color}}/><b className="font-mono text-[10px]">{p.name}</b><small className="font-mono text-[8px] text-[#866874]">{p.points} pts</small></div>)}
              <button type="button" onClick={()=>setShowAdd(true)} className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-[#7f5765] font-black">+</button>
            </div>
          </div>
        </div>
      </section>

      {game === null ? (
        <section className="arcade-floor relative px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-5"><div><p className="font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#c13c61]">game cabinet</p><h2 className="mt-2 font-serif text-4xl font-black">choose your game, {activePlayer.name}</h2></div><div className="hidden text-right font-mono text-[9px] uppercase sm:block"><b className="text-xl">{activePlayer.points}</b><br/>total points</div></div>
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {games.map((item,index)=><button key={item.id} type="button" onClick={()=>setPendingGame(item.id)} className={`game-cabinet group relative min-h-[310px] overflow-hidden border-2 border-[#491321] p-6 text-left shadow-[8px_9px_0_#263f61] transition hover:-translate-y-3 ${index===0?"lg:row-span-2 lg:min-h-full":""}`} style={{backgroundColor:item.color}}>
                <span className="absolute right-5 top-4 font-mono text-5xl font-black text-white/25">{item.number}</span><span className="grid h-20 w-20 place-items-center rounded-full border-2 border-[#491321] bg-[#fffaf2] text-5xl shadow-[4px_5px_0_rgba(73,19,33,.25)]">{item.icon}</span><p className="mt-8 font-mono text-[9px] font-black uppercase tracking-[.2em]">{item.tag}</p><h3 className="mt-2 font-serif text-4xl font-black leading-none">{item.title}</h3><p className="mt-4 max-w-xs font-mono text-[11px] leading-5">{item.description}</p><span className="mt-7 inline-block border-2 border-[#491321] bg-[#fffaf2] px-5 py-2.5 font-mono text-[10px] font-black shadow-[3px_4px_0_#491321] transition group-hover:translate-x-2">PLAY →</span>
              </button>)}
            </div>
          </div>
        </section>
      ) : (
        <section className="arcade-floor relative px-5 py-12 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex items-center justify-between"><button type="button" onClick={()=>setGame(null)} className="border-2 border-[#591329] bg-white px-4 py-2 font-mono text-[10px] font-black shadow-[3px_4px_0_#d98ba3]">← game menu</button><div className="font-mono text-[10px] font-black">{activePlayer.avatar} {activePlayer.name}&apos;s turn · {activePlayer.points} pts</div></div>
            {game==="bingo"&&<Family100 players={players.filter(p=>selectedPlayers.includes(p.id))}/>}
            {game==="memory"&&<WhoSaidThat players={players}/>}
            {game==="month"&&<TelepathyGame players={players.filter(p=>selectedPlayers.includes(p.id))}/>}
            {game==="cards"&&<DrawOurMemory/>}
            {game==="quiz"&&<PasswordEscape/>}
            {game==="psychic"&&<PsychicEdition players={players.filter(p=>selectedPlayers.includes(p.id))}/>}
            {game==="archive"&&<ArchiveEdition/>}
            {game==="fake"&&<PhotoOrFake/>}
          </div>
        </section>
      )}

      <footer className="border-t-4 border-[#591329] bg-[#591329] px-5 py-9 text-center text-white"><p className="font-serif text-2xl font-black italic">winner buys the snacks. ♡</p><Link href="/" className="mt-4 inline-block font-mono text-[9px] uppercase tracking-widest">← back home</Link></footer>

      {showAdd&&<div className="fixed inset-0 z-50 grid place-items-center bg-[#281019]/65 px-4 backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&setShowAdd(false)}><form onSubmit={addPlayer} className="gift-dialog relative w-full max-w-sm border-2 border-[#591329] bg-[#fffaf2] p-7 shadow-[8px_9px_0_#8eafd7]"><button type="button" onClick={()=>setShowAdd(false)} className="absolute right-3 top-2 text-2xl">×</button><p className="font-mono text-[9px] font-black uppercase tracking-widest text-[#c13e63]">new challenger</p><h2 className="mt-2 font-serif text-3xl font-black">add a player</h2><input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} placeholder="player name..." className="mt-5 w-full border-2 border-[#591329] bg-white px-4 py-3 font-mono text-xs outline-none"/><button className="mt-4 w-full bg-[#591329] px-4 py-3 font-mono text-xs font-black text-white">join the arcade →</button></form></div>}
    </main>
  );
}

function GameSetup({players,selected,setSelected,onClose,onAdd,onStart}:{players:Player[];selected:string[];setSelected:(value:string[])=>void;onClose:()=>void;onAdd:()=>void;onStart:()=>void}) { return <div className="fixed inset-0 z-50 grid place-items-center bg-[#281019]/70 px-4 backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="gift-dialog relative w-full max-w-lg border-2 border-[#591329] bg-[#fffaf2] p-7 shadow-[9px_10px_0_#8eafd7]"><button type="button" onClick={onClose} className="absolute right-4 top-3 text-2xl">×</button><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#dce8f7] text-[#31527e]"><Users className="h-7 w-7" strokeWidth={1.8}/></div><p className="mt-4 text-center font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#c13e63]">game setup</p><h2 className="mt-2 text-center font-serif text-3xl font-black">who&apos;s playing?</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{players.map(p=>{const chosen=selected.includes(p.id);return <button key={p.id} type="button" onClick={()=>setSelected(chosen?(selected.length>1?selected.filter(id=>id!==p.id):selected):[...selected,p.id])} className={`flex items-center justify-between border-2 p-4 text-left ${chosen?"border-[#591329] bg-[#f0c5d1]":"border-[#b99ca5] bg-white"}`}><span><b className="block font-serif text-lg">{p.name}</b><small className="font-mono text-[8px]">{p.points} pts</small></span><span>{chosen?"✓":""}</span></button>})}</div><div className="mt-5 flex gap-3"><button type="button" onClick={onStart} className="flex-1 bg-[#591329] px-5 py-3 font-mono text-xs font-black text-white">start with {selected.length} player{selected.length>1?"s":""} →</button><button type="button" onClick={onAdd} className="border-2 border-[#31527e] px-4 font-mono text-[9px] font-black">+ register</button></div></div></div> }

function GameFrame({eyebrow,title,children}:{eyebrow:string;title:string;children:React.ReactNode}) { return <div className="game-frame border-2 border-[#501326] bg-[#fffaf3] p-5 shadow-[9px_11px_0_#829fc3] sm:p-8"><header className="border-b-2 border-dashed border-[#c6a2ad] pb-5 text-center"><p className="font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#c03d62]">{eyebrow}</p><h2 className="mt-2 font-serif text-4xl font-black sm:text-5xl">{title}</h2></header><div className="mt-7">{children}</div></div> }

function Family100({players}:{players:Player[]}) {
  const contestants=players.length?players:defaultPlayers;
  const [turn,setTurn]=useState(0);
  const [scores,setScores]=useState<Record<string,number>>({});
  const [used,setUsed]=useState<string[]>([]);
  const [active,setActive]=useState<{category:number;question:number}|null>(null);
  const [revealed,setRevealed]=useState(false);
  const current=contestants[turn%contestants.length];
  const selected=active?familyCategories[active.category].questions[active.question]:null;
  const key=active?`${active.category}-${active.question}`:"";
  const finished=used.length===25;

  const openQuestion=(category:number,question:number)=>{const nextKey=`${category}-${question}`;if(used.includes(nextKey))return;setActive({category,question});setRevealed(false)};
  const reveal=()=>{if(!selected||revealed)return;setRevealed(true);setScores(old=>({...old,[current.id]:(old[current.id]??0)+selected.points}));setUsed(old=>[...old,key])};
  const continueGame=()=>{setActive(null);setRevealed(false);setTurn(value=>(value+1)%contestants.length)};
  const reset=()=>{setTurn(0);setScores({});setUsed([]);setActive(null);setRevealed(false)};

  return <GameFrame eyebrow="25 pertanyaan · 5 kategori · rebut poinnya" title="Family 100: Couple Edition">
    <div className="mx-auto max-w-5xl">
      <div className="mb-7 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap gap-2">{contestants.map((player,index)=><div key={player.id} className={`flex items-center gap-2 border-2 px-3 py-2 ${index===turn?"border-[#591329] bg-[#f2c3d0] shadow-[3px_4px_0_#789fd0]":"border-[#c6a5af] bg-white"}`}><span>{player.avatar}</span><span className="font-mono text-[9px] font-black uppercase">{player.name}<b className="ml-2 text-[#b52f58]">{scores[player.id]??0} pts</b></span></div>)}</div>
        <div className="self-center text-right font-mono text-[9px] font-black uppercase text-[#77515e]">giliran<br/><b className="text-sm text-[#351522]">{current.name}</b></div>
      </div>

      {finished?<Result icon="🏆" title={`${contestants.slice().sort((a,b)=>(scores[b.id]??0)-(scores[a.id]??0))[0].name} menang!`} text={`Semua kotak sudah dibuka. Skor tertinggi: ${Math.max(...contestants.map(p=>scores[p.id]??0))} poin.`} reset={reset}/>:<div className="overflow-x-auto pb-3"><div className="grid min-w-[720px] grid-cols-5 gap-2 rounded-sm border-4 border-[#351522] bg-[#351522] p-2 shadow-[8px_9px_0_#789fd0]">
        {familyCategories.map(category=><div key={category.name} className="grid min-h-24 place-items-center border-2 border-white/70 p-2 text-center text-white" style={{backgroundColor:category.color}}><span className="text-2xl">{category.icon}</span><b className="font-mono text-[10px] uppercase leading-tight tracking-wider">{category.name}</b></div>)}
        {[0,1,2,3,4].flatMap(question=>familyCategories.map((category,categoryIndex)=>{const tileKey=`${categoryIndex}-${question}`;const done=used.includes(tileKey);return <button key={tileKey} type="button" disabled={done} onClick={()=>openQuestion(categoryIndex,question)} className={`family-tile grid min-h-20 place-items-center border-2 font-mono text-2xl font-black transition ${done?"border-[#694657] bg-[#24101a] text-[#745565]":"border-[#f3c35b] bg-[#fff7df] text-[#9e284e] hover:-translate-y-1 hover:bg-[#f3c35b] hover:text-[#351522]"}`}>{done?"✓":category.questions[question].points}</button>}))}
      </div></div>}

      {active&&selected&&<div className="family-overlay fixed inset-0 z-[60] grid place-items-center bg-[#210b14]/80 px-4 backdrop-blur-sm" onMouseDown={event=>{if(event.target===event.currentTarget&&revealed)continueGame()}}><div className="family-question relative w-full max-w-2xl overflow-hidden border-4 border-[#f2c258] bg-[#fff9ed] p-6 text-center shadow-[10px_12px_0_#789fd0] sm:p-10">
        <div className="absolute left-0 top-0 h-2 w-full" style={{backgroundColor:familyCategories[active.category].color}}/>
        <p className="font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#b6385d]">{familyCategories[active.category].icon} {familyCategories[active.category].name} · {selected.points} poin</p>
        <p className="mt-3 font-mono text-[9px] uppercase text-[#80636d]">pertanyaan untuk {current.name}</p>
        <h3 className="mx-auto mt-7 max-w-xl font-serif text-3xl font-black leading-tight sm:text-4xl">{selected.question}</h3>
        {!revealed?<button type="button" onClick={reveal} className="mt-9 bg-[#591329] px-8 py-4 font-mono text-xs font-black uppercase text-white shadow-[5px_6px_0_#e194ab]">buka jawaban +{selected.points}</button>:<div className="confetti-pop mt-8"><p className="font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#31527e]">survey says...</p><div className="mt-3 border-4 border-[#351522] bg-[#f2c258] px-5 py-5 font-serif text-3xl font-black shadow-[5px_6px_0_#d95f83]">{selected.answer}</div><p className="mt-4 font-mono text-xs font-black text-[#b52f58]">+{selected.points} poin untuk {current.name}!</p><button type="button" onClick={continueGame} className="mt-6 bg-[#31527e] px-7 py-3 font-mono text-xs font-black text-white">lanjut ke pemain berikutnya →</button></div>}
      </div></div>}
    </div>
  </GameFrame>
}

function WhoSaidThat({players}:{players:Player[]}) {
  const contestants=defaultPlayers.map(fallback=>players.find(player=>player.id===fallback.id)??fallback);
  const [round,setRound]=useState(0);
  const [picked,setPicked]=useState<string|null>(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const item=whoSaidRounds[round];
  const sender=contestants.find(player=>player.id===item.sender)??defaultPlayers.find(player=>player.id===item.sender)!;

  const choose=(id:string)=>{if(picked)return;setPicked(id);if(id===item.sender)setScore(value=>value+1)};
  const next=()=>{if(round===whoSaidRounds.length-1){setDone(true);return}setRound(value=>value+1);setPicked(null)};
  const reset=()=>{setRound(0);setPicked(null);setScore(0);setDone(false)};
  const finalScore=score;

  return <GameFrame eyebrow={`chat ${round+1} dari ${whoSaidRounds.length} · ${score} benar`} title="Who Said That?">
    {done?<Result icon={finalScore===10?"🏆":"💬"} title={`${finalScore}/10 tebakan benar`} text={finalScore===10?"Gawat, isi chat sudah hafal di luar kepala. Certified chat detective!":finalScore>=6?"Lumayan kenal gaya chat satu sama lain. Sedikit lagi jadi detektif chat.":"Kayaknya harus scroll chat lama bareng-bareng, nih."} reset={reset}/>:<div className="mx-auto max-w-2xl">
      <div className="mb-7 flex items-center justify-between font-mono text-[9px] font-black uppercase tracking-wider text-[#795763]"><span>round {String(round+1).padStart(2,"0")}</span><span>{Math.round((round/whoSaidRounds.length)*100)}% complete</span></div>
      <div className="h-2 overflow-hidden rounded-full border border-[#591329] bg-white"><div className="h-full bg-[#d65379] transition-all duration-500" style={{width:`${((round+1)/whoSaidRounds.length)*100}%`}}/></div>

      <div className="relative mx-auto mt-10 min-h-[320px] overflow-hidden rounded-[28px] border-4 border-[#351522] bg-[#e8f0ea] p-5 shadow-[9px_11px_0_#d989a2] sm:p-8">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(#789fd0 1px, transparent 1px)",backgroundSize:"18px 18px"}}/>
        <div className="relative flex items-center gap-3 border-b-2 border-[#b4c4bb] pb-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#591329] text-white">♡</div><div><b className="block font-serif text-lg">mystery sender</b><span className="font-mono text-[8px] uppercase text-[#67806f]">online · typing style detected</span></div><span className="ml-auto text-xl">•••</span></div>
        <div className="relative mt-12 flex items-end gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[#351522] bg-[#f2c258] text-lg">?</div>
          <div className="who-chat-bubble relative max-w-[82%] rounded-[5px_22px_22px_22px] border-2 border-[#351522] bg-white px-5 py-4 shadow-[4px_5px_0_#789fd0]">
            <p className="font-serif text-xl font-bold leading-snug sm:text-2xl">“{item.message}”</p>
            <div className="mt-3 flex items-center justify-end gap-2 font-mono text-[8px] text-[#806872]"><span>{item.reaction}</span><span>{item.time}</span><span className="text-[#4f86c6]">✓✓</span></div>
          </div>
        </div>
        <p className="relative mt-10 text-center font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#654852]">siapa yang mengirim chat ini?</p>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4">{contestants.slice(0,2).map(player=>{const correct=player.id===item.sender;const chosen=player.id===picked;return <button key={player.id} type="button" disabled={!!picked} onClick={()=>choose(player.id)} className={`relative overflow-hidden border-2 p-4 text-left transition ${picked?(correct?"border-[#276848] bg-[#88c7a4] shadow-[5px_6px_0_#276848]":chosen?"border-[#9d294b] bg-[#e78ca7]":"border-[#bba5ac] bg-white opacity-45"):"border-[#591329] bg-white shadow-[5px_6px_0_#c8849a] hover:-translate-y-1"}`}><span className="text-2xl">{player.avatar}</span><b className="ml-2 font-serif text-xl">{player.name}</b>{picked&&correct&&<span className="absolute right-3 top-3 font-mono text-[9px] font-black uppercase">correct ✓</span>}{picked&&chosen&&!correct&&<span className="absolute right-3 top-3 font-mono text-[9px] font-black uppercase">not this one ×</span>}</button>})}</div>

      {picked&&<div className="confetti-pop mt-7 border-2 border-[#591329] bg-[#fff7e8] p-5 text-center"><p className="font-serif text-2xl font-black">{picked===item.sender?"Betul! ♡":"Oops, bukan dia!"}</p><p className="mt-2 font-mono text-[10px]">Chat ini dikirim oleh <b>{sender.name}</b>.</p><button type="button" onClick={next} className="mt-5 bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white">{round===whoSaidRounds.length-1?"lihat hasil":"chat berikutnya →"}</button></div>}
    </div>}
  </GameFrame>
}

function TelepathyGame({players}:{players:Player[]}) {
  const chosen=players.slice(0,2);const contestants=chosen.length>=2?chosen:[chosen[0]??defaultPlayers[0],defaultPlayers.find(p=>p.id!==(chosen[0]?.id??"angie"))??defaultPlayers[1]];
  const [round,setRound]=useState(0);const [stage,setStage]=useState<0|1|2>(0);const [draft,setDraft]=useState("");const [words,setWords]=useState<[string,string]>(["",""]);const [attempts,setAttempts]=useState(1);const [total,setTotal]=useState(0);const [done,setDone]=useState(false);const prompt=telepathyPrompts[round];const normalize=(x:string)=>x.trim().toLowerCase().replace(/\s+/g," ");const match=stage===2&&normalize(words[0])===normalize(words[1]);const player=contestants[stage===0?0:1];
  const lock=()=>{const word=draft.trim();if(!word)return;if(stage===0){setWords([word,""]);setStage(1)}else{setWords(old=>[old[0],word]);setStage(2)}setDraft("")};
  const retry=()=>{setStage(0);setWords(["",""]);setAttempts(x=>x+1)};
  const next=()=>{setTotal(x=>x+attempts);if(round===telepathyPrompts.length-1){setDone(true);return}setRound(x=>x+1);setStage(0);setWords(["",""]);setAttempts(1)};
  const reset=()=>{setRound(0);setStage(0);setDraft("");setWords(["",""]);setAttempts(1);setTotal(0);setDone(false)};
  return <GameFrame eyebrow={`mind match ${round+1} / 5 · percobaan ${attempts}`} title="Telepathy Test">{done?<Result icon="🧠" title="Pikiran kalian nyambung!" text={`Semua kategori berhasil disamakan dalam ${total} percobaan. Makin sedikit, makin kuat telepatinya!`} reset={reset}/>:<div className="mx-auto max-w-3xl">
    <div className="grid grid-cols-5 gap-3">{telepathyPrompts.map((x,i)=><i key={x.category} className={`h-2 rounded-full border border-[#591329] ${i<round||i===round&&match?"bg-[#d65379]":i===round?"bg-[#f2c258]":"bg-white"}`}/>)}</div>
    <div className="relative mt-8 overflow-hidden border-2 border-[#591329] bg-[#fff8e9] p-8 text-center shadow-[8px_9px_0_#789fd0]"><span className="absolute -right-3 -top-6 text-8xl text-[#efc65c]/30">⚡</span><p className="relative font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#bd3b61]">kategori</p><h3 className="relative mt-3 font-serif text-4xl font-black sm:text-5xl">{prompt.category}</h3><p className="relative mx-auto mt-4 max-w-lg font-mono text-[10px] leading-5">{prompt.hint}</p></div>
    {stage<2?<div className="mt-8 border-2 border-[#591329] bg-white p-6 shadow-[5px_6px_0_#d98ba3]"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#591329] text-xl" style={{backgroundColor:player.color}}>{player.avatar}</span><div><p className="font-serif text-xl font-black">Giliran {player.name}</p><p className="font-mono text-[8px] uppercase">{stage===0?"pemain kedua jangan mengintip":"jawaban pertama sudah dikunci"}</p></div></div><div className="mt-5 flex gap-3"><input autoFocus type="password" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&lock()} placeholder="ketik satu kata..." className="min-w-0 flex-1 border-2 border-[#591329] bg-[#fffaf3] px-4 py-3 font-mono text-xs outline-none"/><button onClick={lock} disabled={!draft.trim()} className="bg-[#591329] px-5 font-mono text-[10px] font-black text-white disabled:opacity-35">KUNCI 🔒</button></div></div>:<div className="confetti-pop mt-8"><p className="text-center font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#31527e]">jawaban dibuka!</p><div className="mt-4 grid grid-cols-2 gap-4">{contestants.map((p,i)=><div key={p.id} className={`border-2 p-5 text-center shadow-[4px_5px_0_#789fd0] ${match?"bg-[#9dd1b4]":"bg-white"}`}><span className="text-2xl">{p.avatar}</span><p className="font-mono text-[8px] font-black uppercase">{p.name}</p><p className="mt-3 break-words font-serif text-2xl font-black">{words[i]}</p></div>)}</div><div className={`mt-5 border-2 p-5 text-center ${match?"bg-[#d9f0e2]":"bg-[#f6d4de]"}`}><p className="font-serif text-3xl font-black">{match?"MATCH! Pikiran kalian sama ♡":"Belum sama..."}</p><p className="mt-2 font-mono text-[9px]">{match?`Berhasil dalam ${attempts} percobaan.`:"Coba lagi sampai jawaban kalian sama."}</p><button onClick={match?next:retry} className={`mt-5 px-7 py-3 font-mono text-xs font-black text-white ${match?"bg-[#276848]":"bg-[#9d294b]"}`}>{match?(round===4?"lihat hasil":"kategori berikutnya →"):"coba lagi ↻"}</button></div></div>}
  </div>}</GameFrame>
}

function ArchiveEdition() {
  const [round,setRound]=useState(0);const [picked,setPicked]=useState<number|null>(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);const item=archiveRounds[round];const correct=picked===item.lie;
  const choose=(index:number)=>{if(picked!==null)return;setPicked(index);if(index===item.lie)setScore(value=>value+1)};
  const next=()=>{if(round===archiveRounds.length-1){setDone(true);return}setRound(value=>value+1);setPicked(null)};
  const reset=()=>{setRound(0);setPicked(null);setScore(0);setDone(false)};
  const difficulty=round<3?"easy archive":round<6?"deep cut":"expert-only detail";
  return <GameFrame eyebrow={`case file ${round+1}/${archiveRounds.length} · ${difficulty}`} title="Two Truths & A Lie">{done?<Result icon="🕵️" title={`${score}/${archiveRounds.length} lies caught`} text={score>=7?"Archive detective certified. Hampir tidak ada cerita palsu yang bisa lolos.":score>=4?"Not bad—setengah lebih kebohongan berhasil dibongkar.":"The archive fooled you. Time to revisit the lore together."} reset={reset}/>:<div className="mx-auto max-w-3xl"><div className="mb-7 flex gap-2">{archiveRounds.map((_,index)=><span key={index} className={`h-2 flex-1 rounded-full border border-[#591329] ${index<round?"bg-[#73a58f]":index===round?"bg-[#efc65c]":"bg-white"}`}/>)}</div><div className="border-2 border-[#591329] bg-[#e7e0cd] p-5 shadow-[8px_9px_0_#73a58f] sm:p-8"><div className="mb-5 flex items-center justify-between"><p className="font-mono text-[9px] font-black uppercase tracking-[.25em]">confidential · relationship archive</p><span className="rotate-[-5deg] border-2 border-[#b53659] px-2 py-1 font-mono text-[8px] font-black text-[#b53659]">ONE IS FALSE</span></div><div className="grid gap-3">{item.statements.map((statement,index)=><button key={statement} disabled={picked!==null} onClick={()=>choose(index)} className={`flex min-h-20 items-center gap-4 border-2 p-4 text-left transition ${picked!==null?(index===item.lie?"border-[#9d294b] bg-[#e99bb2] shadow-[4px_5px_0_#9d294b]":index===picked?"border-[#826e2c] bg-[#eadb92]":"border-[#91a99b] bg-[#c9e3d4] opacity-65"):`border-[#591329] bg-[#fffaf3] hover:translate-x-2`}`}><span className="font-mono text-2xl font-black text-[#31527e]">{String.fromCharCode(65+index)}</span><span className="font-serif text-lg font-black sm:text-xl">{statement}</span></button>)}</div></div>{picked!==null&&<div className="confetti-pop mt-6 overflow-hidden border-2 border-[#591329] bg-white shadow-[6px_7px_0_#d98ba3]"><div className="grid sm:grid-cols-[190px_1fr]"><div className="aspect-square overflow-hidden bg-[#e4d7c8] sm:aspect-auto"><img src={item.photo} alt="Archive receipt" className="h-full w-full object-cover"/></div><div className="p-5"><p className="font-mono text-[8px] font-black uppercase tracking-[.25em] text-[#b53659]">receipt found</p><h3 className="mt-2 font-serif text-3xl font-black">{correct?"Lie caught!":"The archive fooled you."}</h3><p className="mt-3 font-mono text-[10px] leading-5">{item.receipt}</p><button onClick={next} className="mt-5 bg-[#591329] px-6 py-3 font-mono text-[10px] font-black text-white">{round===archiveRounds.length-1?"close the case":"next case file →"}</button></div></div></div>}</div>}</GameFrame>
}

function PhotoOrFake() {
  const [round,setRound]=useState(0);const [picked,setPicked]=useState<boolean|null>(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);const item=photoFakeRounds[round];const correct=picked===item.real;
  const choose=(answer:boolean)=>{if(picked!==null)return;setPicked(answer);if(answer===item.real)setScore(value=>value+1)};
  const next=()=>{if(round===photoFakeRounds.length-1){setDone(true);return}setRound(value=>value+1);setPicked(null)};
  const reset=()=>{setRound(0);setPicked(null);setScore(0);setDone(false)};
  return <GameFrame eyebrow={`memory check ${round+1}/${photoFakeRounds.length} · ${score} correct`} title="Photo or Fake?">{done?<Result icon="📸" title={`${score}/${photoFakeRounds.length} memories verified`} text={score>=9?"Human camera roll. You can separate lore from fan fiction instantly.":score>=5?"Most memories survived the fact-check.":"Too many fake memories entered the timeline. Rematch required."} reset={reset}/>:<div className="mx-auto max-w-3xl"><div className="relative overflow-hidden border-4 border-[#351522] bg-[#222a38] px-6 py-14 text-center text-white shadow-[9px_10px_0_#dd9a59] sm:px-10"><span className="absolute left-5 top-4 font-mono text-[8px] font-black uppercase tracking-[.25em] text-white/45">unverified caption #{String(round+1).padStart(2,"0")}</span><span className="absolute -bottom-8 -right-4 text-9xl opacity-10">📸</span><p className="relative font-serif text-3xl font-black italic leading-tight sm:text-4xl">“{item.caption}”</p><p className="relative mt-5 font-mono text-[9px] uppercase tracking-[.2em] text-[#f0c1ce]">did this actually happen?</p></div>{picked===null?<div className="mt-7 grid grid-cols-2 gap-4"><button onClick={()=>choose(true)} className="min-h-24 border-2 border-[#276848] bg-[#b7ddc7] font-mono text-sm font-black shadow-[5px_6px_0_#276848] transition hover:-translate-y-1">✓ REAL MEMORY</button><button onClick={()=>choose(false)} className="min-h-24 border-2 border-[#9d294b] bg-[#efb8c8] font-mono text-sm font-black shadow-[5px_6px_0_#9d294b] transition hover:-translate-y-1">✕ MADE UP</button></div>:<div className="confetti-pop mt-7"><div className={`border-2 p-5 text-center ${correct?"border-[#276848] bg-[#d9f0e2]":"border-[#9d294b] bg-[#f6d4de]"}`}><p className="font-serif text-3xl font-black">{correct?"Correct! Receipt verified.":"Plot twist—wrong answer."}</p></div>{item.real?<div className="mx-auto mt-5 max-w-xl rotate-[-1deg] border-[12px] border-b-[48px] border-white bg-[#e4d7c8] shadow-[8px_9px_0_#789fd0]"><img src={item.photo} alt="The real memory" className="aspect-[4/3] w-full object-cover"/><p className="absolute bottom-[-34px] font-mono text-[8px] font-black uppercase">real memory · archive receipt</p></div>:<div className="mt-5 border-4 border-dashed border-[#9d294b] bg-white px-6 py-12 text-center shadow-[7px_8px_0_#dd9a59]"><span className="text-6xl">🚫</span><p className="mt-4 font-serif text-3xl font-black italic">THIS LITERALLY NEVER HAPPENED.</p></div>}<p className="mx-auto mt-6 max-w-lg text-center font-mono text-[10px] leading-5">{item.receipt}</p><button onClick={next} className="mx-auto mt-5 block bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white">{round===photoFakeRounds.length-1?"see fact-check score":"next suspicious caption →"}</button></div>}</div>}</GameFrame>
}

function PsychicEdition({players}:{players:Player[]}) {
  const chosen=players.slice(0,2);const pair=chosen.length>=2?chosen:[chosen[0]??defaultPlayers[0],defaultPlayers.find(player=>player.id!==(chosen[0]?.id??"angie"))??defaultPlayers[1]];
  const [round,setRound]=useState(0);const [stage,setStage]=useState<"choose"|"handoff"|"predict"|"reveal"|"done">("choose");const [secret,setSecret]=useState<number|null>(null);const [prediction,setPrediction]=useState<number|null>(null);const [score,setScore]=useState(0);const [results,setResults]=useState<boolean[]>([]);
  const answerer=pair[round%2];const predictor=pair[(round+1)%2];const choices=psychicQuestions[round];const matched=secret!==null&&prediction===secret;
  const choose=(index:number)=>{setSecret(index);setStage("handoff")};
  const predict=(index:number)=>{setPrediction(index);const correct=index===secret;setResults(old=>[...old,correct]);if(correct)setScore(value=>value+1);setStage("reveal")};
  const next=()=>{if(round===psychicQuestions.length-1){setStage("done");return}setRound(value=>value+1);setSecret(null);setPrediction(null);setStage("choose")};
  const reset=()=>{setRound(0);setStage("choose");setSecret(null);setPrediction(null);setScore(0);setResults([])};
  if(stage==="done")return <GameFrame eyebrow="psychic reading complete" title="This or That: Psychic Edition"><Result icon={score>=9?"🔮":"♡"} title={`${score}/${psychicQuestions.length} predictions matched`} text={score>=10?"Kalian jelas punya shared brain cell. Agak menyeramkan, tapi romantis.":score>=6?"Psychic connection lumayan kuat—lebih dari setengah pikiran berhasil dibaca.":"Telepati sedang maintenance. Untung masih bisa ngobrol langsung."} reset={reset}/></GameFrame>;
  return <GameFrame eyebrow={`prediction ${round+1}/${psychicQuestions.length} · ${score} matched`} title="This or That: Psychic Edition"><div className="mx-auto max-w-3xl"><div className="mb-7 flex gap-1.5">{psychicQuestions.map((_,index)=><span key={index} className={`h-2 flex-1 rounded-full border border-[#591329] ${index<results.length?(results[index]?"bg-[#6faa91]":"bg-[#d95f83]"):index===round?"bg-[#f2c258]":"bg-white"}`}/>)}</div>
    {stage==="handoff"?<div className="gift-dialog border-2 border-[#591329] bg-[#2e1838] px-6 py-16 text-center text-white shadow-[9px_10px_0_#9277bd]"><span className="text-7xl">🙈</span><p className="mt-5 font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#e5b8d7]">answer locked · no peeking</p><h3 className="mt-3 font-serif text-4xl font-black">Pass the screen to {predictor.name}</h3><p className="mx-auto mt-4 max-w-md font-mono text-[10px] leading-5 text-white/70">{answerer.name}&apos;s choice is hidden. Your job is to predict it—not choose your own favorite.</p><button onClick={()=>setStage("predict")} className="mt-7 bg-[#f2c258] px-7 py-3 font-mono text-xs font-black text-[#351522]">I&apos;M {predictor.name.toUpperCase()} — READY</button></div>:<div><div className="relative overflow-hidden border-2 border-[#591329] bg-[#fff8e9] p-6 text-center shadow-[8px_9px_0_#9277bd] sm:p-9"><span className="absolute -right-5 -top-8 text-9xl text-[#9277bd]/20">🔮</span><p className="relative font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#a33a76]">{stage==="choose"?`${answerer.name}, choose your real answer in secret`:`${predictor.name}, what did ${answerer.name} choose?`}</p><h3 className="relative mt-5 font-serif text-3xl font-black sm:text-4xl">Which one?</h3><div className="relative mt-8 grid grid-cols-2 gap-4">{choices.map((choice,index)=><button key={choice} onClick={()=>stage==="choose"?choose(index):stage==="predict"?predict(index):undefined} disabled={stage==="reveal"} className={`min-h-32 border-2 p-4 font-serif text-xl font-black transition sm:text-2xl ${stage==="reveal"?(index===secret?"border-[#276848] bg-[#98ceb0] shadow-[5px_6px_0_#276848]":index===prediction?"border-[#9d294b] bg-[#e99bb2]":"border-[#baa3ab] bg-white opacity-45"):`border-[#591329] bg-white shadow-[5px_6px_0_#d98ba3] hover:-translate-y-1`}`}>{choice}{stage==="reveal"&&index===secret&&<span className="mt-2 block font-mono text-[8px] uppercase">{answerer.name}&apos;s answer ✓</span>}{stage==="reveal"&&index===prediction&&index!==secret&&<span className="mt-2 block font-mono text-[8px] uppercase">your prediction</span>}</button>)}</div></div>{stage==="reveal"&&<div className="confetti-pop mt-6 border-2 border-[#591329] bg-white p-5 text-center"><p className="font-serif text-3xl font-black">{matched?"MIND MATCH! +1 🔮":"Not this time!"}</p><p className="mt-2 font-mono text-[9px]">{matched?`${predictor.name} successfully read ${answerer.name}'s mind.`:`${answerer.name} chose “${choices[secret??0]}”.`}</p><button onClick={next} className="mt-5 bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white">{round===psychicQuestions.length-1?"see psychic score":"swap roles & continue →"}</button></div>}</div>}
  </div></GameFrame>
}

function DrawOurMemory() {
  const canvasRef=useRef<HTMLCanvasElement>(null);const drawing=useRef(false);const [round,setRound]=useState(0);const [phase,setPhase]=useState<"ready"|"drawing"|"reveal">("ready");const [time,setTime]=useState(drawingPrompts[0].seconds);const [color,setColor]=useState("#351522");const [brush,setBrush]=useState(7);const item=drawingPrompts[round];
  const blank=()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;ctx.fillStyle="#fffaf3";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.lineCap="round";ctx.lineJoin="round"};
  useEffect(()=>{blank()},[]);
  useEffect(()=>{if(phase!=="drawing")return;if(time<=0){setPhase("reveal");return}const timer=window.setTimeout(()=>setTime(value=>value-1),1000);return()=>window.clearTimeout(timer)},[phase,time]);
  const point=(event:React.PointerEvent<HTMLCanvasElement>)=>{const canvas=event.currentTarget;const box=canvas.getBoundingClientRect();return{x:(event.clientX-box.left)*(canvas.width/box.width),y:(event.clientY-box.top)*(canvas.height/box.height)}};
  const startLine=(event:React.PointerEvent<HTMLCanvasElement>)=>{if(phase!=="drawing")return;drawing.current=true;event.currentTarget.setPointerCapture(event.pointerId);const ctx=event.currentTarget.getContext("2d");const p=point(event);ctx?.beginPath();ctx?.moveTo(p.x,p.y)};
  const draw=(event:React.PointerEvent<HTMLCanvasElement>)=>{if(!drawing.current||phase!=="drawing")return;const ctx=event.currentTarget.getContext("2d");if(!ctx)return;const p=point(event);ctx.strokeStyle=color;ctx.lineWidth=brush;ctx.lineTo(p.x,p.y);ctx.stroke()};
  const stop=()=>{drawing.current=false};
  const start=()=>{blank();setTime(item.seconds);setPhase("drawing")};
  const next=()=>{const nextRound=(round+1)%drawingPrompts.length;setRound(nextRound);setTime(drawingPrompts[nextRound].seconds);setPhase("ready");window.setTimeout(blank,0)};
  return <GameFrame eyebrow={`memory ${round+1} / ${drawingPrompts.length} · ${phase==="drawing"?`${time}s left`:"draw first, reveal later"}`} title="Draw Our Memory"><div className="mx-auto max-w-5xl">
    <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-[#591329] bg-[#f2c3d0] p-4"><div><p className="font-mono text-[8px] font-black uppercase tracking-[.2em]">your ridiculous mission</p><h3 className="mt-1 font-serif text-2xl font-black sm:text-3xl">{item.prompt}</h3></div><div className={`grid h-16 w-16 place-items-center rounded-full border-4 border-[#591329] bg-white font-mono text-2xl font-black ${phase==="drawing"&&time<=5?"text-[#d52f59]":"text-[#31527e]"}`}>{phase==="ready"?item.seconds:time}</div></div>
    {phase!=="reveal"?<div className="mt-6"><div className="mb-3 flex flex-wrap items-center gap-2"><span className="mr-2 font-mono text-[8px] font-black uppercase">marker</span>{["#351522","#d33f67","#31527e","#e5ad25","#41916c"].map(value=><button key={value} onClick={()=>setColor(value)} aria-label={`Use ${value}`} className={`h-8 w-8 rounded-full border-2 border-[#351522] ${color===value?"ring-4 ring-[#d98ba3]":""}`} style={{backgroundColor:value}}/>)}<button onClick={()=>setColor("#fffaf3")} className="ml-2 border-2 border-[#591329] bg-white px-3 py-2 font-mono text-[8px] font-black">ERASER</button><select value={brush} onChange={event=>setBrush(Number(event.target.value))} className="border-2 border-[#591329] bg-white p-2 font-mono text-[8px] font-black"><option value="4">thin</option><option value="7">normal</option><option value="14">chaos</option></select><button onClick={blank} className="ml-auto border-b border-[#591329] font-mono text-[8px] font-black uppercase">clear all</button></div><canvas ref={canvasRef} width={800} height={520} onPointerDown={startLine} onPointerMove={draw} onPointerUp={stop} onPointerCancel={stop} className={`aspect-[20/13] w-full touch-none border-4 border-[#351522] bg-[#fffaf3] shadow-[8px_9px_0_#789fd0] ${phase!=="drawing"?"pointer-events-none opacity-70":"cursor-crosshair"}`}/>{phase==="ready"?<button onClick={start} className="mx-auto mt-6 block bg-[#591329] px-8 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#d98ba3]">START {item.seconds} SECONDS →</button>:<button onClick={()=>setPhase("reveal")} className="mx-auto mt-6 block bg-[#31527e] px-7 py-3 font-mono text-xs font-black text-white">I&apos;M DONE! REVEAL IT</button>}</div>:<div className="confetti-pop mt-7"><div className="grid gap-6 md:grid-cols-2"><div><p className="mb-3 text-center font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#b4355a]">YOUR DRAWING</p><div className="overflow-hidden border-[10px] border-white shadow-[7px_8px_0_#789fd0]"><canvas width={800} height={520} ref={node=>{if(!node||!canvasRef.current)return;const ctx=node.getContext("2d");ctx?.drawImage(canvasRef.current,0,0)}} className="aspect-[20/13] w-full bg-[#fffaf3]"/></div></div><div><p className="mb-3 text-center font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#31527e]">WHAT ACTUALLY HAPPENED</p><div className="aspect-[20/13] overflow-hidden border-[10px] border-white bg-[#e8d8c9] shadow-[7px_8px_0_#d98ba3]"><img src={item.photo} alt="The real memory" className="h-full w-full object-cover"/></div></div></div><p className="mt-7 text-center font-serif text-3xl font-black italic">Close enough... probably. ♡</p><button onClick={next} className="mx-auto mt-5 block bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white">{round===drawingPrompts.length-1?"draw again from the start ↻":"next chaotic memory →"}</button></div>}
  </div></GameFrame>
}

/* Retired game implementations kept out of the client bundle.
function MemoryGenerator() {
  const [current,setCurrent]=useState<number|null>(null); const [shuffle,setShuffle]=useState(false);
  const generate=()=>{setShuffle(true);setTimeout(()=>{let next=Math.floor(Math.random()*memoryData.length);if(next===current)next=(next+1)%memoryData.length;setCurrent(next);setShuffle(false)},450)};
  return <GameFrame eyebrow="pull the lever of nostalgia" title="Memory Roulette">{current===null?<div className="py-16 text-center"><div className="mx-auto grid h-40 w-40 place-items-center rounded-full border-4 border-[#591329] bg-[#8eafd7] text-7xl shadow-[8px_9px_0_#db839f]">✦</div><button type="button" onClick={generate} className="mt-9 bg-[#591329] px-9 py-4 font-mono text-xs font-black text-white shadow-[5px_6px_0_#e3a0b4]">SURPRISE ME!</button></div>:<div className={`mx-auto max-w-xl ${shuffle?"card-shuffle":""}`}><div className="rotate-[-1deg] border-[12px] border-b-[54px] border-white p-6 text-center shadow-[8px_9px_0_#91afd3]" style={{backgroundColor:memoryData[current].color}}><span className="text-8xl">{memoryData[current].icon}</span><p className="mt-5 font-mono text-[9px] font-black uppercase tracking-widest">photo / video placeholder</p></div><div className="mt-7 text-center"><p className="font-mono text-[9px] font-black uppercase tracking-widest text-[#c33e63]">{memoryData[current].date}</p><h3 className="mt-2 font-serif text-3xl font-black">{memoryData[current].title}</h3><p className="mt-3 font-mono text-xs leading-6">{memoryData[current].text}</p><button type="button" onClick={generate} className="mt-6 bg-[#31527e] px-7 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#e397ae]">generate again ↻</button></div></div>}</GameFrame>
}

function PhotoMemoryGuess() {
  const [photos,setPhotos]=useState<{id:string;src:string;answer:string}[]>([]);const [answer,setAnswer]=useState("");const [round,setRound]=useState<number|null>(null);const [picked,setPicked]=useState<string|null>(null);
  const add=(file:File|null)=>{if(!file||!answer.trim())return;const reader=new FileReader();reader.onload=()=>{setPhotos(old=>[...old,{id:String(Date.now()),src:String(reader.result),answer:answer.trim()}]);setAnswer("")};reader.readAsDataURL(file)};
  const start=()=>{setRound(Math.floor(Math.random()*photos.length));setPicked(null)};const current=round===null?null:photos[round];
  return <GameFrame eyebrow="upload · blur · guess" title="Blurred Memory"><div className="mx-auto max-w-3xl">{!current?<><div className="grid gap-4 border-2 border-dashed border-[#8d6b77] bg-[#f6e7dc] p-5 sm:grid-cols-[1fr_auto]"><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="What should the answer be?" className="border-2 border-[#591329] bg-white px-4 py-3 font-mono text-xs"/><label className={`grid cursor-pointer place-items-center bg-[#31527e] px-5 py-3 font-mono text-[10px] font-black text-white ${!answer.trim()?"pointer-events-none opacity-40":""}`}>choose photo<input type="file" accept="image/*" className="hidden" onChange={e=>add(e.target.files?.[0]??null)}/></label></div><p className="mt-3 text-center font-mono text-[9px] text-[#795c66]">Add at least 2 photos. The answer becomes one of the choices.</p><div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">{photos.map(p=><div key={p.id} className="relative aspect-square overflow-hidden border-2 border-white shadow"><div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url(${p.src})`}}/><span className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center font-mono text-[7px] text-white">{p.answer}</span></div>)}</div><button type="button" disabled={photos.length<2} onClick={start} className="mx-auto mt-7 block bg-[#591329] px-8 py-3 font-mono text-xs font-black text-white disabled:opacity-35">shuffle a memory →</button></>:<><div className="relative mx-auto aspect-[4/3] max-w-lg overflow-hidden border-[12px] border-b-[48px] border-white shadow-[8px_9px_0_#91afd3]"><div className={`absolute inset-0 bg-cover bg-center transition duration-700 ${picked?"blur-0":"scale-110 blur-xl"}`} style={{backgroundImage:`url(${current.src})`}}/><span className="absolute bottom-[-38px] left-0 font-mono text-[9px] font-black text-[#591329]">WHAT MEMORY IS THIS?</span></div><div className="mt-7 grid gap-3 sm:grid-cols-2">{photos.map(p=><button key={p.id} disabled={!!picked} onClick={()=>setPicked(p.answer)} className={`border-2 p-3 font-mono text-xs font-black ${picked?(p.answer===current.answer?"border-[#2c7456] bg-[#8bc7a7]":p.answer===picked?"border-[#9c294d] bg-[#e799af]":"opacity-40"):"border-[#795562] bg-white"}`}>{p.answer}</button>)}</div>{picked&&<button onClick={start} className="mx-auto mt-6 block bg-[#31527e] px-7 py-3 font-mono text-xs font-black text-white">next blurred photo ↻</button>}</>}</div></GameFrame>;
}

function GuessMonth({award}:{award:(x:number)=>void}) {
  const [round,setRound]=useState(0);const [picked,setPicked]=useState<string|null>(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);const item=monthRounds[round];
  const guess=(x:string)=>{if(picked)return;setPicked(x);if(x===item.answer)setScore(s=>s+1)};
  const next=()=>{if(round===monthRounds.length-1){const final=score+(picked===item.answer?1:0);setDone(true);award(final*10)}else{setRound(r=>r+1);setPicked(null)}};
  return <GameFrame eyebrow={`round ${round+1} of ${monthRounds.length} · score ${score}`} title="This was from which month?">{done?<Result icon="🏆" title={`${score}/5 months correct`} text={score>=4?"Camera-roll detective! You really know our timeline.":"Still cute. A rematch is officially required."} reset={()=>{setRound(0);setPicked(null);setScore(0);setDone(false)}}/>:<div className="mx-auto max-w-2xl text-center"><div className="mx-auto grid aspect-[4/3] max-w-md place-items-center border-[12px] border-white bg-[#c2d5eb] shadow-[7px_8px_0_#df8fa9]"><div><span className="text-8xl">{item.icon}</span><p className="mt-4 font-serif text-2xl font-black">{item.title}</p></div></div><div className="mt-8 grid grid-cols-2 gap-3">{item.options.map(x=><button key={x} type="button" disabled={!!picked} onClick={()=>guess(x)} className={`border-2 px-4 py-3 font-mono text-xs font-black ${picked?(x===item.answer?"border-[#2d7558] bg-[#77bf9d]":x===picked?"border-[#9d294b] bg-[#e78ca7]":"opacity-45"):"border-[#591329] bg-white hover:-translate-y-1"}`}>{x}</button>)}</div>{picked&&<div className="mt-6"><p className="font-serif text-2xl font-black">{picked===item.answer?"Correct! ♡":"Almost!"}</p><p className="mt-2 font-mono text-xs">{item.explanation}</p><button type="button" onClick={next} className="mt-5 bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white">{round===4?"see my score":"next photo →"}</button></div>}</div>}</GameFrame>
}

*/
function QuestionCards({players,activeId,setActive}:{players:Player[];activeId:string;setActive:(x:string)=>void}) {
  const cats=Object.keys(questionData);const [cat,setCat]=useState(cats[0]);const [index,setIndex]=useState(0);const [revealed,setRevealed]=useState(false);const active=players.find(p=>p.id===activeId)??players[0];
  const next=()=>{setIndex(i=>(i+1)%questionData[cat].length);setRevealed(false);const pi=players.findIndex(p=>p.id===activeId);setActive(players[(pi+1)%players.length].id)};
  const shuffle=()=>{setIndex(Math.floor(Math.random()*questionData[cat].length));setRevealed(false)};
  return <GameFrame eyebrow={`${active.avatar} ${active.name} answers this one`} title="Question Card Deck"><div className="flex flex-wrap justify-center gap-2">{cats.map(x=><button key={x} onClick={()=>{setCat(x);setIndex(0);setRevealed(false)}} className={`rounded-full border px-3 py-2 font-mono text-[9px] font-black ${cat===x?"border-[#591329] bg-[#591329] text-white":"border-[#aa8994] bg-white"}`}>{x}</button>)}</div><button type="button" onClick={()=>setRevealed(true)} className={`question-card relative mx-auto mt-10 grid min-h-[360px] w-full max-w-lg place-items-center border-2 border-[#591329] p-9 text-center shadow-[10px_11px_0_#86a7ce] ${revealed?"is-revealed bg-[#fff8e9]":"bg-[#d97897]"}`}><div>{revealed?<><p className="font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#ba3c60]">{cat} · for {active.name}</p><p className="mt-7 font-serif text-3xl font-black leading-snug">{questionData[cat][index]}</p><span className="mt-8 block text-4xl">♡</span></>:<><span className="text-7xl text-white">?</span><p className="mt-6 font-mono text-[10px] font-black uppercase tracking-widest text-white">tap to reveal</p></>}</div></button><div className="mt-7 flex justify-center gap-3"><button onClick={shuffle} className="border-2 border-[#31527e] bg-[#b5cbe5] px-5 py-3 font-mono text-xs font-black">shuffle ↻</button><button onClick={next} className="bg-[#591329] px-6 py-3 font-mono text-xs font-black text-white">next player & question →</button></div></GameFrame>
}

/* Retired quiz implementation kept out of the client bundle.
function Quiz({award}:{award:(x:number)=>void}) {
  const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [answer,setAnswer]=useState<number|null>(null);const [done,setDone]=useState(false);const item=quizData[index];
  const choose=(i:number)=>{if(answer!==null)return;setAnswer(i);if(i===item.answer)setScore(s=>s+1)};
  const next=()=>{if(index===quizData.length-1){const final=score+(answer===item.answer?1:0);setDone(true);award(final*10)}else{setIndex(i=>i+1);setAnswer(null)}};
  const reset=()=>{setIndex(0);setScore(0);setAnswer(null);setDone(false)};
  const message=score>=8?"Certified Luthfiandra Expert.":score>=5?"Still cute, still accepted.":"You owe me one date.";
  return <GameFrame eyebrow={`question ${index+1} / 10 · ${score} correct`} title="Quick Couple Quiz">{done?<Result icon={score>=8?"🏅":"💌"} title={`${score}/10 · ${message}`} text={score>=8?"Official proof that you know us frighteningly well.":score>=5?"A respectable score and an excellent excuse to replay.":"Not a failure—this is simply a legally binding date coupon."} reset={reset}/>:<div className="mx-auto max-w-2xl"><div className="h-2 overflow-hidden rounded-full border border-[#591329] bg-white"><div className="h-full bg-[#d65379] transition-all" style={{width:`${(index+1)*10}%`}}/></div><h3 className="mt-10 text-center font-serif text-3xl font-black">{item.q}</h3><div className="mt-8 grid gap-3">{item.options.map((x,i)=><button key={x} disabled={answer!==null} onClick={()=>choose(i)} className={`border-2 px-5 py-4 text-left font-mono text-xs font-black transition ${answer!==null?(i===item.answer?"border-[#2c7456] bg-[#77bd9c]":i===answer?"border-[#a32c50] bg-[#e78ba6]":"opacity-45"):"border-[#7d5664] bg-white hover:translate-x-2"}`}><span className="mr-3">{String.fromCharCode(65+i)}.</span>{x}</button>)}</div>{answer!==null&&<button onClick={next} className="mx-auto mt-7 block bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white">{index===9?"finish quiz":"next question →"}</button>}</div>}</GameFrame>
}

*/
/* Original single-vault prototype, excluded from the bundle.
function PasswordEscape() {
  const [opened,setOpened]=useState<string[]>([]);const [code,setCode]=useState("");const [status,setStatus]=useState<"idle"|"wrong"|"open">("idle");const [flipped,setFlipped]=useState(false);
  const inspect=(id:string)=>setOpened(old=>old.includes(id)?old:[...old,id]);
  const digit=(value:string)=>{if(status==="open"||code.length===4)return;setCode(old=>old+value);setStatus("idle")};
  const unlock=()=>{if(code.length<4)return;setStatus(code==="4273"?"open":"wrong");if(code!=="4273")window.setTimeout(()=>setCode(""),450)};
  const reset=()=>{setOpened([]);setCode("");setStatus("idle");setFlipped(false)};
  if(status==="open")return <GameFrame eyebrow="vault unlocked · access granted" title="The Password Is Us"><div className="confetti-pop mx-auto max-w-2xl py-8 text-center"><div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-[#591329] bg-[#f2c258] text-6xl shadow-[7px_8px_0_#789fd0]">💌</div><p className="mt-7 font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#b4355a]">secret file no. 4273</p><h3 className="mt-3 font-serif text-4xl font-black">For the person who feels like home.</h3><div className="mt-7 rotate-[-1deg] border-2 border-[#9d7884] bg-white p-7 text-left shadow-[7px_8px_0_#d98ba3]"><p className="font-serif text-xl italic leading-8">Kalau kamu berhasil membuka ini, berarti kamu memang hafal detail-detail kecil tentang kita. Di balik semua foto, tanggal, dan chat random, password sebenarnya selalu sama: us. Thank you for being my favorite memory and my favorite future.</p><p className="mt-5 text-right font-serif font-black italic">— with love, Angie ♡</p></div><button onClick={reset} className="mt-7 border-b-2 border-[#591329] font-mono text-[9px] font-black uppercase">lock the vault again ↻</button></div></GameFrame>;
  return <GameFrame eyebrow={`${opened.length}/4 objects inspected · connect the clues`} title="The Password Is Us"><div className="mx-auto max-w-5xl"><div className="grid gap-6 lg:grid-cols-[1fr_300px]"><div><p className="mb-4 font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#7c5c67]">Click every object. Each one hides a digit.</p><div className="grid grid-cols-2 gap-4">
    <button onClick={()=>{inspect("photo");setFlipped(x=>!x)}} className={`relative min-h-52 border-2 border-[#591329] p-4 shadow-[5px_6px_0_#d98ba3] transition ${flipped?"bg-[#f6e0b1]":"bg-white"}`}>{flipped?<div><p className="font-mono text-[8px] font-black uppercase">written on the back</p><p className="mt-5 font-serif text-2xl font-black italic">“Our story got close in April.”</p><p className="mt-5 font-mono text-[9px]">Month number = ?</p></div>:<div className="rotate-[-3deg]"><div className="grid h-28 place-items-center bg-[#e9b2c2] text-5xl">♡</div><p className="mt-3 font-serif font-black italic">flip the polaroid ↻</p></div>}</button>
    <button onClick={()=>inspect("note")} className="relative min-h-52 rotate-[1deg] border-2 border-[#8a6a2b] bg-[#f4d96d] p-5 text-left shadow-[5px_6px_0_#789fd0]"><span className="absolute left-1/2 top-0 h-5 w-20 -translate-x-1/2 bg-white/50"/><p className="font-mono text-[8px] font-black uppercase">sticky note</p><p className="mt-8 font-serif text-2xl font-black italic">“It takes <u>two</u> people to make an us.”</p>{opened.includes("note")&&<b className="mt-5 block font-mono text-[9px] uppercase">clue found ✓</b>}</button>
    <button onClick={()=>inspect("calendar")} className="min-h-52 border-2 border-[#591329] bg-[#fffaf3] p-4 shadow-[5px_6px_0_#c86488]"><div className="bg-[#591329] py-2 font-mono text-[9px] font-black uppercase text-white">our calendar</div><p className="mt-4 font-serif text-xl font-black">JULY</p><div className="mx-auto mt-3 grid h-16 w-16 place-items-center rounded-full border-4 border-[#d33f67] font-mono text-3xl font-black">17</div><p className="mt-3 font-mono text-[8px]">Only the last digit fits the lock.</p></button>
    <button onClick={()=>inspect("chat")} className="min-h-52 border-2 border-[#31527e] bg-[#dce8f5] p-4 text-left shadow-[5px_6px_0_#591329]"><p className="font-mono text-[8px] font-black uppercase text-[#31527e]">1 new message · 23:03</p><div className="mt-5 rounded-[4px_18px_18px_18px] bg-white p-4 font-serif text-lg font-bold shadow">“I&apos;ve typed ‘I miss you’ three times today already.” <small className="mt-2 block text-right font-mono text-[8px]">✓✓</small></div>{opened.includes("chat")&&<p className="mt-3 text-right font-mono text-[8px] font-black">notification opened ✓</p>}</button>
  </div></div><aside className="self-start border-4 border-[#351522] bg-[#25202a] p-5 text-white shadow-[8px_9px_0_#789fd0] lg:sticky lg:top-5"><p className="text-center font-mono text-[8px] font-black uppercase tracking-[.25em] text-[#9fbbe0]">Luthfiandra secure vault</p><div className={`mt-5 flex h-16 items-center justify-center border-2 bg-[#101813] font-mono text-4xl font-black tracking-[.35em] ${status==="wrong"?"border-[#e75972] text-[#e75972]":"border-[#71987d] text-[#a9dfb7]"}`}>{code.padEnd(4,"•")}</div><p className="mt-2 h-4 text-center font-mono text-[8px] font-black uppercase text-[#e9899d]">{status==="wrong"?"access denied · try again":"4-digit password"}</p><div className="mt-5 grid grid-cols-3 gap-2">{[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>digit(String(n))} className="border border-white/30 bg-white/10 py-3 font-mono font-black hover:bg-white/20">{n}</button>)}<button onClick={()=>setCode(x=>x.slice(0,-1))} className="border border-white/30 bg-white/10 font-mono">⌫</button><button onClick={()=>digit("0")} className="border border-white/30 bg-white/10 font-mono font-black">0</button><button onClick={unlock} disabled={code.length!==4} className="bg-[#c5466b] font-mono text-[9px] font-black disabled:opacity-30">OK</button></div><p className="mt-5 text-center font-mono text-[8px] leading-4 text-white/55">No clue gives the full code.<br/>Read them in object order.</p></aside></div></div></GameFrame>
}

*/
function PasswordEscape() {
  const [level,setLevel]=useState(0);const [opened,setOpened]=useState<number[]>([]);const [code,setCode]=useState("");const [status,setStatus]=useState<"idle"|"wrong"|"open"|"complete">("idle");const puzzle=escapePuzzles[level];
  const inspect=(index:number)=>setOpened(old=>old.includes(index)?old:[...old,index]);
  const digit=(value:string)=>{if(code.length<4&&status!=="open")setCode(old=>old+value)};
  const unlock=()=>{if(code===puzzle.password)setStatus("open");else{setStatus("wrong");window.setTimeout(()=>setCode(""),450)}};
  const next=()=>{if(level===escapePuzzles.length-1){setStatus("complete");return}setLevel(x=>x+1);setOpened([]);setCode("");setStatus("idle")};
  const reset=()=>{setLevel(0);setOpened([]);setCode("");setStatus("idle")};
  if(status==="complete")return <GameFrame eyebrow="all five vaults unlocked" title="The Password Is Us"><Result icon="🔓" title="Escape complete!" text="Kalian berhasil membaca 20 clue dan membuka semua secret files. The final password was always us." reset={reset}/></GameFrame>;
  if(status==="open")return <GameFrame eyebrow={`vault ${level+1}/5 · access granted`} title={puzzle.title}><div className="confetti-pop mx-auto max-w-2xl py-8 text-center"><div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-[#591329] bg-[#f2c258] text-6xl shadow-[7px_8px_0_#789fd0]">💌</div><p className="mt-6 font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#b4355a]">secret file {level+1} unlocked</p><h3 className="mt-3 font-serif text-4xl font-black">{puzzle.reward}</h3><div className="mt-7 border-2 border-[#9d7884] bg-white p-6 font-serif text-xl italic shadow-[7px_8px_0_#d98ba3]">Clue demi clue, ternyata kamu tetap jadi jawaban favoritku. ♡</div><button onClick={next} className="mt-7 bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white">{level===4?"open final result":"continue to next vault →"}</button></div></GameFrame>;
  return <GameFrame eyebrow={`vault ${level+1}/${escapePuzzles.length} · ${opened.length}/4 clues inspected`} title="The Password Is Us"><div className="mx-auto max-w-5xl"><div className="mb-5 flex items-center gap-2">{escapePuzzles.map((_,index)=><span key={index} className={`h-2 flex-1 rounded-full border border-[#591329] ${index<level?"bg-[#6faa91]":index===level?"bg-[#f2c258]":"bg-white"}`}/>)}</div><h3 className="mb-5 text-center font-serif text-3xl font-black">Room {level+1}: {puzzle.title}</h3><div className="grid gap-6 lg:grid-cols-[1fr_300px]"><div className="grid grid-cols-2 gap-4">{puzzle.clues.map((clue,index)=>{const seen=opened.includes(index);return <button key={clue.label} onClick={()=>inspect(index)} className={`relative min-h-48 border-2 border-[#591329] p-5 text-left shadow-[5px_6px_0_${index%2?"#789fd0":"#d98ba3"}] transition hover:-translate-y-1 ${seen?"bg-[#fff8e9]":"bg-white"}`}><span className="text-4xl">{clue.icon}</span><p className="mt-3 font-mono text-[8px] font-black uppercase tracking-wider">{clue.label}</p>{seen?<><p className="mt-4 font-serif text-xl font-black italic">“{clue.text}”</p><p className="mt-3 font-mono text-[8px] text-[#b4355a]">HINT: {clue.hint}</p></>:<p className="mt-5 font-mono text-[9px] font-black uppercase text-[#806570]">tap to inspect</p>}</button>})}</div><aside className="self-start border-4 border-[#351522] bg-[#25202a] p-5 text-white shadow-[8px_9px_0_#789fd0] lg:sticky lg:top-5"><p className="text-center font-mono text-[8px] font-black uppercase tracking-[.22em] text-[#9fbbe0]">secure vault · room {level+1}</p><div className={`mt-5 flex h-16 items-center justify-center border-2 bg-[#101813] font-mono text-4xl font-black tracking-[.3em] ${status==="wrong"?"border-[#e75972] text-[#e75972]":"border-[#71987d] text-[#a9dfb7]"}`}>{code.padEnd(4,"•")}</div><p className="mt-2 h-4 text-center font-mono text-[8px] font-black uppercase text-[#e9899d]">{status==="wrong"?"access denied":"read clues in object order"}</p><div className="mt-5 grid grid-cols-3 gap-2">{[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>digit(String(n))} className="border border-white/30 bg-white/10 py-3 font-mono font-black">{n}</button>)}<button onClick={()=>setCode(x=>x.slice(0,-1))} className="border border-white/30 bg-white/10">⌫</button><button onClick={()=>digit("0")} className="border border-white/30 bg-white/10 font-mono font-black">0</button><button onClick={unlock} disabled={code.length!==4} className="bg-[#c5466b] font-mono text-[9px] font-black disabled:opacity-30">OK</button></div></aside></div></div></GameFrame>
}

function Result({icon,title,text,reset}:{icon:string;title:string;text:string;reset:()=>void}) { return <div className="py-14 text-center"><span className="text-8xl">{icon}</span><h3 className="mt-6 font-serif text-4xl font-black">{title}</h3><p className="mx-auto mt-4 max-w-lg font-mono text-xs leading-6">{text}</p><button onClick={reset} className="mt-7 bg-[#591329] px-7 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#d98ca5]">play again ↻</button></div> }

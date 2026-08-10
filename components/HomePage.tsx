"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroData } from "@/data/heroData";
import { LockKeyhole, Pause, Play, Volume2, VolumeX } from "lucide-react";

const marquee =
  "HAPPY BIRTHDAY MY ONE AND ONLY NDUT BOYFRIEND ♥ I LOVE YOU LUTHFIANDRA, PLEASE LIVE YOUR LIFE TO THE HAPPIEST bayi bleee <3";

const collage = [
  { src: "/assets/hero/photo-01.jpg", caption: "kerjanya makan-pup-tidur", rotate: "-rotate-6" },
  { src: "/assets/hero/photo-02.jpg", caption: "sering bgt mimisan ih", rotate: "rotate-2" },
  { src: "/assets/hero/photo-03.jpg", caption: "hobi narik penumpang mulu", rotate: "-rotate-2" },
  { src: "/assets/hero/photo-04.jpg", caption: "umurnya masih 4 tahun", rotate: "rotate-3" },
  { src: "/assets/hero/photo-05.jpg", caption: "POKONYA BELEBERANNN", rotate: "rotate-6" },
  { src: "/assets/hero/photo-06.jpg", caption: "main ipad sushiro terus.", rotate: "rotate-2" },
  { src: "/assets/hero/photo-07.jpg", caption: "suka banget boneka", rotate: "-rotate-3" },
  { src: "/assets/hero/photo-08.jpg", caption: "pura pura jadi dokter", rotate: "rotate-6" },
  { src: "/assets/hero/photo-09.jpg", caption: "MANGAAAPPP AJAAA", rotate: "-rotate-2" },
  { src: "/assets/hero/photo-10.jpg", caption: "sayang angie heheh", rotate: "rotate-3" }
];

const birthdayGifts = [
  {
    name: "sepatu",
    aliases: ["sepatu", "shoes", "sneakers", "sneaker", "adidas", "spezial", "adidas spezial"],
    clue: ["kamu pake setiap hari", "ada dimana mana", "lebih gede dari muka aku"],
    photo: "/assets/gifts/gift-01.webp",
    color: "bg-[#f5b4c3]",
    tape: "bg-[#c9d9ec]"
  },
  {
    name: "lego",
    aliases: ["lego", "legos", "mainan lego", "keychain"],
    clue: ["kecil", "mirip kamu", "warna warni"],
    photo: "/assets/gifts/gift-02.svg",
    color: "bg-[#a9c8ed]",
    tape: "bg-[#e7baa9]"
  },
  {
    name: "skincare",
    aliases: ["skincare", "skin care", "perawatan kulit", "originote"],
    clue: ["kamu gapunya", "aku pake setiap hari", "kamu makin ganteng pake ini"],
    photo: "/assets/gifts/gift-03.jpg",
    color: "bg-[#f7d8b6]",
    tape: "bg-[#ef9eb5]"
  },
  {
    name: "polo shirt",
    aliases: ["polo", "polo shirt", "baju", "calvin klein", "atasan"],
    clue: ["kamu punya banyak", "aku pernah ke tokonya di pim", "suka dipake main golf"],
    photo: "/assets/gifts/gift-04.webp",
    color: "bg-[#789bc7]",
    tape: "bg-[#f4c1cb]"
  },
  {
    name: "parfum",
    aliases: ["parfum", "perfume", "minyak wangi", "mercy", "parfum mercy", "mercedes benz", "parfume"],
    clue: ["merknya terkenal", "kamu lebih suka bmw daripada ini", "kamu punya banyak"],
    photo: "/assets/gifts/gift-05.webp",
    color: "bg-[#d9b7db]",
    tape: "bg-[#b9d2ee]"
  }
];

export function HomePage() {
  const [letterOpen, setLetterOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [activeGift, setActiveGift] = useState<number | null>(null);
  const [unlockedGifts, setUnlockedGifts] = useState<number[]>([]);
  const [giftGuess, setGiftGuess] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [clueLevel, setClueLevel] = useState<Record<number, number>>({});
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = videoSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!entry.isIntersecting && video && !video.paused) {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const toggleVideoSound = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setVideoMuted(nextMuted);
  };

  const openGift = (index: number) => {
    setActiveGift(index);
    setGiftGuess("");
    setGiftMessage("");
  };

  const checkGiftGuess = () => {
    if (activeGift === null) return;
    const cleanGuess = giftGuess.trim().toLocaleLowerCase("id-ID").replace(/\s+/g, " ");
    if (birthdayGifts[activeGift].aliases.includes(cleanGuess)) {
      setUnlockedGifts((current) => current.includes(activeGift) ? current : [...current, activeGift]);
      setGiftMessage("yes! kamu bener — kado ini sekarang jadi milikmu ♡");
    } else {
      setGiftMessage("SALAH ANDRA HAHAHAHHA NDUT!");
    }
  };

  return (
    <main className="overflow-hidden bg-[#fffaf5] text-[#3b1723]">
      <div className="marquee overflow-hidden border-b border-[#790826]/25 bg-white py-2 text-[#790826]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0" aria-hidden={group === 1}>
              {[0, 1].map((copy) => (
                <span key={copy} className="flex items-center whitespace-nowrap text-[10px] font-extrabold tracking-wide sm:text-xs">
                  <b className="mx-6 text-[#d45b7c]">✦</b>{marquee}<b className="mx-6 text-[#d45b7c]">♥</b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section ref={videoSectionRef} className="relative px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <Doodle className="left-[4%] top-20 text-[#284b80]" text="☆" />
        <Doodle className="right-[6%] top-24 text-[#d45b7c]" text="⌇" />
        <Doodle className="bottom-20 left-[8%] text-[#284b80]" text="〰" />
        <Doodle className="bottom-28 right-[7%] text-[#d45b7c]" text="✧" />

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute -left-14 top-20 hidden h-40 w-28 rotate-[-8deg] border border-[#d4a7a0] bg-[linear-gradient(#e7b9b1_1px,transparent_1px),linear-gradient(90deg,#e7b9b1_1px,transparent_1px)] bg-[size:18px_18px] opacity-55 md:block" />
          <div className="absolute -right-14 top-14 z-20 hidden w-32 rotate-[8deg] bg-[#b9d0ec] p-5 pb-8 shadow-md md:block">
            <span className="block text-center text-6xl font-light text-[#284b80]">♡</span>
            <span className="absolute -top-3 right-5 text-3xl text-[#d45b7c]">⌕</span>
          </div>
          <div className="absolute bottom-6 -left-20 z-[60] hidden w-44 rotate-[-10deg] rounded-lg border-2 border-[#521020] bg-[#e9a0ad] p-4 shadow-lg md:block">
            <div className="grid h-16 place-items-center border-2 border-[#521020] bg-[#fff5ef]">
              <span className="h-8 w-20 rounded-full border-4 border-[#521020]" />
            </div>
            <div className="mt-2 flex justify-around"><i className="h-2 w-2 rounded-full bg-[#521020]" /><i className="h-2 w-2 rounded-full bg-[#521020]" /><i className="h-2 w-2 rounded-full bg-[#521020]" /></div>
          </div>

          <div className="relative border-[3px] border-[#521020] bg-[#ecebe8] p-2 shadow-[8px_10px_0_rgba(30,42,68,.12)] sm:p-3">
            <div className="relative overflow-hidden bg-[#27151c]">
              <video
                ref={videoRef}
                className="block max-h-[75vh] w-full cursor-pointer object-contain"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onClick={toggleVideoPlayback}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onVolumeChange={(event) => setVideoMuted(event.currentTarget.muted)}
              >
                <source src={heroData.heroVideo} type="video/mp4" />
              </video>
              <div className="absolute bottom-3 right-3 z-50 flex items-center gap-2 text-white sm:bottom-4 sm:right-4">
                <button
                  type="button"
                  onClick={toggleVideoPlayback}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/45 bg-[#32151f]/75 px-3 py-2.5 font-mono text-[9px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md transition hover:bg-[#32151f]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-[10px]"
                  aria-label={videoPlaying ? "Pause video" : "Play video"}
                >
                  {videoPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
                  <span>{videoPlaying ? "pause" : "play"}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleVideoSound}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/45 bg-[#32151f]/75 px-3 py-2.5 font-mono text-[9px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md transition hover:bg-[#32151f]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4 sm:text-[10px]"
                  aria-label={videoMuted ? "Turn sound on" : "Mute video"}
                >
                  {videoMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span>{videoMuted ? "sound on" : "mute"}</span>
                </button>
              </div>
            </div>
          </div>
          <span className="absolute -bottom-8 -right-7 z-20 text-7xl text-[#e58da4] drop-shadow-md">♥</span>
        </div>
      </section>

      <section id="birthday-letter" className="border-y border-[#790826]/10 bg-[#fff0f0] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <button type="button" onClick={() => setLetterOpen(true)} className="group relative mx-auto w-full max-w-lg py-10 focus:outline-none" aria-expanded={letterOpen}>
            <span className="absolute left-2 top-0 text-4xl text-[#d45b7c] opacity-0 transition group-hover:opacity-100">′′</span>
            <span className="relative block aspect-[1.55/1] overflow-hidden rounded-xl border-2 border-[#591127] bg-[#8c1134] shadow-[7px_9px_0_rgba(89,17,39,.18)] transition duration-500 group-hover:-translate-y-3 group-hover:rotate-[-2deg]">
              <span className="absolute inset-x-0 bottom-0 h-[78%] bg-[#9d173e] [clip-path:polygon(0_0,50%_63%,100%_0,100%_100%,0_100%)]" />
              <span className="absolute inset-x-0 top-0 h-[72%] origin-top bg-[#710d2c] transition duration-500 [clip-path:polygon(0_0,100%_0,50%_100%)] group-hover:scale-y-90" />
              <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#fff1ec] bg-[#f0a3b5] text-3xl text-[#8c1134] shadow-md">♥</span>
            </span>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-sm font-bold italic text-[#8c1134] opacity-0 transition duration-300 group-hover:opacity-100">click to open your letter ♥</span>
          </button>

          <div className="min-h-[380px] border-l border-dashed border-[#d45b7c]/50 pl-0 lg:pl-12">
            {letterOpen ? (
              <article className="letter-side-reveal relative max-w-xl">
                <button type="button" onClick={() => setLetterOpen(false)} className="absolute right-0 top-0 text-2xl text-[#8c1134]" aria-label="Close letter">×</button>
                <h1 className="font-serif text-5xl font-black leading-none text-[#501521]">happy birthday,</h1>
                <p className="mt-2 font-serif text-4xl italic text-[#d33f67]">my one and only BAYI. ♡</p>
                <div className="mt-9 max-w-md space-y-5 font-mono text-sm leading-6 text-[#472936]">
                  {heroData.openingLetter.paragraphs.map((paragraph, index) => (
                    <p key={paragraph} className="letter-line" style={{ animationDelay: `${index * 250 + 100}ms` }}>{paragraph}</p>
                  ))}
                </div>
                <p className="letter-line mt-7 font-mono text-sm font-bold text-[#c92d59]" style={{ animationDelay: "650ms" }}>you&apos;re the best boyfriend ever!</p>
                <p className="letter-line ml-auto mt-7 w-fit rotate-[-2deg] bg-[#c9d9ec] px-8 py-2 font-mono text-sm font-bold" style={{ animationDelay: "850ms" }}>— with love, angie</p>
              </article>
            ) : (
              <div className="grid min-h-[380px] place-items-center text-center">
                <div className="opacity-35">
                  <p className="font-serif text-4xl font-black">happy birthday,</p>
                  <p className="font-serif text-3xl italic">your message is sealed.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 md:px-8">
        <Doodle className="left-[6%] top-20 text-[#d45b7c]" text="✧" />
        <Doodle className="right-[8%] top-28 text-[#284b80]" text="♡" />
        <span className="love-spark absolute left-[14%] top-[52%] text-2xl text-[#e6a4b7]">✦</span>
        <span className="love-spark love-spark-delayed absolute right-[15%] top-[44%] text-xl text-[#779bc7]">✧</span>
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[.62fr_1.38fr]">
            <div>
              <p className="font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#31547e]">pick a number · any number</p>
              <h2 className="font-serif text-5xl font-black leading-none text-[#401521]">10 things i</h2>
              <p className="mt-3 flex items-end gap-3 font-serif text-4xl italic text-[#401521]">
                <span className="hate-to-love relative inline-block px-1">
                  <span className="relative opacity-55">hate</span>
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 -rotate-6 whitespace-nowrap font-serif text-3xl font-black italic text-[#c5365d]">love</span>
                </span>
                <span>about you <span className="text-[#d33f67]">♡</span></span>
              </p>
              <div className="mt-4 h-px w-64 bg-[#d33f67]" />
              <p className="mt-8 max-w-[260px] font-mono text-xs leading-6">semua kertasnya bebas dipilih seng. pencet langsung sajaa di dalam jar, each one is a tiny reason why I choose you.</p>
              <p className="mt-4 text-5xl text-[#8c1134]">↝</p>
            </div>

            <div className="love-jar relative mx-auto h-[470px] w-full max-w-[600px]">
              <div className="jar-lid absolute left-1/2 top-0 z-30 h-24 w-[62%] -translate-x-1/2 rounded-[50%] border-2 border-[#561326] bg-[#851033] shadow-[0_8px_0_#5d1028]">
                <span className="absolute inset-x-8 top-5 h-2 rounded-full bg-white/20" />
                <span className="absolute left-1/2 top-10 -translate-x-1/2 font-mono text-[8px] font-black uppercase tracking-[.35em] text-white/60">love notes · 01—10</span>
              </div>
              <div className="absolute inset-x-[8%] bottom-0 top-16 overflow-hidden rounded-b-[5rem] rounded-t-[3rem] border-2 border-[#633346] bg-white/35 shadow-[7px_9px_0_rgba(30,42,68,.1)] backdrop-blur-[1px]">
                {heroData.loveNotes.map((note, index) => (
                  <button
                    key={note.title}
                    type="button"
                    onClick={() => setActiveNote(index)}
                    className={`jar-note jar-note-${(index % 4) + 1} absolute grid h-[86px] w-[102px] place-items-center border border-[#7e5362] p-2 text-center shadow-[3px_4px_0_rgba(83,48,61,.22)] ${
                      ["bg-[#f6c3d0]", "bg-[#c6dcf2]", "bg-[#f9df91]", "bg-[#c8e2d2]", "bg-[#d9c5e7]", "bg-[#efc3ae]", "bg-[#bfdee1]", "bg-[#edc8d3]", "bg-[#c9cdea]", "bg-[#efd3aa]"][index]
                    } ${activeNote === index ? "is-active z-30" : ""}`}
                    style={{ left: `${[5, 29, 56, 13, 42, 66, 4, 31, 58, 18][index]}%`, top: `${[14, 10, 17, 36, 35, 40, 58, 59, 62, 77][index]}%`, "--note-rotate": `${[-8, 6, -4, 7, -6, 5, 8, -4, 5, -7][index]}deg`, "--note-delay": `${index * 90}ms`, zIndex: activeNote === index ? 25 : index } as React.CSSProperties}
                    aria-label={`Open love note ${index + 1}`}
                  >
                    <span className="font-serif text-3xl font-black leading-none text-[#583340]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-mono text-[7px] font-black uppercase tracking-[.18em] text-[#714a58]">open me ♡</span>
                  </button>
                ))}
                <span className="absolute left-8 top-28 h-48 w-5 rotate-6 rounded-full bg-white/45" />
                <span className="absolute bottom-5 right-10 h-32 w-3 -rotate-12 rounded-full bg-white/30" />
              </div>
              <span className="jar-tag absolute right-0 top-24 z-30 rotate-[12deg] bg-[#fff0df] px-6 py-5 font-mono text-[10px] font-black shadow-[4px_5px_0_#c9d9ec]">tap a number<br />open with ♡</span>
            </div>
          </div>

          <div className="mx-auto mt-12 min-h-[310px] max-w-4xl">
              {activeNote === null ? (
                <div className="flex min-h-[250px] items-center justify-center border-2 border-dashed border-[#b997a1] bg-white/30 px-6 text-center">
                  <p className="font-mono text-xs leading-6 text-[#6f5360]">the jar is waiting for you<br /><span className="font-serif text-2xl italic text-[#b9365b]">pick one of the ten little notes above ♡</span></p>
                </div>
              ) : (
                <article key={activeNote} className="love-note-open relative grid overflow-hidden border-2 border-[#5b2032] bg-[#fff5ec] shadow-[9px_10px_0_#c9d9ec] md:grid-cols-[280px_1fr]">
                  <div className="note-photo-pop relative min-h-[260px] border-b-2 border-[#5b2032] bg-[#e5edf7] p-5 md:border-b-0 md:border-r-2">
                    <div className="grid h-full min-h-[220px] rotate-[-2deg] place-items-center border-2 border-dashed border-[#31547e]/55 bg-white/55 p-5 text-center">
                      <div>
                        <span className="text-5xl">📷</span>
                        <p className="mt-3 font-mono text-[8px] font-black uppercase tracking-[.22em] text-[#31547e]">photo placeholder</p>
                        <p className="mt-1 font-serif text-lg italic text-[#5f4050]">our memory for note {String(activeNote + 1).padStart(2, "0")}</p>
                      </div>
                    </div>
                    <span className="absolute left-1/2 top-2 h-6 w-20 -translate-x-1/2 -rotate-2 bg-[#e3b7aa]/70" />
                  </div>
                  <div className="relative flex min-h-[260px] flex-col justify-center px-7 py-9 text-left sm:px-10">
                    <span className="absolute right-6 top-5 font-serif text-6xl font-black text-[#e9c3cd]">{String(activeNote + 1).padStart(2, "0")}</span>
                    <p className="font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#c92d59]">little note no. {activeNote + 1}</p>
                    <h3 className="relative mt-3 font-serif text-4xl font-black">{heroData.loveNotes[activeNote].title}</h3>
                    <p className="relative mt-4 max-w-lg font-mono text-xs leading-6 text-[#59404a]">{heroData.loveNotes[activeNote].text}</p>
                    <p className="mt-6 font-serif text-lg italic text-[#a32d50]">always one more reason to love you ♡</p>
                  </div>
                </article>
              )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-t-[5rem] bg-[#dce8f7] px-5 pb-24 pt-20 md:px-8">
        <Doodle className="left-[3%] top-16 text-[#284b80]" text="♧" />
        <Doodle className="right-[4%] top-20 text-[#284b80]" text="♧" />
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex rotate-[-2deg] gap-2 font-serif text-3xl font-black text-white sm:text-5xl">
              <span className="bg-[#7b0828] px-3 py-1">get</span>
              <span className="bg-[#415c88] px-3 py-1">to</span>
              <span className="bg-[#d65c7c] px-3 py-1">know</span>
              <span className="bg-[#29436d] px-3 py-1">him</span>
              <span className="text-[#d33f67]">♥</span>
            </div>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {collage.map((photo, index) => (
              <figure key={photo.src} className={`relative bg-[#fffaf5] p-3 pb-14 shadow-[5px_7px_12px_rgba(30,42,68,.2)] transition hover:-translate-y-3 ${photo.rotate}`}>
                <span className={`absolute -top-4 left-1/2 h-8 w-20 -translate-x-1/2 ${index % 2 ? "bg-[#e8cfc5]/80" : "bg-[#d1a6a6]/75"}`} />
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={photo.src} alt={photo.caption} fill sizes="240px" className="object-cover" />
                </div>
                <figcaption className="absolute inset-x-2 bottom-5 text-center font-mono text-xs font-bold">{photo.caption} <span className="text-[#c92d59]">♡</span></figcaption>
              </figure>
            ))}
          </div>
          <p className="mx-auto mt-14 max-w-xl rotate-[-1deg] bg-[#fff2e5] px-8 py-4 text-center font-mono text-sm shadow-sm">
            there&apos;s so much more to him<br />and i&apos;m so lucky it&apos;s you. ♡
          </p>
        </div>
      </section>

      <section id="five-gifts" className="relative overflow-hidden border-t-4 border-[#790826] bg-[#fff8ee] px-5 py-24 md:px-8">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(#dfc8c2_1px,transparent_1px),linear-gradient(90deg,#dfc8c2_1px,transparent_1px)] [background-size:32px_32px]" />
        <Doodle className="left-[4%] top-20 text-[#d45b7c]" text="✦" />
        <Doodle className="right-[5%] top-24 text-[#284b80]" text="♡" />

        <div className="relative mx-auto max-w-7xl">
          <header className="mx-auto max-w-2xl text-center">
            <span className="inline-block rotate-[-3deg] bg-[#790826] px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[.28em] text-white shadow-[4px_5px_0_#b9d0ec]">
              birthday mission
            </span>
            <h2 className="mt-7 font-serif text-5xl font-black leading-[.95] text-[#401521] sm:text-6xl">
              5 little gifts<br />
              <span className="font-normal italic text-[#d33f67]">are waiting for you.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg font-mono text-sm leading-6 text-[#684755]">
              tebak isinya ndut ♡
            </p>
          </header>

          <div className="mx-auto mt-10 flex max-w-xl items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full border border-[#790826] bg-white">
              <div className="h-full bg-[#d45b7c] transition-all duration-700" style={{ width: `${(unlockedGifts.length / birthdayGifts.length) * 100}%` }} />
            </div>
            <span className="font-mono text-xs font-black text-[#790826]">{unlockedGifts.length}/5 unlocked</span>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {birthdayGifts.map((gift, index) => {
              const isUnlocked = unlockedGifts.includes(index);
              return (
                <button
                  key={gift.name}
                  type="button"
                  onClick={() => openGift(index)}
                  className={`gift-card group relative mx-auto w-full max-w-[250px] text-left ${index % 2 ? "lg:translate-y-8" : ""}`}
                  aria-label={isUnlocked ? `Buka kado ${gift.name}` : `Tebak kado nomor ${index + 1}`}
                >
                  <span className={`absolute -top-4 left-1/2 z-20 h-9 w-24 -translate-x-1/2 rotate-[-4deg] opacity-80 ${gift.tape}`} />
                  <span className="relative block aspect-[4/5] overflow-hidden border-2 border-[#5b1b2e] bg-white p-3 shadow-[7px_8px_0_#c7d8eb] transition duration-300 group-hover:-translate-y-3 group-hover:rotate-1">
                    {isUnlocked ? (
                      <span className="gift-unlock block h-full border border-dashed border-[#9f7c86] bg-[#fffaf5] p-3">
                        <span className={`relative block h-full overflow-hidden ${gift.color}`}>
                          <Image src={gift.photo} alt={`Foto hadiah ${gift.name}`} fill sizes="220px" className="object-cover" />
                        </span>
                      </span>
                    ) : (
                      <span className={`relative grid h-full place-items-center overflow-hidden ${gift.color}`}>
                        <span className="absolute -left-8 top-1/2 h-10 w-[140%] -translate-y-1/2 rotate-[-8deg] bg-white/30" />
                        <span className="absolute left-1/2 top-0 h-full w-10 -translate-x-1/2 bg-white/25" />
                        <span className="relative text-center">
                        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-[#5b1b2e] bg-[#fffaf5] text-[#5b1b2e] shadow-[3px_4px_0_rgba(91,27,46,.25)]"><LockKeyhole className="h-8 w-8" strokeWidth={1.7} /></span>
                          <span className="mt-5 block font-mono text-[10px] font-black uppercase tracking-[.25em]">tap to guess</span>
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="mt-4 block text-center font-serif text-xl font-black text-[#501521]">
                    {isUnlocked ? gift.name : `mystery gift no. ${index + 1}`}
                  </span>
                  <span className="mt-1 block text-center font-mono text-[10px] text-[#8c6974]">
                    {isUnlocked ? "unlocked with love ♡" : "locked — APA YAA KIRA KIRAA?"}
                  </span>
                </button>
              );
            })}
          </div>

          {unlockedGifts.length === birthdayGifts.length && (
            <div className="gift-unlock mx-auto mt-20 max-w-2xl rotate-[-1deg] border-2 border-[#790826] bg-[#f5c1cf] p-7 text-center shadow-[8px_9px_0_#9dbbe0]">
              <p className="text-4xl">🎉</p>
              <p className="mt-2 font-serif text-3xl font-black text-[#501521]">you found them all!</p>
              <p className="mt-2 font-mono text-xs">five surprises, especially picked for my favorite person jelek</p>
            </div>
          )}
        </div>
      </section>

      {activeGift !== null && (
        <div className="gift-modal fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#32101c]/65 px-4 py-8 backdrop-blur-sm" onMouseDown={(event) => event.currentTarget === event.target && setActiveGift(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="gift-dialog-title" className="gift-dialog relative w-full max-w-lg border-2 border-[#541426] bg-[#fffaf5] p-6 shadow-[10px_12px_0_rgba(27,43,70,.35)] sm:p-9">
            <span className={`absolute -top-4 left-1/2 h-9 w-28 -translate-x-1/2 rotate-[-3deg] opacity-90 ${birthdayGifts[activeGift].tape}`} />
            <button type="button" onClick={() => setActiveGift(null)} className="absolute right-4 top-3 text-3xl text-[#790826]" aria-label="Tutup">×</button>

            {unlockedGifts.includes(activeGift) ? (
              <div className="gift-unlock text-center">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#c92d59]">gift unlocked!</p>
                <div className={`relative mx-auto mt-5 aspect-[4/3] max-w-sm overflow-hidden border-8 border-white shadow-md ${birthdayGifts[activeGift].color}`}>
                  <Image src={birthdayGifts[activeGift].photo} alt={`Foto hadiah ${birthdayGifts[activeGift].name}`} fill sizes="384px" className="object-cover" />
                </div>
                <h3 id="gift-dialog-title" className="mt-6 font-serif text-4xl font-black text-[#501521]">{birthdayGifts[activeGift].name} ♡</h3>
                <p className="mt-2 font-mono text-xs leading-5 text-[#765663]">yeay, bener! PINTAR BAYII SEMOGA SUKA YAAA</p>
              </div>
            ) : (
              <>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#c92d59]">mystery gift no. {activeGift + 1}</p>
                <h3 id="gift-dialog-title" className="mt-3 font-serif text-4xl font-black text-[#501521]">what&apos;s inside?</h3>
                <p className="mt-3 font-mono text-xs leading-5 text-[#765663]">ketik tebakan kamuu, huruf besar atau kecil nggak masalahhh seng</p>

                {(clueLevel[activeGift] ?? 0) > 0 && (
                  <div className="mt-6 rotate-[-1deg] border border-[#af8c6c] bg-[#fff0c9] p-4 shadow-[3px_4px_0_#e4b8c3]">
                    <p className="mb-3 font-mono text-[9px] font-black uppercase tracking-[.22em] text-[#790826]">clues collected so far</p>
                    <ol className="space-y-2">
                      {birthdayGifts[activeGift].clue.slice(0, clueLevel[activeGift] ?? 0).map((clue, clueIndex) => (
                        <li key={clue} className="flex gap-3 font-mono text-xs leading-5">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#790826] text-[8px] font-black text-white">{clueIndex + 1}</span>
                          <span>{clue}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <form className="mt-6" onSubmit={(event) => { event.preventDefault(); checkGiftGuess(); }}>
                  <label htmlFor="gift-guess" className="font-mono text-[10px] font-black uppercase tracking-widest">your guess</label>
                  <input
                    id="gift-guess"
                    value={giftGuess}
                    onChange={(event) => { setGiftGuess(event.target.value); setGiftMessage(""); }}
                    placeholder="hmm... mungkin..."
                    autoFocus
                    className="mt-2 w-full border-2 border-[#790826] bg-white px-4 py-3 font-mono text-sm outline-none transition focus:shadow-[4px_5px_0_#b9d0ec]"
                  />
                  {giftMessage && <p className={`mt-3 font-mono text-xs font-bold ${giftMessage.startsWith("yes") ? "text-[#26734d]" : "text-[#ba3659]"}`} aria-live="polite">{giftMessage}</p>}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button type="submit" disabled={!giftGuess.trim()} className="flex-1 bg-[#790826] px-5 py-3 font-mono text-xs font-black text-white shadow-[4px_5px_0_#dca1b1] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40">unlock my gift →</button>
                    <button
                      type="button"
                      disabled={(clueLevel[activeGift] ?? 0) >= birthdayGifts[activeGift].clue.length}
                      onClick={() => setClueLevel((current) => ({ ...current, [activeGift]: Math.min((current[activeGift] ?? 0) + 1, birthdayGifts[activeGift].clue.length) }))}
                      className="border-2 border-[#29436d] bg-[#dce8f7] px-5 py-3 font-mono text-xs font-black text-[#29436d] transition hover:-translate-y-1 disabled:opacity-40"
                    >
                      {(clueLevel[activeGift] ?? 0) === 0 ? "give me a clue" : (clueLevel[activeGift] ?? 0) < 3 ? "another clue" : "no more clues"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="relative bg-[#790826] px-5 pb-6 pt-14 text-white md:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-3">
          <div className="flex items-center gap-5">
            <div className="w-28 rotate-[-8deg] rounded-md border-2 border-white bg-[#d98da4] p-3">
              <div className="grid h-12 place-items-center border border-[#790826] bg-[#fff4ed]"><span className="h-6 w-14 rounded-full border-2 border-[#790826]" /></div>
            </div>
            <div className="font-mono text-xs font-bold"><p>press play</p><p>for our song</p><p className="mt-3 text-lg">◀ ▶ ▶</p></div>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl italic">made with ♡<br />just for you.</p>
            <p className="mt-4 font-mono text-xs">happy birthday, ndut.<br />i love you endlessly.</p>
          </div>
          <Link href="#birthday-letter" className="mx-auto rotate-[5deg] bg-[#fff6e9] px-8 py-7 text-center font-serif text-lg italic text-[#3b1723] shadow-md transition hover:rotate-0">
            a message<br />for later ♡
          </Link>
        </div>
        <div className="mx-auto mt-14 flex max-w-7xl flex-col justify-between gap-5 border-t border-white/15 pt-5 text-center font-mono text-[10px] sm:flex-row">
          <p>© 2026 Luthfiandra. all rights reserved.</p>
          <nav className="flex flex-wrap justify-center gap-5">
            <Link href="/">home</Link><span>✦</span><Link href="/memories">our memories</Link><span>✦</span><Link href="/love-studio">for you</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function Doodle({ className, text }: { className: string; text: string }) {
  return <span className={`pointer-events-none absolute hidden text-5xl font-light md:block ${className}`} aria-hidden="true">{text}</span>;
}

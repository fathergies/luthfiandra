"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CarFront, Gamepad2, Heart, Home, Images, Mail, Palette } from "lucide-react";

const navItems = [
  { title: "Home", href: "/", number: "00", icon: Home },
  { title: "Memories", href: "/memories", number: "01", icon: Images },
  { title: "Love Studio", href: "/love-studio", number: "02", icon: Palette },
  { title: "Games", href: "/games", number: "03", icon: Gamepad2 },
  { title: "Garage", href: "/garage", number: "04", icon: CarFront },
  { title: "For You", href: "/for-you", number: "05", icon: Heart }
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (pathname === "/garage") return null;

  return (
    <>
    <header className="relative z-50 text-[#fff8ef]">
      <div className="relative overflow-hidden border-b border-white/15 bg-[#74102f]">
        <div className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:repeating-linear-gradient(120deg,transparent_0,transparent_18px,#fff_19px,#fff_20px)]" />
        <nav className="relative mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 md:h-[96px] md:px-8">
          <Link href="/" className="group flex items-center gap-3.5" aria-label="Luthfiandra home">
            <span className="relative grid h-12 w-12 rotate-[-4deg] place-items-center border border-white/70 bg-[#8d2140] shadow-[3px_3px_0_#e5a7b8] transition duration-300 group-hover:rotate-0">
              <span className="font-serif text-2xl font-black italic">L<span className="text-[#f2b6c5]">A</span></span>
              <i className="absolute -right-1.5 -top-2 text-lg not-italic text-[#f4bdca]">♡</i>
            </span>
            <span>
              <span className="block font-serif text-2xl font-black italic leading-none tracking-tight md:text-3xl">Luthfiandra</span>
              <span className="mt-0.5 hidden font-mono text-[7px] font-black uppercase tracking-[.28em] text-white/75 sm:block">something to remember me by</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <div className="text-right">
              <p className="font-serif text-sm italic text-[#f6ced8]">made by, Angie</p>
              <p className="mt-0.5 font-mono text-[7px] font-black uppercase tracking-[.25em] text-white/45">est. with a whole lot of love</p>
            </div>
            <span className="h-9 w-px bg-white/20" />
            <Link href="/for-you" className="group flex items-center gap-3 border border-white/60 bg-white px-4 py-2.5 text-[#74102f] shadow-[4px_4px_0_#d88ba1] transition hover:-translate-y-0.5 hover:shadow-[5px_6px_0_#d88ba1]">
              <Mail className="h-6 w-6 transition group-hover:rotate-12" strokeWidth={1.8} />
              <span>
                <span className="block font-mono text-[7px] font-black uppercase tracking-[.2em] opacity-55">special delivery</span>
                <span className="block font-serif text-sm font-black italic">open when you need me</span>
              </span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative grid h-11 w-11 place-items-center border border-white/55 bg-white/5 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <i className={`h-px w-full bg-white transition ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <i className={`h-px w-full bg-white transition ${menuOpen ? "opacity-0" : ""}`} />
              <i className={`h-px w-full bg-white transition ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>
      </div>

      <div className="hidden border-b-2 border-[#541024] bg-[#fff8ef] text-[#4a1a29] shadow-[0_5px_18px_rgba(71,20,38,.09)] lg:block">
        <nav className="mx-auto flex max-w-[1440px] items-stretch justify-center px-8" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex min-w-[145px] items-center justify-center gap-3 border-x border-[#71102e]/10 px-5 py-3.5 transition first:border-l-2 last:border-r-2 ${
                  active ? "bg-[#f1cad4] text-[#71102e]" : "hover:bg-[#f8e8e9]"
                }`}
              >
                <Icon className={`h-5 w-5 transition group-hover:-rotate-6 ${active ? "text-[#b9345a]" : "text-[#31547e]"}`} strokeWidth={1.8} />
                <span>
                  <span className="block font-mono text-[7px] font-black tracking-[.25em] text-[#9a6e7b]">{item.number}</span>
                  <span className="block font-serif text-[15px] font-black italic">{item.title}</span>
                </span>
                {active && <span className="absolute inset-x-5 bottom-0 h-[3px] bg-[#ad3155]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`absolute inset-x-0 top-full origin-top border-b-2 border-[#541024] bg-[#fff8ef] text-[#4a1a29] shadow-[0_18px_35px_rgba(54,12,29,.22)] transition duration-300 lg:hidden ${menuOpen ? "visible scale-y-100 opacity-100" : "invisible scale-y-95 opacity-0"}`}>
        <div className="mx-auto max-w-xl p-4 sm:p-6">
          <p className="mb-3 px-2 font-mono text-[8px] font-black uppercase tracking-[.3em] text-[#a43858]">choose your next little room</p>
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-[76px] items-center gap-3 border p-3 transition ${
                    active
                      ? "border-[#71102e] bg-[#f0c8d2] shadow-[3px_3px_0_#31547e]"
                      : "border-[#71102e]/25 bg-white hover:border-[#71102e]"
                  }`}
                >
                  <span className="grid h-9 w-9 place-items-center bg-[#e4edf8] text-[#31547e]"><Icon className="h-5 w-5" strokeWidth={1.8} /></span>
                  <span><small className="block font-mono text-[7px] font-black tracking-[.2em] text-[#9a6e7b]">{item.number}</small><b className="font-serif text-sm italic">{item.title}</b></span>
                  {active && <span className="absolute right-2 top-2 text-xs text-[#a62f52]">●</span>}
                </Link>
              );
            })}
          </nav>
          <Link href="/for-you" className="mt-3 flex items-center justify-center gap-2 bg-[#74102f] px-4 py-3 font-serif text-sm font-black italic text-white">
            <span>💌</span> open when you need me
          </Link>
        </div>
      </div>
    </header>
    </>
  );
}

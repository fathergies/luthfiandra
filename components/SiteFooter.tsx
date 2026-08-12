import Link from "next/link";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Love Studio", href: "/love-studio" },
  { label: "Games", href: "/games" },
  { label: "Garage", href: "/garage" },
  { label: "For You", href: "/for-you" }
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-[#4f1025] bg-[#6f0d2c] px-5 pb-6 pt-14 text-[#fff8ef] md:px-8 md:pt-16">
      <div className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:repeating-linear-gradient(120deg,transparent_0,transparent_22px,#fff_23px,#fff_24px)]" />
      <Sparkles className="pointer-events-none absolute left-[7%] top-12 h-8 w-8 rotate-[-12deg] text-[#e9a1b5]" strokeWidth={1.5} />
      <Heart className="pointer-events-none absolute right-[7%] top-10 h-9 w-9 rotate-12 text-[#e9a1b5]" strokeWidth={1.5} />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-end gap-10 border-b border-white/20 pb-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[.32em] text-[#efb4c4]">one little website · a thousand little memories</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-black italic leading-[.95] sm:text-5xl md:text-6xl">
              made with a whole lot of love, just for you.
            </h2>
            <p className="mt-5 max-w-xl font-mono text-[10px] leading-5 text-white/65 sm:text-xs">
              Happy birthday, Ndut. Come back whenever you want to remember how loved you are.
            </p>
          </div>

          <Link
            href="/for-you"
            className="group ml-auto flex w-full max-w-md items-center justify-between border border-white/55 bg-[#fff8ef] px-5 py-5 text-[#5b1027] shadow-[6px_7px_0_#d987a0] transition hover:-translate-y-1 hover:shadow-[8px_9px_0_#d987a0] sm:px-7"
          >
            <span>
              <span className="block font-mono text-[8px] font-black uppercase tracking-[.25em] text-[#ae3658]">special delivery</span>
              <span className="mt-1 block font-serif text-xl font-black italic sm:text-2xl">open when you need me</span>
            </span>
            <ArrowUpRight className="h-7 w-7 transition group-hover:rotate-12" strokeWidth={1.7} />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-6 lg:flex-row">
          <div className="text-center lg:text-left">
            <p className="font-serif text-xl font-black italic">Luthfiandra <span className="text-[#efa0b6]">♡</span></p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[.22em] text-white/45">made by Angie · 2026</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-3" aria-label="Footer navigation">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/70 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

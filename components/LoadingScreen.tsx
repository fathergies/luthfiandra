type LoadingScreenProps = {
  variant?: "love" | "garage";
  compact?: boolean;
};

export function LoadingScreen({ variant = "love", compact = false }: LoadingScreenProps) {
  if (variant === "garage") {
    return (
      <div className={`loading-stage loading-garage ${compact ? "h-full min-h-[420px]" : "fixed inset-0 z-[100] min-h-screen"}`} role="status" aria-live="polite">
        <div className="relative z-10 text-center">
          <div className="loading-garage-door mx-auto"><div className="loading-car"><span className="loading-car-window" /><span className="loading-wheel left-3" /><span className="loading-wheel right-3" /></div></div>
          <p className="mt-8 font-serif text-3xl font-black italic text-[#501426]">opening Andra&apos;s garage...</p>
          <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[.25em] text-[#31527e]">polishing the car · turning on the lights</p>
          <LoadingDots />
        </div>
      </div>
    );
  }
  return (
    <div className={`loading-stage bg-[#fff8ef] ${compact ? "min-h-[360px]" : "fixed inset-0 z-[100] min-h-screen"}`} role="status" aria-live="polite">
      <span className="loading-spark left-[18%] top-[24%]">✦</span><span className="loading-spark loading-spark-delay right-[20%] top-[31%]">♡</span>
      <div className="relative z-10 text-center">
        <div className="loading-envelope mx-auto"><span className="loading-letter">a tiny<br />piece of love ♡</span><span className="loading-envelope-flap" /><span className="loading-heart-seal">♡</span></div>
        <p className="mt-10 font-serif text-3xl font-black italic text-[#501426]">getting something lovely ready...</p>
        <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[.27em] text-[#a93658]">made slowly · loaded lovingly</p><LoadingDots />
      </div>
    </div>
  );
}

function LoadingDots() { return <div className="loading-dots mt-5 flex justify-center gap-2" aria-hidden="true"><i /><i /><i /></div>; }

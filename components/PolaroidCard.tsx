import { cn } from "@/lib/utils";

type PolaroidCardProps = {
  title: string;
  caption: string;
  tone?: "pink" | "blue" | "cream";
  className?: string;
};

const toneClasses = {
  pink: "from-blush-100 to-blush-300",
  blue: "from-skysoft-100 to-skysoft-300",
  cream: "from-cream to-blush-100"
};

export function PolaroidCard({ title, caption, tone = "pink", className }: PolaroidCardProps) {
  return (
    <figure className={cn("rotate-[-1deg] rounded-lg bg-white p-3 shadow-soft", className)}>
      <div className={cn("aspect-[4/3] rounded-md bg-gradient-to-br", toneClasses[tone])} />
      <figcaption className="px-2 pb-2 pt-4">
        <h3 className="font-serif text-2xl font-semibold text-navy">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-ink/70">{caption}</p>
      </figcaption>
    </figure>
  );
}

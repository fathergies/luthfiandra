import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionTitleProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blush-300">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 font-serif text-4xl font-semibold text-navy md:text-5xl">{title}</h1>
      {description ? <p className="mt-4 text-base leading-8 text-ink/72">{description}</p> : null}
    </div>
  );
}

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import type { PlaceholderPage as PlaceholderPageData } from "@/data/placeholders";

type PlaceholderPageProps = {
  page?: PlaceholderPageData;
};

const fallbackPage: PlaceholderPageData = {
  route: "/",
  eyebrow: "Placeholder",
  title: "Room in progress",
  description: "This page is ready for future content.",
  notes: ["Layout", "Navigation", "Sample data"]
};

export function PlaceholderPage({ page = fallbackPage }: PlaceholderPageProps) {
  return (
    <PageContainer>
      <section className="grid min-h-[calc(100vh-8rem)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle eyebrow={page.eyebrow} title={page.title} description={page.description} />

        <Card className="overflow-hidden p-0">
          <div className="h-3 bg-gradient-to-r from-skysoft-200 via-blush-200 to-cream" />
          <div className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush-300">
              Reserved for
            </p>
            <div className="mt-5 grid gap-3">
              {page.notes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl border border-white/75 bg-white/60 px-4 py-3 text-sm font-medium text-ink/75"
                >
                  {note}
                </div>
              ))}
            </div>
            <Button href="/" variant="secondary" className="mt-7">
              Back Home
            </Button>
          </div>
        </Card>
      </section>
    </PageContainer>
  );
}

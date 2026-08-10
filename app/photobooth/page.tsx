import { PlaceholderPage } from "@/components/PlaceholderPage";
import { placeholderPages } from "@/data/placeholders";

const page = placeholderPages.find((item) => item.route === "/photobooth");

export default function PhotoboothPage() {
  return <PlaceholderPage page={page} />;
}

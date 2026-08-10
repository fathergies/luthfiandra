import type { ReactNode } from "react";
import { Button } from "@/components/Button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose?: () => void;
};

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-soft border border-white/75 bg-cream p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-3xl font-semibold text-navy">{title}</h2>
          {onClose ? (
            <Button type="button" variant="ghost" onClick={onClose} className="min-h-9 px-3">
              Close
            </Button>
          ) : null}
        </div>
        <div className="mt-5 text-ink/75">{children}</div>
      </div>
    </div>
  );
}

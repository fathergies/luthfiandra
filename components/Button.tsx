import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white shadow-soft hover:-translate-y-0.5 hover:bg-ink",
  secondary:
    "border border-blush-200 bg-white/75 text-navy shadow-blush hover:-translate-y-0.5 hover:bg-blush-50",
  ghost: "bg-transparent text-navy hover:bg-white/60"
};

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type LinkButtonProps = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, className, variant = "primary" } = props;
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blush-300 focus:ring-offset-2 focus:ring-offset-cream",
    variantClasses[variant],
    className
  );

  if ("href" in props && props.href) {
    const { children: linkChildren, className: _className, variant: _variant, ...linkProps } = props;
    return (
      <Link className={classes} {...linkProps}>
        {linkChildren}
      </Link>
    );
  }

  const { children: buttonChildren, className: _className, variant: _variant, ...buttonProps } =
    props as NativeButtonProps;

  return (
    <button className={classes} {...buttonProps}>
      {buttonChildren}
    </button>
  );
}

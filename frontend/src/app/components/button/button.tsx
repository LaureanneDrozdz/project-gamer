"use client";
import Link from "next/link";

type ButtonProps = {
  datatestid?: string;
  label: string;
  href?: string;
  variant?: "primary" | "cta" | "white";
  className?: string;
};

const Button = ({
  datatestid,
  label,
  href,
  variant = "primary",
  className,
}: ButtonProps) => {
  const baseStyle = `
    px-4 py-2 rounded transition
    transform duration-200 ease-in-out
    hover:-translate-y-0.5 hover:shadow-lg
  `;

  const variants = {
    primary: "bg-secondary text-blanc hover:bg-secondary/90",
    cta: "px-6 py-2 rounded-full font-semibold bg-cta text-noir hover:bg-cta/10 border-2 border-solid border-cta transition hover:text-cta shadow-[0px_4px_4px_rgba(0,0,0,0.25)]",
    white: "bg-blanc text-cta hover:bg-blanc/90",
  };

  return (
    <button data-testid={datatestid} className={`${baseStyle} ${variants[variant]} ${className || ""}`}>
      <Link href={href || "#"}>{label}</Link>
    </button>
  );
};

export default Button;

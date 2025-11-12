'use client';
import Link from 'next/link';

type ButtonProps = {
  label: string;
  href?: string;
  variant?: 'primary' | 'cta' | 'white';
  className?: string;
};

const Button = ({
  label,
  href,
  variant = 'primary',
  className,
}: ButtonProps) => {
  const baseStyle = `
    text-center
    min-h-[48px] min-w-[72px]
    px-6 py-3 lg:px-4 lg:py-2 rounded transition
    transform duration-200 ease-in-out
    hover:-translate-y-0.5 hover:shadow-lg
  `;

  const variants = {
    primary: 'bg-secondary hover:bg-secondary/90',
    cta: 'rounded-full font-semibold bg-cta text-noir hover:bg-cta/10 border-2 border-solid border-cta transition hover:text-cta shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
    white:
      'px-6 py-2 font-semibold rounded-full text-cta hover:bg-cta hover:text-white border-2 border-solid border-cta transition',
  };

  return (
    <Link
      href={href || '#'}
      className={`${baseStyle} ${variants[variant]} ${className || ''}`}
      aria-label={label}
    >
      {label}
    </Link>
  );
};

export default Button;

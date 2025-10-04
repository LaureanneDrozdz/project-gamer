const COLOR_MAP: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  cta: 'text-cta',
};

export default function StatsCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const textColorClass = COLOR_MAP[color] || COLOR_MAP['primary'];

  return (
    <div
      className={`flex-1 min-w-[120px] rounded-lg p-4 flex flex-col items-center`}
      aria-label={label}
    >
      <span
        className={`text-2xl font-bold ${textColorClass}`}
        aria-label={`Nombre de ${label}`}
      >
        {value}
      </span>
      <span className="text-sm text-noir/70" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}

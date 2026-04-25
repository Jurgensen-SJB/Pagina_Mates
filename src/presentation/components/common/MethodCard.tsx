'use client';

import Link from 'next/link';

interface MethodCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  index?: number;
}

const categoryRoutes: Record<string, string> = {
  'root-finding': '/root-finding',
  'integration': '/integration',
  'interpolation': '/interpolation',
};

const categoryColors: Record<string, string> = {
  'root-finding': '#6366f1',
  'integration': '#06b6d4',
  'interpolation': '#8b5cf6',
};

export default function MethodCard({ id, name, category, description, icon, index = 0 }: MethodCardProps) {
  const href = `${categoryRoutes[category] || ''}/${id}`;
  const color = categoryColors[category] || '#6366f1';

  return (
    <Link href={href} className="block group" style={{ animationDelay: `${index * 0.06}s` }}>
      <div
        className="glass-card p-5 h-full flex flex-col gap-3 animate-fadeInUp opacity-0"
        style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'forwards' }}
      >
        {/* Icon + Category Badge */}
        <div className="flex items-center justify-between">
          <span className="text-2xl">{icon || '📐'}</span>
          <span className="badge" style={{
            background: `${color}20`,
            color: color,
          }}>
            {category === 'root-finding' ? 'Raíces' :
             category === 'integration' ? 'Integración' : 'Interpolación'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold group-hover:text-[var(--primary-light)] transition-colors"
          style={{ color: 'var(--text-primary)' }}>
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="flex items-center gap-1 text-xs font-medium transition-all duration-200 group-hover:gap-2"
          style={{ color: color }}>
          Calcular
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5-5-5-5" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

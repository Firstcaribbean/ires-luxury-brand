"use client";

import { useEffect, useState } from "react";

import {
  getBrandSettings,
  getDefaultBrandSettings,
  subscribeToBrandSettings,
  type BrandSettings,
} from "@/lib/brand/repository";

type BrandLogoProps = {
  compact?: boolean;
  hero?: boolean;
};

export function BrandLogo({ compact = false, hero = false }: BrandLogoProps) {
  const [settings, setSettings] = useState<BrandSettings>(getDefaultBrandSettings());

  useEffect(() => {
    async function load() {
      const nextSettings = await getBrandSettings();
      setSettings(nextSettings);
    }

    void load();
    return subscribeToBrandSettings(() => {
      void load();
    });
  }, []);

  const iconSize = hero ? "h-24 w-24 sm:h-28 sm:w-28" : compact ? "h-12 w-12" : "h-16 w-16";
  const titleSize = hero
    ? "text-4xl sm:text-5xl"
    : compact
      ? "text-lg"
      : "text-2xl";
  const scriptSize = hero
    ? "text-4xl sm:text-6xl"
    : compact
      ? "text-2xl"
      : "text-4xl";

  return (
    <div className="flex items-center gap-4">
      <div className={`relative shrink-0 ${iconSize}`}>
        {settings.logoImageUrl ? (
          <img
            src={settings.logoImageUrl}
            alt={settings.brandName}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <svg
            viewBox="0 0 120 120"
            aria-hidden="true"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="brandAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff1f8f" />
                <stop offset="100%" stopColor="#ff5fb1" />
              </linearGradient>
            </defs>
            <path
              d="M25 88C6 72 2 45 18 26C31 10 57 6 82 14C92 17 101 23 107 31"
              fill="none"
              stroke="url(#brandAccent)"
              strokeLinecap="round"
              strokeWidth="10"
            />
            <path
              d="M69 14V2H85V14"
              fill="none"
              stroke="url(#brandAccent)"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <rect
              x="60"
              y="0"
              width="26"
              height="20"
              rx="4"
              fill="url(#brandAccent)"
            />
            <circle cx="69" cy="9" r="4" fill="#ffe4f0" />
            <path
              d="M47 77C57 59 70 47 90 43"
              fill="none"
              stroke="url(#brandAccent)"
              strokeLinecap="round"
              strokeWidth="8"
            />
          </svg>
        )}
      </div>

      <div className="leading-none">
        <p className={`${titleSize} font-black uppercase tracking-[0.08em] text-[color:var(--color-gold-strong)]`}>
          {settings.brandMark}
        </p>
        <p className={`brand-script ${scriptSize} text-[color:var(--color-gold-soft)]`}>
          {settings.brandScript}
        </p>
        {!compact ? (
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--color-muted-soft)]">
            {settings.brandName}
          </p>
        ) : null}
      </div>
    </div>
  );
}

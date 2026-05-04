import React from "react";

export interface StatCard {
  title?: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant: "info" | "warning" | "success" | "primary" | "destructive" | "purple";
}

type StatsLayout = "inline" | "mini" | "topbar";

interface StatsCardsProps {
  stats: StatCard[];
  layout?: StatsLayout;
  className?: string;
}

export function StatsCards({
  stats,
  layout = "mini",
  className = "",
}: StatsCardsProps) {
  const getVariantClasses = (variant: StatCard["variant"]) => {
    switch (variant) {
      case "info":
        return {
          icon: "bg-blue-50 text-blue-600",
          accent: "border-blue-200",
        };
      case "warning":
        return {
          icon: "bg-amber-50 text-amber-600",
          accent: "border-amber-200",
        };
      case "success":
        return {
          icon: "bg-emerald-50 text-emerald-600",
          accent: "border-emerald-200",
        };
      case "primary":
        return {
          icon: "bg-orange-50 text-[var(--staff-primary)]",
          accent: "border-orange-200",
        };
      case "destructive":
        return {
          icon: "bg-rose-50 text-rose-600",
          accent: "border-rose-200",
        };
      case "purple":
        return {
          icon: "bg-violet-50 text-violet-600",
          accent: "border-violet-200",
        };
      default:
        return {
          icon: "bg-blue-50 text-blue-600",
          accent: "border-blue-200",
        };
    }
  };

  const containerClass =
    layout === "inline"
      ? "flex flex-wrap items-stretch gap-2"
      : layout === "topbar"
        ? "grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-stretch"
        : "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const itemClass =
    layout === "inline"
      ? "inline-flex min-w-[170px] flex-1 items-center gap-2 px-3 py-2"
      : layout === "topbar"
        ? "flex items-center gap-2 px-3 py-2"
        : "flex items-center justify-between gap-3 px-3 py-2.5";

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`rounded-sm border bg-[var(--staff-surface)] border-[var(--staff-border)] ${getVariantClasses(stat.variant).accent} ${itemClass}`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${getVariantClasses(stat.variant).icon} [&_svg]:h-4 [&_svg]:w-4`}
          >
            {stat.icon}
          </div>

          <div className="min-w-0 flex-1">
            {stat.title && (
              <p className="truncate text-sm font-medium staff-text-secondary">
                {stat.title}
              </p>
            )}

            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold leading-tight staff-text-primary">
                {stat.value}
              </p>
              {stat.title && (
                <span className="sr-only">
                  {stat.title}: {stat.value}
                </span>
              )}
            </div>

            {stat.subtitle && layout !== "inline" && (
              <p className="mt-0.5 truncate text-sm staff-text-secondary">
                {stat.subtitle}
              </p>
            )}
          </div>

          {stat.subtitle && layout === "inline" && (
            <p className="hidden truncate text-sm staff-text-secondary lg:block">
              {stat.subtitle}
            </p>
          )}

          {layout === "mini" && (
            <div className="ml-2 hidden items-center lg:flex">
              <span className="h-6 w-px bg-[var(--staff-border)]" aria-hidden />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

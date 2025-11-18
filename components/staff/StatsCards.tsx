import React from "react";

export interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant: "info" | "warning" | "success" | "primary";
}

interface StatsCardsProps {
  stats: StatCard[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  const getVariantClass = (variant: StatCard["variant"]) => {
    switch (variant) {
      case "info":
        return "staff-stat-info";
      case "warning":
        return "staff-stat-secondary";
      case "success":
        return "staff-stat-success";
      case "primary":
        return "staff-stat-primary";
      default:
        return "staff-stat-info";
    }
  };

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${stats.length}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`staff-card ${getVariantClass(stat.variant)} p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium staff-text-secondary">
                {stat.title}
              </p>
              <p className="text-3xl font-bold staff-text-primary">
                {stat.value}
              </p>
            </div>
            <div className="stat-icon">{stat.icon}</div>
          </div>
          {stat.subtitle && (
            <p className="mt-2 text-sm staff-text-secondary">{stat.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}

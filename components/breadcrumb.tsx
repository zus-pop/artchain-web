"use client";

import Link from "next/link";
import { IconChevronRight, IconHome } from "@tabler/icons-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  homeHref?: string;
}

export function Breadcrumb({
  items,
  className = "",
  homeHref = "/dashboard",
}: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
    >
      <Link
        href={homeHref}
        className="flex items-center hover:text-gray-900 transition-colors"
      >
        <IconHome className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <IconChevronRight className="h-4 w-4 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

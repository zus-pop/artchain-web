"use client";

import { IconSettings } from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

export function NavSettings() {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <IconSettings className="size-4" />
              <span>{t.settings}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
            <DropdownMenuItem
              onClick={() => setLanguage("vi")}
              className={currentLanguage === "vi" ? "bg-accent" : ""}
            >
              Tiếng Việt
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("en")}
              className={currentLanguage === "en" ? "bg-accent" : ""}
            >
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const themes = [
  { value: "light", icon: Sun, label: "Light mode" },
  { value: "system", icon: Monitor, label: "System mode" },
  { value: "dark", icon: Moon, label: "Dark mode" },
] as const;

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  // Evita problemas de hidratação renderizando apenas após o mount
  if (!mounted) {
    return (
      <div className="flex items-center rounded-full border border-border bg-background p-1">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 text-muted-foreground"
            aria-label={label}
          >
            <Icon className="h-3 w-3" />
          </button>
        ))}
      </div>
    );
  }

  // Garante que temos um valor válido para o tema
  const currentTheme = theme || "system";

  return (
    <div className="flex items-center rounded-full border border-border bg-background p-1">
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = currentTheme === value;

        return (
          <button
            key={value}
            onClick={() => handleThemeChange(value)}
            className={cn(
              "cursor-pointer flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={label}
          >
            <Icon className="h-3 w-3" />
          </button>
        );
      })}
    </div>
  );
}

"use client";

import NProgress from "nprogress";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationItem,
  SidebarHeaderProps,
  SidebarFooterProps,
  APP_INFO,
  FOOTER_INFO,
  NAVIGATION_ITEMS,
} from "./static/sidebar-constants";
import { useEffect } from "react";
import Image from "next/image";

// Types and interfaces
interface DashboardSidebarProps {
  readonly className?: string;
}

// Utility functions
const isActiveRoute = (pathname: string, item: NavigationItem): boolean => {
  if (item.matchPattern) {
    return pathname.startsWith(item.matchPattern);
  }
  return pathname === item.href;
};

// Components
const SidebarHeaderComponent: React.FC<SidebarHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
}) => (
  <SidebarHeader>

    <div className="flex items-center justify-center gap-2 px-4 py-2 pb-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Image src="/logo-2.svg" alt="Space Phone" width={18} height={18} />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold mt-1">{title}</span>
        <span className="truncate text-xs text-muted-foreground">
          {subtitle}
        </span>
      </div>
      {/* <Image src="/logo-light.svg" alt="Space Phone" width={133.17} height={31.89} /> */}
    </div>
  </SidebarHeader>
);

const SidebarFooterComponent: React.FC<SidebarFooterProps> = ({ label }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleProfileClick = () => {
    router.push("/dashboard/perfil");
  };

  const isProfileActive = pathname === "/dashboard/perfil";

  return (
    <SidebarFooter>
      <div className="flex items-center justify-between px-2 py-2 pb-3">
        <span className="text-sm font-normal text-sidebar-foreground ml-2">
          {label}
        </span>
        <ModeToggle />
      </div>

      <div className="px-2 pb-2 ">
        <button
          onClick={handleProfileClick}
          className={`flex flex-row p-2 border items-center gap-2 w-full rounded-lg transition-colors cursor-pointer ${isProfileActive
            ? "border-primary text-primary"
            : "border-zinc-100 dark:border-zinc-900 hover:text-accent-foreground dark:hover:bg-background"
            }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            JS
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-semibold truncate">Lucas Bueno</div>
            <div className="text-xs text-foreground truncate">
              lucxsbueno@gmail.com
            </div>
          </div>
        </button>
      </div>
    </SidebarFooter>
  );
};

const NavigationMenu: React.FC<{
  readonly items: readonly NavigationItem[];
  readonly pathname: string;
  readonly onNavigate: (href: string) => void;
}> = ({ items, pathname, onNavigate }) => {
  const router = useRouter();

  const handleNavigation = (href: string, section: string) => {
    NProgress.start();
    router.push(href);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="px-2">
          {items.map((item) => (
            <SidebarMenuItem
              key={item.href}
              onClick={() =>
                handleNavigation(
                  item.href,
                  item.href.split("/").pop() || "dashboard"
                )
              }
            >
              <div
                className={`relative ${isActiveRoute(pathname, item) ? "p-[1.6px]" : ""
                  }`}
              >
                {isActiveRoute(pathname, item) && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary to-rose-500" />
                )}
                <SidebarMenuButton
                  onClick={() => onNavigate(item.href)}
                  isActive={isActiveRoute(pathname, item)}
                  className={`cursor-pointer p-3 py-4 rounded-3xl hover:bg-background active:bg-background active:text-primary  hover:text-primary font-medium relative ${isActiveRoute(pathname, item)
                    ? "text-primary"
                    : "border-2 border-white hover:border-background dark:border-sidebar"
                    }`}
                  style={
                    isActiveRoute(pathname, item)
                      ? {
                        backgroundColor: "var(--sidebar)",
                      }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-4 w-4 ${isActiveRoute(pathname, item) ? "text-primary" : ""
                        }`}
                    />
                    <span
                      className={
                        isActiveRoute(pathname, item)
                          ? "text-primary font-semibold"
                          : ""
                      }
                    >
                      {item.title}
                    </span>
                  </div>
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

// Main component
export const DashboardSidebar: React.FC<DashboardSidebarProps> = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  const handleNavigation = (href: string): void => {
    router.push(href);
  };

  return (
    <Sidebar>
      <SidebarHeaderComponent {...APP_INFO} />
      <SidebarContent>
        <NavigationMenu
          items={NAVIGATION_ITEMS}
          pathname={pathname}
          onNavigate={handleNavigation}
        />
      </SidebarContent>
      <SidebarFooterComponent {...FOOTER_INFO} />
    </Sidebar>
  );
};

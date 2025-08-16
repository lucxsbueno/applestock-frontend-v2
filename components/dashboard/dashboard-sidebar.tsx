"use client";

import NProgress from "nprogress";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationItem,
  NavigationCategory,
  SidebarHeaderProps,
  SidebarFooterProps,
  APP_INFO,
  FOOTER_INFO,
  NAVIGATION_CATEGORIES,
} from "./static/sidebar-constants";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";

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
    <div className="flex items-center justify-center gap-2 px-3 py-2 pb-0">
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

      <div className="px-2 pb-2">
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
  readonly categories: readonly NavigationCategory[];
  readonly pathname: string;
  readonly onNavigate: (href: string) => void;
}> = ({ categories, pathname, onNavigate }) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Expande automaticamente itens que tenham subitens ativos
  useEffect(() => {
    const newExpandedItems = new Set<string>();
    
    categories.forEach(category => {
      category.items.forEach(item => {
        if (item.subItems) {
          const hasActiveSubItem = item.subItems.some(subItem => 
            isActiveRoute(pathname, subItem)
          );
          if (hasActiveSubItem) {
            newExpandedItems.add(item.title);
          }
        }
      });
    });
    
    setExpandedItems(newExpandedItems);
  }, [pathname, categories]);

  const handleNavigation = (href: string, section: string) => {
    NProgress.start();
    router.push(href);
  };

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemTitle)) {
        newSet.delete(itemTitle);
      } else {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (isActiveRoute(pathname, item)) {
      return true;
    }
    // Verifica se algum subitem está ativo
    if (item.subItems) {
      return item.subItems.some(subItem => isActiveRoute(pathname, subItem));
    }
    return false;
  };

  const renderMenuItem = (item: NavigationItem, isSubItem: boolean = false) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.has(item.title);
    const isActive = isItemActive(item);

    return (
      <div key={item.href}>
        <SidebarMenuItem
          onClick={() => {
            // Se tem subitens, apenas expande/colapsa; se não, navega
            if (hasSubItems) {
              toggleExpanded(item.title);
            } else {
              handleNavigation(
                item.href,
                item.href.split("/").pop() || "dashboard"
              );
            }
          }}
          className="px-1"
        >
          <SidebarMenuButton
            isActive={isActive}
            className={`cursor-pointer px-2 py-4 rounded-3xl hover:bg-background hover:text-primary font-medium relative ${
              isActive
                ? "!bg-background active:text-primary"
                : ""
            } ${isSubItem ? "ml-2" : ""}`}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
              />
              <span
                className={
                  isActive
                    ? "text-primary font-semibold"
                    : ""
                }
              >
                {item.title}
              </span>

              {isActive && !hasSubItems && (
                <span className="absolute w-1 h-1 bg-blue-500 rounded-full right-5"></span>
              )}

              {hasSubItems && (
                <div 
                  className="absolute right-4"
                >
                  {isExpanded ? (
                    <ChevronDown className={`h-3 w-3 ${isActive ? "text-primary" : ""}`} />
                  ) : (
                    <ChevronRight className={`h-3 w-3 ${isActive ? "text-primary" : ""}`} />
                  )}
                </div>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Renderiza subitens se o item estiver expandido */}
        {hasSubItems && isExpanded && (
          <div className="ml-2 mr-2">
            {item.subItems!.map((subItem) => renderMenuItem(subItem, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {categories.map((category) => (
        <SidebarGroup key={category.label}>
          <SidebarGroupContent>
            <SidebarGroupLabel className="px-3">{category.label}</SidebarGroupLabel>
            <SidebarMenu className="">
              {category.items.map((item) => renderMenuItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
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
      <SidebarContent className="gap-0">
        <NavigationMenu
          categories={NAVIGATION_CATEGORIES}
          pathname={pathname}
          onNavigate={handleNavigation}
        />
      </SidebarContent>
      <SidebarFooterComponent {...FOOTER_INFO} />
    </Sidebar>
  );
};

"use client";

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
    <div className="flex items-center gap-2 px-2 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold mt-1">{title}</span>
        <span className="truncate text-xs text-muted-foreground">
          {subtitle}
        </span>
      </div>
    </div>
  </SidebarHeader>
);

const SidebarFooterComponent: React.FC<SidebarFooterProps> = ({ label }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  const isProfileActive = pathname === "/dashboard/profile";

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
          className={`flex flex-row p-2 border items-center gap-2 w-full rounded-lg transition-colors cursor-pointer ${
            isProfileActive
              ? "border-primary text-primary"
              : "border-accent hover:text-accent-foreground"
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
}> = ({ items, pathname, onNavigate }) => (
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu className="px-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              onClick={() => onNavigate(item.href)}
              isActive={isActiveRoute(pathname, item)}
              className="cursor-pointer transition-colors px-4 !py-5 rounded-3xl duration-200 hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

// Main component
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  className,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string): void => {
    router.push(href);
  };

  return (
    <Sidebar className="!border-0 shadow-none">
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

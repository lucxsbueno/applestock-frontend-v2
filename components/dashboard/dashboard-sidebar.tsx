"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Truck,
  Settings,
  BarChart3,
  Package2,
  Users,
  DollarSign,
  Globe,
} from "lucide-react";
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

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Meu estoque",
    icon: Package,
    href: "/dashboard/estoque",
  },
  {
    title: "Estoque global",
    icon: Globe,
    href: "/dashboard/estoque-global",
  },
  {
    title: "Fornecedores",
    icon: Users,
    href: "/dashboard/fornecedores",
    matchPattern: "/dashboard/fornecedores",
  },
  {
    title: "Pedidos",
    icon: ShoppingCart,
    href: "/dashboard/pedidos",
  },
  {
    title: "Entregas",
    icon: Truck,
    href: "/dashboard/entregas",
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    href: "/dashboard/financeiro",
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/dashboard/configuracoes",
  },
];

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (item: (typeof navigationItems)[0]) => {
    if (item.matchPattern) {
      return pathname.startsWith(item.matchPattern);
    }

    return pathname === item.href;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package2 className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold mt-1">AppleStock</span>
            <span className="truncate text-xs text-muted-foreground">
              Gerenciador de Estoque
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.href)}
                    isActive={isActive(item)}
                    className="cursor-pointer transition-colors px-4 !py-5 rounded-3xl duration-200 hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-normal text-sidebar-foreground">
            Mode
          </span>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

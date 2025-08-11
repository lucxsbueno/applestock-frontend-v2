import {
  Package,
  ShoppingCart,
  Truck,
  Settings,
  BarChart3,
  Package2,
  DollarSign,
  Globe,
  LucideIcon,
  HelpCircle,
  Handshake,
  Phone,
  Smartphone,
} from "lucide-react";

// Types and interfaces
export interface NavigationItem {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly href: string;
  readonly matchPattern?: string;
}

export interface SidebarHeaderProps {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: LucideIcon;
}

export interface SidebarFooterProps {
  readonly label: string;
}

// Constants
export const APP_INFO: SidebarHeaderProps = {
  title: "Space Phone",
  subtitle: "Gerenciador de Estoque",
  icon: Package2,
} as const;

export const FOOTER_INFO: SidebarFooterProps = {
  label: "Mode",
} as const;

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Estoque",
    icon: Package,
    href: "/dashboard/estoque",
    matchPattern: "/dashboard/estoque",
  },
  {
    title: "Estoque global",
    icon: Globe,
    href: "/dashboard/estoque-global",
  },
  {
    title: "Fornecedores",
    icon: Handshake,
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
  {
    title: "Ajuda",
    icon: HelpCircle,
    href: "/dashboard/ajuda",
  },
] as const;

import {
  Package,
  ShoppingCart,
  Truck,
  Settings,
  BarChart3,
  Package2,
  DollarSign,
  LucideIcon,
  HelpCircle,
  Handshake,
  Phone,
  Smartphone,
  Building2,
  TrendingUp,
  Users,
  FileText,
  MapPin,
  Shield,
  Laptop,
} from "lucide-react";

// Types and interfaces
export interface NavigationItem {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly href: string;
  readonly matchPattern?: string;
  readonly subItems?: readonly NavigationItem[];
}

export interface NavigationCategory {
  readonly label: string;
  readonly items: readonly NavigationItem[];
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

export const NAVIGATION_CATEGORIES: readonly NavigationCategory[] = [
  {
    label: "Visão Geral",
    items: [
      {
        title: "Dashboard",
        icon: BarChart3,
        href: "/dashboard",
      },
      {
        title: "Relatórios",
        icon: BarChart3,
        href: "/dashboard/relatorios",
        matchPattern: "/dashboard/relatorios",
        subItems: [
          {
            title: "Vendas",
            icon: TrendingUp,
            href: "/dashboard/relatorios/vendas",
            matchPattern: "/dashboard/relatorios/vendas",
          },
          {
            title: "Estoque",
            icon: Package,
            href: "/dashboard/relatorios/estoque",
            matchPattern: "/dashboard/relatorios/estoque",
          },
          {
            title: "Financeiro",
            icon: DollarSign,
            href: "/dashboard/relatorios/financeiro",
            matchPattern: "/dashboard/relatorios/financeiro",
          },
        ],
      },
    ],
  },
  {
    label: "Gestão de Estoque",
    items: [
      {
        title: "Estoque",
        icon: Package2,
        href: "/dashboard/estoque",
        matchPattern: "/dashboard/estoque",
      },
      {
        title: "Fornecedores",
        icon: Handshake,
        href: "/dashboard/fornecedores",
        matchPattern: "/dashboard/fornecedores",
      },
    ],
  },
  {
    label: "Comercial",
    items: [
      {
        title: "Vendas",
        icon: ShoppingCart,
        href: "/dashboard/vendas",
        matchPattern: "/dashboard/vendas",
        subItems: [
          {
            title: "Pedidos",
            icon: ShoppingCart,
            href: "/dashboard/pedidos",
            matchPattern: "/dashboard/pedidos",
          },
          {
            title: "Clientes",
            icon: Users,
            href: "/dashboard/vendas/clientes",
            matchPattern: "/dashboard/vendas/clientes",
          },
        ],
      },
      {
        title: "Equipe",
        icon: Users,
        href: "/dashboard/equipe",
        matchPattern: "/dashboard/equipe",
        subItems: [
          {
            title: "Perfis e Acessos",
            icon: Users,
            href: "/dashboard/equipe/perfis-e-acessos",
            matchPattern: "/dashboard/equipe/perfis-e-acessos",
          }
        ],
      },
    ],
  },
  {
    label: "Logística",
    items: [
      {
        title: "Entregas",
        icon: Truck,
        href: "/dashboard/entregas",
        matchPattern: "/dashboard/entregas",
        subItems: [
          {
            title: "Rastreamento",
            icon: Truck,
            href: "/dashboard/entregas/rastreamento",
            matchPattern: "/dashboard/entregas/rastreamento",
          },
          {
            title: "Rotas",
            icon: MapPin,
            href: "/dashboard/entregas/rotas",
            matchPattern: "/dashboard/entregas/rotas",
          },
        ],
      },
      {
        title: "Compras",
        icon: Package,
        href: "/dashboard/compras",
        matchPattern: "/dashboard/compras",
        subItems: [
          {
            title: "Solicitações",
            icon: FileText,
            href: "/dashboard/compras/solicitacoes",
            matchPattern: "/dashboard/compras/solicitacoes",
          },
          {
            title: "Cotações",
            icon: DollarSign,
            href: "/dashboard/compras/cotacoes",
            matchPattern: "/dashboard/compras/cotacoes",
          },
        ],
      },
    ],
  },
  {
    label: "Administração",
    items: [
      {
        title: "Financeiro",
        icon: DollarSign,
        href: "/dashboard/financeiro",
        matchPattern: "/dashboard/financeiro",
        subItems: [
          {
            title: "Contas a Pagar",
            icon: DollarSign,
            href: "/dashboard/financeiro/contas-pagar",
            matchPattern: "/dashboard/financeiro/contas-pagar",
          },
          {
            title: "Contas a Receber",
            icon: DollarSign,
            href: "/dashboard/financeiro/contas-receber",
            matchPattern: "/dashboard/financeiro/contas-receber",
          },
          {
            title: "Fluxo de Caixa",
            icon: TrendingUp,
            href: "/dashboard/financeiro/fluxo-caixa",
            matchPattern: "/dashboard/financeiro/fluxo-caixa",
          },
        ],
      },
      {
        title: "Configurações",
        icon: Settings,
        href: "/dashboard/configuracoes",
        matchPattern: "/dashboard/configuracoes",
        subItems: [
          {
            title: "Usuários",
            icon: Users,
            href: "/dashboard/configuracoes/usuarios",
            matchPattern: "/dashboard/configuracoes/usuarios",
          },
          {
            title: "Perfis",
            icon: Shield,
            href: "/dashboard/configuracoes/perfis",
            matchPattern: "/dashboard/configuracoes/perfis",
          },
          {
            title: "Sistema",
            icon: Settings,
            href: "/dashboard/configuracoes/sistema",
            matchPattern: "/dashboard/configuracoes/sistema",
          },
        ],
      },
      {
        title: "Ajuda",
        icon: HelpCircle,
        href: "/dashboard/ajuda",
        matchPattern: "/dashboard/ajuda",
        subItems: [
          {
            title: "Documentação",
            icon: FileText,
            href: "/dashboard/ajuda/documentacao",
            matchPattern: "/dashboard/ajuda/documentacao",
          },
          {
            title: "Suporte",
            icon: HelpCircle,
            href: "/dashboard/ajuda/suporte",
            matchPattern: "/dashboard/ajuda/suporte",
          },
        ],
      },
    ],
  },
] as const;

// Mantém compatibilidade com código existente
export const NAVIGATION_ITEMS: readonly NavigationItem[] = NAVIGATION_CATEGORIES.flatMap(category => category.items);

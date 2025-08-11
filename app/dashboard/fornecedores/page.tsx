"use client";

import { useState } from "react";

import { MainSectionLayout } from "@/components/main-section-layout";

import {
  Plus,
  Edit,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Pin,
  PinOff,
  Eye,
  Mail,
  Package,
  Calendar,
  MoreVertical,
  Star,
  Building2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Supplier = {
  id: string;
  name: string;
  email: string;
  lastUpdate: string;
  productsCount: number;
  status: "active" | "inactive";
  pinned?: boolean;
  phone?: string;
  website?: string;
  location?: string;
};

const suppliers: Supplier[] = [
  {
    id: "45",
    name: "BCR Imports",
    email: "bcrimports@gmail.com.br",
    lastUpdate: "2025-03-23T15:30:00",
    productsCount: 45,
    status: "active" as const,
    pinned: true,
    phone: "(11) 99999-9999",
    website: "www.bcrimports.com.br",
    location: "São Paulo, SP",
  },
  {
    id: "46",
    name: "Caio Araújo",
    email: "caioaraujo98@gmail.com.br",
    lastUpdate: "2025-03-23T15:30:00",
    productsCount: 45,
    status: "active" as const,
    pinned: true,
    phone: "(11) 88888-8888",
    website: "www.caioaraujo.com.br",
    location: "Rio de Janeiro, RJ",
  },
  {
    id: "1",
    name: "TechStock SP",
    email: "contato@techstock.com.br",
    lastUpdate: "2024-03-20T15:30:00",
    productsCount: 45,
    status: "active" as const,
    pinned: true,
    phone: "(11) 77777-7777",
    website: "www.techstock.com.br",
    location: "São Paulo, SP",
  },
  {
    id: "2",
    name: "Apple Distribuidora",
    email: "vendas@appledistribuidora.com.br",
    lastUpdate: "2024-03-20T14:45:00",
    productsCount: 78,
    status: "active" as const,
    pinned: false,
    phone: "(11) 66666-6666",
    website: "www.appledistribuidora.com.br",
    location: "São Paulo, SP",
  },
  {
    id: "3",
    name: "iStore Brasil",
    email: "compras@istore.com.br",
    lastUpdate: "2024-03-20T13:20:00",
    productsCount: 32,
    status: "inactive" as const,
    pinned: false,
    phone: "(11) 55555-5555",
    website: "www.istore.com.br",
    location: "Brasília, DF",
  },
  {
    id: "4",
    name: "MacTech Distribuidora",
    email: "vendas@mactech.com.br",
    lastUpdate: "2024-03-20T12:15:00",
    productsCount: 56,
    status: "active" as const,
    pinned: false,
    phone: "(11) 44444-4444",
    website: "www.mactech.com.br",
    location: "Curitiba, PR",
  },
  {
    id: "5",
    name: "Apple Premium",
    email: "contato@applemium.com.br",
    lastUpdate: "2024-03-20T11:30:00",
    productsCount: 92,
    status: "active" as const,
    pinned: false,
    phone: "(11) 33333-3333",
    website: "www.applemium.com.br",
    location: "Porto Alegre, RS",
  },
  {
    id: "6",
    name: "Tech Solutions",
    email: "vendas@techsolutions.com.br",
    lastUpdate: "2024-03-20T10:45:00",
    productsCount: 28,
    status: "inactive" as const,
    pinned: false,
    phone: "(11) 22222-2222",
    website: "www.techsolutions.com.br",
    location: "Belo Horizonte, MG",
  },
  {
    id: "7",
    name: "iStore Premium",
    email: "compras@istorepremium.com.br",
    lastUpdate: "2024-03-20T09:20:00",
    productsCount: 64,
    status: "active" as const,
    pinned: false,
    phone: "(11) 11111-1111",
    website: "www.istorepremium.com.br",
    location: "Salvador, BA",
  },
  {
    id: "8",
    name: "Apple Center",
    email: "vendas@applecenter.com.br",
    lastUpdate: "2024-03-20T08:15:00",
    productsCount: 41,
    status: "active" as const,
    pinned: false,
    phone: "(11) 00000-0000",
    website: "www.applecenter.com.br",
    location: "Recife, PE",
  },
  {
    id: "9",
    name: "Tech Distribuidora",
    email: "contato@techdist.com.br",
    lastUpdate: "2024-03-19T17:30:00",
    productsCount: 37,
    status: "inactive" as const,
    pinned: false,
    phone: "(11) 12345-6789",
    website: "www.techdist.com.br",
    location: "Fortaleza, CE",
  },
  {
    id: "10",
    name: "iStore Express",
    email: "vendas@istoreexpress.com.br",
    lastUpdate: "2024-03-19T16:45:00",
    productsCount: 53,
    status: "active" as const,
    pinned: false,
    phone: "(11) 98765-4321",
    website: "www.istoreexpress.com.br",
    location: "Manaus, AM",
  },
  {
    id: "11",
    name: "Apple Tech",
    email: "compras@appletech.com.br",
    lastUpdate: "2024-03-19T15:20:00",
    productsCount: 68,
    status: "active" as const,
    pinned: false,
    phone: "(11) 13579-2468",
    website: "www.appletech.com.br",
    location: "Goiânia, GO",
  },
  {
    id: "12",
    name: "Tech Premium",
    email: "vendas@techpremium.com.br",
    lastUpdate: "2024-03-19T14:15:00",
    productsCount: 49,
    status: "active" as const,
    pinned: false,
    phone: "(11) 24680-1357",
    website: "www.techpremium.com.br",
    location: "Vitória, ES",
  },
  {
    id: "13",
    name: "iStore Tech",
    email: "contato@istoretech.com.br",
    lastUpdate: "2024-03-19T13:30:00",
    productsCount: 72,
    status: "inactive" as const,
    pinned: false,
    phone: "(11) 36925-8147",
    website: "www.istoretech.com.br",
    location: "Campo Grande, MS",
  },
  {
    id: "14",
    name: "Apple Solutions",
    email: "vendas@applesolutions.com.br",
    lastUpdate: "2024-03-19T12:45:00",
    productsCount: 85,
    status: "active" as const,
    pinned: false,
    phone: "(11) 48159-2637",
    website: "www.applesolutions.com.br",
    location: "Cuiabá, MT",
  },
  {
    id: "15",
    name: "Tech Center",
    email: "compras@techcenter.com.br",
    lastUpdate: "2024-03-19T11:20:00",
    productsCount: 44,
    status: "active" as const,
    pinned: false,
    phone: "(11) 59263-8147",
    website: "www.techcenter.com.br",
    location: "Palmas, TO",
  },
  {
    id: "16",
    name: "iStore Center",
    email: "vendas@istorecenter.com.br",
    lastUpdate: "2024-03-19T10:15:00",
    productsCount: 61,
    status: "active" as const,
    pinned: false,
    phone: "(11) 60374-9258",
    website: "www.istorecenter.com.br",
    location: "Aracaju, SE",
  },
  {
    id: "17",
    name: "Apple Express",
    email: "contato@appleexpress.com.br",
    lastUpdate: "2024-03-19T09:30:00",
    productsCount: 39,
    status: "inactive" as const,
    pinned: false,
    phone: "(11) 71485-0369",
    website: "www.appleexpress.com.br",
    location: "João Pessoa, PB",
  },
  {
    id: "18",
    name: "Tech Express",
    email: "vendas@techexpress.com.br",
    lastUpdate: "2024-03-19T08:45:00",
    productsCount: 47,
    status: "active" as const,
    pinned: false,
    phone: "(11) 82596-1470",
    website: "www.techexpress.com.br",
    location: "Teresina, PI",
  },
].map((s, i) => ({ ...s, pinned: s.pinned ?? false }));

// Corrigir definição de SortConfig
type SortConfig = {
  key: keyof Supplier;
  direction: "asc" | "desc";
};

// Função utilitária para pegar as iniciais do nome
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Função utilitária para cor de fundo baseada no nome
function getAvatarColor(name: string) {
  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-red-500 to-red-600",
    "bg-gradient-to-br from-yellow-500 to-yellow-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
  ];
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

// Função para determinar se deve usar logo ou avatar
function shouldUseLogo(name: string) {
  // Usar logo para fornecedores com IDs pares (para ter uma distribuição aleatória)
  const supplierId = parseInt(name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0).toString());
  return supplierId % 2 === 0;
}

// Função para gerar logo baseado no nome
function getLogoUrl(name: string) {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffffff`;
}

// Função para formatar data relativa
function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Agora mesmo";
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInHours < 48) return "Ontem";
  return date.toLocaleDateString();
}

export default function SuppliersPage() {
  const { toast } = useToast();
  // Adicionar estado para pinnedSuppliers
  const [pinnedSuppliers, setPinnedSuppliers] = useState<{
    [id: string]: boolean;
  }>(() => Object.fromEntries(suppliers.map((s) => [s.id, !!s.pinned])));

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 12;

  // Filtros por coluna
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProductsCount, setFilterProductsCount] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const handleSort = (key: keyof Supplier) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Atualizar o filtro dos dados
  const filteredSuppliers = suppliers
    .map((supplier) => ({
      ...supplier,
      pinned: !!pinnedSuppliers[supplier.id],
    }))
    .filter((supplier) => {
      const matchesName = supplier.name
        .toLowerCase()
        .includes(filterName.toLowerCase());
      const matchesEmail = supplier.email
        .toLowerCase()
        .includes(filterEmail.toLowerCase());
      const matchesStatus = !filterStatus || supplier.status === filterStatus;
      const matchesProductsCount =
        !filterProductsCount ||
        supplier.productsCount === Number(filterProductsCount);
      const matchesDate =
        !filterDate || supplier.lastUpdate.slice(0, 10) === filterDate;
      return (
        matchesName &&
        matchesEmail &&
        matchesStatus &&
        matchesProductsCount &&
        matchesDate
      );
    });

  // Ajustar a ordenação para sempre mostrar pinados primeiro
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    if (sortConfig.key === "productsCount") {
      return sortConfig.direction === "asc"
        ? a.productsCount - b.productsCount
        : b.productsCount - a.productsCount;
    }
    if (sortConfig.key === "lastUpdate") {
      const dateA = new Date(a.lastUpdate).getTime();
      const dateB = new Date(b.lastUpdate).getTime();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (
      sortConfig.key === "name" ||
      sortConfig.key === "email" ||
      sortConfig.key === "status"
    ) {
      const aValue = String(a[sortConfig.key]);
      const bValue = String(b[sortConfig.key]);
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopyRow = (product: (typeof suppliers)[0]) => {
    const formattedData = `${product.name} ${product.email} ${product.productsCount
      } - 🔋 ${product.productsCount}% ${product.pinned ? "Fixado" : ""}
- Última atualização ${product.lastUpdate}`;

    navigator.clipboard.writeText(formattedData);
    toast("Copiado!", {
      description: "Informações do produto copiadas com sucesso",
      duration: 2000,
    });
  };

  const handlePinToggle = (supplierId: string) => {
    setPinnedSuppliers((prev) => ({
      ...prev,
      [supplierId]: !prev[supplierId],
    }));

    const isPinned = !pinnedSuppliers[supplierId];
    toast(isPinned ? "Fornecedor fixado!" : "Fornecedor desafixado!", {
      description: isPinned
        ? "Este fornecedor agora aparecerá no topo da lista"
        : "Este fornecedor não aparecerá mais no topo da lista",
      duration: 2000,
    });
  };

  return (
    <MainSectionLayout headerTitle="BCR">
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie seus parceiros comerciais
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedor..."
              className="pl-9 rounded-full border-0 shadow-sm bg-sidebar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8"
            >
              Lista
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{sortedSuppliers.length}</p>
                </div>
                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-0 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativos</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {sortedSuppliers.filter(s => s.status === "active").length}
                  </p>
                </div>
                <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Fixados</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {sortedSuppliers.filter(s => s.pinned).length}
                  </p>
                </div>
                <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-0 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Produtos</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {sortedSuppliers.reduce((acc, s) => acc + s.productsCount, 0)}
                  </p>
                </div>
                <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Suppliers Grid */}
        <div className={`grid gap-4 ${viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
          }`}>
          {paginatedSuppliers.map((supplier) => (
            <Card
              key={supplier.id}
              className="cursor-pointer gap-3 py-4"
            >
              <CardHeader className="px-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`relative`}>
                      {shouldUseLogo(supplier.name) ? (
                        <img
                          src={getLogoUrl(supplier.name)}
                          alt={supplier.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white text-lg font-semibold ${getAvatarColor(
                            supplier.name
                          )}`}
                        >
                          {getInitials(supplier.name)}
                        </div>
                      )}
                      {supplier.pinned && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{supplier.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{supplier.location}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePinToggle(supplier.id)}>
                        {supplier.pinned ? (
                          <>
                            <PinOff className="h-4 w-4 mr-2" />
                            Desafixar
                          </>
                        ) : (
                          <>
                            <Pin className="h-4 w-4 mr-2" />
                            Fixar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0 px-4">
                <div className="space-y-3">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {supplier.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="h-3 w-3" />
                      {supplier.productsCount} produtos
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{supplier.email}</span>
                    </div>

                    {supplier.website && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span className="truncate">{supplier.website}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Atualizado {getRelativeTime(supplier.lastUpdate)}</span>
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainSectionLayout>
  );
}

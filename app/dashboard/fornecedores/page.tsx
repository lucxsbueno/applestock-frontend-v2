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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Supplier = {
  id: string;
  name: string;
  email: string;
  lastUpdate: string;
  productsCount: number;
  status: "active" | "inactive";
  pinned?: boolean;
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
  },
  {
    id: "46",
    name: "Caio Araújo",
    email: "caioaraujo98@gmail.com.br",
    lastUpdate: "2025-03-23T15:30:00",
    productsCount: 45,
    status: "active" as const,
    pinned: true,
  },
  {
    id: "1",
    name: "TechStock SP",
    email: "contato@techstock.com.br",
    lastUpdate: "2024-03-20T15:30:00",
    productsCount: 45,
    status: "active" as const,
    pinned: true,
  },
  {
    id: "2",
    name: "Apple Distribuidora",
    email: "vendas@appledistribuidora.com.br",
    lastUpdate: "2024-03-20T14:45:00",
    productsCount: 78,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "3",
    name: "iStore Brasil",
    email: "compras@istore.com.br",
    lastUpdate: "2024-03-20T13:20:00",
    productsCount: 32,
    status: "inactive" as const,
    pinned: false,
  },
  {
    id: "4",
    name: "MacTech Distribuidora",
    email: "vendas@mactech.com.br",
    lastUpdate: "2024-03-20T12:15:00",
    productsCount: 56,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "5",
    name: "Apple Premium",
    email: "contato@applemium.com.br",
    lastUpdate: "2024-03-20T11:30:00",
    productsCount: 92,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "6",
    name: "Tech Solutions",
    email: "vendas@techsolutions.com.br",
    lastUpdate: "2024-03-20T10:45:00",
    productsCount: 28,
    status: "inactive" as const,
    pinned: false,
  },
  {
    id: "7",
    name: "iStore Premium",
    email: "compras@istorepremium.com.br",
    lastUpdate: "2024-03-20T09:20:00",
    productsCount: 64,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "8",
    name: "Apple Center",
    email: "vendas@applecenter.com.br",
    lastUpdate: "2024-03-20T08:15:00",
    productsCount: 41,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "9",
    name: "Tech Distribuidora",
    email: "contato@techdist.com.br",
    lastUpdate: "2024-03-19T17:30:00",
    productsCount: 37,
    status: "inactive" as const,
    pinned: false,
  },
  {
    id: "10",
    name: "iStore Express",
    email: "vendas@istoreexpress.com.br",
    lastUpdate: "2024-03-19T16:45:00",
    productsCount: 53,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "11",
    name: "Apple Tech",
    email: "compras@appletech.com.br",
    lastUpdate: "2024-03-19T15:20:00",
    productsCount: 68,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "12",
    name: "Tech Premium",
    email: "vendas@techpremium.com.br",
    lastUpdate: "2024-03-19T14:15:00",
    productsCount: 49,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "13",
    name: "iStore Tech",
    email: "contato@istoretech.com.br",
    lastUpdate: "2024-03-19T13:30:00",
    productsCount: 72,
    status: "inactive" as const,
    pinned: false,
  },
  {
    id: "14",
    name: "Apple Solutions",
    email: "vendas@applesolutions.com.br",
    lastUpdate: "2024-03-19T12:45:00",
    productsCount: 85,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "15",
    name: "Tech Center",
    email: "compras@techcenter.com.br",
    lastUpdate: "2024-03-19T11:20:00",
    productsCount: 44,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "16",
    name: "iStore Center",
    email: "vendas@istorecenter.com.br",
    lastUpdate: "2024-03-19T10:15:00",
    productsCount: 61,
    status: "active" as const,
    pinned: false,
  },
  {
    id: "17",
    name: "Apple Express",
    email: "contato@appleexpress.com.br",
    lastUpdate: "2024-03-19T09:30:00",
    productsCount: 39,
    status: "inactive" as const,
    pinned: false,
  },
  {
    id: "18",
    name: "Tech Express",
    email: "vendas@techexpress.com.br",
    lastUpdate: "2024-03-19T08:45:00",
    productsCount: 47,
    status: "active" as const,
    pinned: false,
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
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-cyan-500",
  ];
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
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
    const formattedData = `${product.name} ${product.email} ${
      product.productsCount
    } - 🔋 ${product.productsCount}% ${product.pinned ? "Fixado" : ""}
- Última atualização ${product.lastUpdate}`;

    navigator.clipboard.writeText(formattedData);
    toast("Copiado!", {
      description: "Informações do produto copiadas com sucesso",
      duration: 2000,
    });
  };

  return (
    <MainSectionLayout headerTitle="BCR">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Entre em contato com os fornecedores
        </p>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        <div className="space-x-4">
          <div className="flex items-start justify-between">
            <div className="relative w-72 mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar fornecedor..."
                className="pl-9 rounded-full border-0 shadow-sm bg-sidebar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-items-center gap-2">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer h-8 w-8 p-0 rounded-full hover:bg-muted/50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "ghost"}
                          size="sm"
                          className={`cursor-pointer h-8 w-8 p-0 rounded-full ${
                            page === currentPage
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer h-8 w-8 p-0 rounded-full hover:bg-muted/50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <Table className="">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="">
                  <button
                    onClick={() => handleSort("name")}
                    className="cursor-pointer px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                  >
                    Nome
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpDown className="h-4 w-4" />
                    </span>
                  </button>
                </TableHead>
                <TableHead className="">
                  <button
                    onClick={() => handleSort("email")}
                    className="cursor-pointer px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                  >
                    Email
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpDown className="h-4 w-4" />
                    </span>
                  </button>
                </TableHead>
                <TableHead className="">
                  <button
                    onClick={() => handleSort("status")}
                    className="cursor-pointer px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                  >
                    Status
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpDown className="h-4 w-4" />
                    </span>
                  </button>
                </TableHead>
                <TableHead className="">
                  <button
                    onClick={() => handleSort("productsCount")}
                    className="cursor-pointer px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                  >
                    Produtos
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpDown className="h-4 w-4" />
                    </span>
                  </button>
                </TableHead>
                <TableHead className="">
                  <button
                    onClick={() => handleSort("lastUpdate")}
                    className="cursor-pointer px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                  >
                    Última Atualização
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpDown className="h-4 w-4" />
                    </span>
                  </button>
                </TableHead>
                <TableHead className="px-4 text-muted-foreground text-left uppercase tracking-[1px] text-[12px] sticky right-0 bg-card z-10 rounded-tr-xl">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSuppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="border-gray-100 dark:border-zinc-900 !text-foreground"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-sm ${getAvatarColor(
                          supplier.name
                        )}`}
                      >
                        {getInitials(supplier.name)}
                      </div>
                      <span className="text-sm">{supplier.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm px-2">{supplier.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`px-2 rounded-2xl ${
                        supplier.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 text-sm">
                      {supplier.productsCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 text-sm">
                      {new Date(supplier.lastUpdate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="sticky right-0 bg-card z-10 shadow-sm">
                    <div className="flex items-center justify-start gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={() =>
                          setPinnedSuppliers((prev) => ({
                            ...prev,
                            [supplier.id]: !prev[supplier.id],
                          }))
                        }
                        title={supplier.pinned ? "Desafixar" : "Fixar"}
                      >
                        {supplier.pinned ? (
                          <PinOff className="h-4 w-4" />
                        ) : (
                          <Pin className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainSectionLayout>
  );
}

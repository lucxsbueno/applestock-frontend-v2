"use client";

import { useState } from "react";

import { MainSectionLayout } from "@/components/main-section-layout";

import {
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Filter,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { globalStockData } from "@/mocks/mocks";

type SortConfig = {
  key: keyof (typeof globalStockData)[0];
  direction: "asc" | "desc";
};

type Filters = {
  model: string;
  sealed: string;
  hasBox: string;
  priceRange: [number, number];
  batteryRange: [number, number];
  supplier: string;
};

const defaultFilters: Filters = {
  model: "all",
  sealed: "all",
  hasBox: "all",
  priceRange: [0, 15000],
  batteryRange: [0, 100],
  supplier: "all",
};

export default function StockPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "model",
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [tempFilters, setTempFilters] = useState<Filters>(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const handleSheetOpenChange = (open: boolean) => {
    if (open) {
      setTempFilters(filters);
    }
    setIsFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterSheetOpen(false);
  };

  const handleClearFilters = () => {
    setTempFilters(defaultFilters);
  };

  const handleSort = (key: keyof (typeof globalStockData)[0]) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredProducts = globalStockData.filter((product) => {
    const matchesSearch =
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.storage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.warranty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModel =
      filters.model === "all" ||
      (filters.model === "iphone" &&
        product.model.toLowerCase().includes("iphone")) ||
      (filters.model === "macbook" &&
        product.model.toLowerCase().includes("macbook")) ||
      (filters.model === "ipad" &&
        product.model.toLowerCase().includes("ipad")) ||
      (filters.model === "watch" &&
        product.model.toLowerCase().includes("watch"));

    const matchesSealed =
      filters.sealed === "all" ||
      (filters.sealed === "sealed" && product.sealed) ||
      (filters.sealed === "unsealed" && !product.sealed);

    const matchesHasBox =
      filters.hasBox === "all" ||
      (filters.hasBox === "yes" && product.hasBox) ||
      (filters.hasBox === "no" && !product.hasBox);

    const matchesPrice =
      product.wholesalePrice >= filters.priceRange[0] &&
      product.wholesalePrice <= filters.priceRange[1];

    const matchesBattery =
      product.battery >= filters.batteryRange[0] &&
      product.battery <= filters.batteryRange[1];

    const matchesSupplier =
      filters.supplier === "all" || product.supplier === filters.supplier;

    return (
      matchesSearch &&
      matchesModel &&
      matchesSealed &&
      matchesHasBox &&
      matchesPrice &&
      matchesBattery &&
      matchesSupplier
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (
      sortConfig.key === "wholesalePrice" ||
      sortConfig.key === "battery" ||
      sortConfig.key === "quantity"
    ) {
      return sortConfig.direction === "asc"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    }

    if (
      sortConfig.key === "model" ||
      sortConfig.key === "storage" ||
      sortConfig.key === "color" ||
      sortConfig.key === "warranty"
    ) {
      const aValue = String(a[sortConfig.key]);
      const bValue = String(b[sortConfig.key]);
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (sortConfig.key === "hasBox" || sortConfig.key === "sealed") {
      const aValue = Boolean(a[sortConfig.key]);
      const bValue = Boolean(b[sortConfig.key]);
      return sortConfig.direction === "asc"
        ? aValue === bValue
          ? 0
          : aValue
          ? -1
          : 1
        : aValue === bValue
        ? 0
        : aValue
        ? 1
        : -1;
    }

    if (sortConfig.key === "supplier") {
      const aValue = String(a[sortConfig.key]);
      const bValue = String(b[sortConfig.key]);
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopyRow = (product: (typeof globalStockData)[0]) => {
    const formattedData = `${product.model} ${product.storage} ${
      product.color
    } - R$${product.wholesalePrice.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} - 🔋 ${product.battery}% ${product.hasBox ? "Com caixa" : ""}
- Garantia ${product.warranty} - ${product.sealed ? "Lacrado" : "Seminovo"}`;

    navigator.clipboard.writeText(formattedData);
    toast("Copiado!", {
      description: "Informações do produto copiadas com sucesso",
      duration: 2000,
    });
  };

  return (
    <MainSectionLayout headerTitle="Space Phone">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Estoque dos fornecedores
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Acompanhe os produtos em estoque de fornecedores
        </p>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        <div className="space-x-4">
          <div className="flex items-start justify-between">
            <div className="relative w-72 mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-9 rounded-full border-0 shadow-sm bg-sidebar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-items-center gap-2">
              <Sheet
                open={isFilterSheetOpen}
                onOpenChange={handleSheetOpenChange}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer gap-1.5 rounded-full border-0 shadow-sm bg-card"
                  >
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>
                      Refine sua busca de produtos no estoque.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-6 py-6">
                    <div className="grid gap-3">
                      <Label>Modelo</Label>
                      <Select
                        value={tempFilters.model}
                        onValueChange={(value) =>
                          setTempFilters((prev) => ({ ...prev, model: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os modelos</SelectItem>
                          <SelectItem value="iphone">iPhone</SelectItem>
                          <SelectItem value="macbook">MacBook</SelectItem>
                          <SelectItem value="ipad">iPad</SelectItem>
                          <SelectItem value="watch">Apple Watch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="grid gap-3">
                      <Label>Faixa de Preço</Label>
                      <Slider
                        value={tempFilters.priceRange}
                        onValueChange={(value) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            priceRange: value as [number, number],
                          }))
                        }
                        min={0}
                        max={15000}
                        step={100}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>R$ {tempFilters.priceRange[0]}</span>
                        <span>R$ {tempFilters.priceRange[1]}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3">
                      <Label>Saúde da Bateria</Label>
                      <Slider
                        value={tempFilters.batteryRange}
                        onValueChange={(value) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            batteryRange: value as [number, number],
                          }))
                        }
                        min={0}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{tempFilters.batteryRange[0]}%</span>
                        <span>{tempFilters.batteryRange[1]}%</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3">
                      <Label>Condição</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={tempFilters.sealed}
                          onValueChange={(value) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              sealed: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Lacrado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="sealed">Lacrado</SelectItem>
                            <SelectItem value="unsealed">Aberto</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={tempFilters.hasBox}
                          onValueChange={(value) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              hasBox: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Caixa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="yes">Com caixa</SelectItem>
                            <SelectItem value="no">Sem caixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3">
                      <Label>Fornecedor</Label>
                      <Select
                        value={tempFilters.supplier}
                        onValueChange={(value) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            supplier: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            Todos os fornecedores
                          </SelectItem>
                          <SelectItem value="Apple Brasil">
                            Apple Brasil
                          </SelectItem>
                          <SelectItem value="iPlace">iPlace</SelectItem>
                          <SelectItem value="Fast Shop">Fast Shop</SelectItem>
                          <SelectItem value="Magazine Luiza">
                            Magazine Luiza
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <SheetFooter>
                    <Button
                      variant="outline"
                      className="border-0 rounded-full"
                      onClick={handleClearFilters}
                    >
                      Limpar Filtros
                    </Button>
                    <Button
                      onClick={handleApplyFilters}
                      className="rounded-full"
                    >
                      Aplicar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Button
                className="cursor-pointer rounded-full font-medium"
                onClick={() => {
                  // NProgress.start();
                  router.push("/dashboard/estoque/novo-produto");
                }}
              >
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </Button>

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

        <Card className="border-0 py-0 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("supplier" as any)}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Fornecedor
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("model")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Produto
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("color")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Cor
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("wholesalePrice")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Preço
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("battery")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Bateria
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("hasBox")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Caixa
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("sealed")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Lacrado
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("quantity")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      UND
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="">
                    <button
                      onClick={() => handleSort("warranty")}
                      className="px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                    >
                      Garantia
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                    </button>
                  </TableHead>
                  <TableHead className="px-4 text-muted-foreground text-left uppercase tracking-[1px] text-[12px] sticky right-0 bg-card z-10 shadow-sm">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-gray-100 dark:border-zinc-900 !text-foreground"
                  >
                    <TableCell>
                      <span className="text-sm px-2">{product.supplier}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5 px-2 py-1">
                        <div className=" text-sm">
                          {product.model} {product.storage}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm px-2">{product.color}</span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 text-sm">
                        R$
                        {product.wholesalePrice.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="px-2 flex items-center gap-1.5">
                        {product.battery >= 90 ? (
                          <BatteryFull className="h-4 w-4 text-green-600" />
                        ) : product.battery >= 80 ? (
                          <BatteryMedium className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <BatteryLow className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm ${
                            product.battery >= 90
                              ? "text-green-600"
                              : product.battery >= 80
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.battery}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="px-2">
                        {product.hasBox ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.sealed ? (
                        <Badge className="px-2 rounded-2xl bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                          Lacrado
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="px-2 rounded-2xl text-xs"
                        >
                          Aberto
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 text-sm">
                        {product.quantity} un
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 text-sm">{product.warranty}</span>
                    </TableCell>
                    <TableCell className="sticky right-0 bg-card z-10 shadow-sm">
                      <div className="px-2 flex items-center justify-start gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCopyRow(product)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </MainSectionLayout>
  );
}

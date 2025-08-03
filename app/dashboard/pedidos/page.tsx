"use client";
import {
  Plus,
  Eye,
  MapPin,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Search,
  CreditCard,
  Banknote,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronDown,
  Calendar,
  X,
  Coins,
  Kanban,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  Active,
  Over,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { MainSectionLayout } from "@/components/main-section-layout";

type Order = {
  id: string;
  customer: string;
  products: string;
  address: string;
  payment: string;
  date: string;
  status: "delivered" | "on-route" | "pending" | "cancelled" | "processing";
  value?: number;
  installments?: {
    count: number;
    value: number;
  };
};

type SortConfig = {
  key: keyof Order;
  direction: "asc" | "desc";
};

// Adicione dados extras de mock para cada pedido
const extraOrderData: Record<
  string,
  { note: string; tracking: string; phone: string; email: string }
> = {
  "PED-001": {
    note: "Cliente pediu embalagem para presente.",
    tracking: "BR123456789BR",
    phone: "(47) 99999-1111",
    email: "joao.silva@email.com",
  },
  "PED-002": {
    note: "Entregar após as 14h.",
    tracking: "BR987654321BR",
    phone: "(47) 98888-2222",
    email: "maria.santos@email.com",
  },
  "PED-003": {
    note: "Cliente vai retirar na loja.",
    tracking: "BR555555555BR",
    phone: "(47) 97777-3333",
    email: "pedro.costa@email.com",
  },
};

// Mapeamento de preços dos produtos
const productPrices: Record<string, number> = {
  "iPhone 15 Pro Max 256GB": 7845.32,
  "MacBook Air M2 512GB": 10530.55,
  "iPhone 15 Pro 128GB": 6923.32,
  'iPad Pro 12.9"': 14523.67,
  "Apple Watch Series 9": 3501.54,
  "iPhone 15 128GB": 5845.32,
  'MacBook Pro 16" M3 Pro': 18530.55,
  "AirPods Max": 4501.54,
  "iPad Air 5": 5845.32,
  "Apple Watch Ultra 2": 8501.54,
  "iPhone 15 Pro 512GB": 8923.32,
  "MacBook Air M3": 11530.55,
  "AirPods Pro 2 + AppleCare+": 2501.54,
  'iPad Pro 11" + Apple Pencil': 12523.67,
  "Apple Watch Series 9 + AppleCare+": 4001.54,
};

// Função para calcular o valor do pedido baseado nos produtos
const calculateOrderValue = (products: string): number => {
  // Se o produto tem um preço mapeado, retorna ele
  if (productPrices[products]) {
    return productPrices[products];
  }

  // Se não tem preço mapeado, tenta extrair um valor padrão baseado no tipo de produto
  const productLower = products.toLowerCase();
  if (productLower.includes("iphone")) {
    return 7000; // Valor médio para iPhones
  } else if (productLower.includes("macbook")) {
    return 12000; // Valor médio para MacBooks
  } else if (productLower.includes("ipad")) {
    return 8000; // Valor médio para iPads
  } else if (productLower.includes("watch")) {
    return 4000; // Valor médio para Apple Watches
  } else if (productLower.includes("airpods")) {
    return 2500; // Valor médio para AirPods
  }

  return 5000; // Valor padrão para outros produtos
};

const getPaymentIcon = (payment: string) => {
  switch (payment) {
    case "Pix":
      return <Coins className="h-4 w-4 text-green-600" />;
    case "Cartão":
      return <CreditCard className="h-4 w-4 text-blue-600" />;
    case "Dinheiro":
      return <Banknote className="h-4 w-4 text-green-600" />;
    default:
      return <CreditCard className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "delivered":
      return {
        title: "Entregue",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50/20",
        borderColor: "border-green-200",
        countColor: "bg-green-100 text-green-800",
      };
    case "on-route":
      return {
        title: "Em rota",
        icon: Truck,
        color: "text-blue-600",
        bgColor: "bg-blue-50/20",
        borderColor: "border-blue-200",
        countColor: "bg-blue-100 text-blue-800",
      };
    case "pending":
      return {
        title: "Em Orçamento",
        icon: Clock,
        color: "text-slate-600",
        bgColor: "bg-slate-50/20",
        borderColor: "border-slate-300",
        countColor: "bg-slate-100 text-slate-800",
      };
    case "cancelled":
      return {
        title: "Cancelado",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50/20",
        borderColor: "border-red-200",
        countColor: "bg-red-100 text-red-800",
      };
    case "processing":
      return {
        title: "Vendido",
        icon: Clock,
        color: "text-purple-600",
        bgColor: "bg-purple-50/20",
        borderColor: "border-purple-200",
        countColor: "bg-purple-100 text-purple-800",
      };
    default:
      return {
        title: status,
        icon: Clock,
        color: "text-gray-600",
        bgColor: "bg-gray-50/20",
        borderColor: "border-gray-200",
        countColor: "bg-gray-100 text-gray-800",
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset hours to compare only dates
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  const timeString = date.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return {
      text: `Hoje às ${timeString}`,
      variant: "outline" as const,
      className: "border-green-500 text-green-600 hover:bg-green-50",
    };
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return {
      text: `Ontem às ${timeString}`,
      variant: "outline" as const,
      className: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    };
  } else {
    return {
      text: date
        .toLocaleString("pt-BR", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", " às"),
      variant: "outline" as const,
      className: "border-gray-300 text-gray-600 hover:bg-gray-50",
    };
  }
};

const statusOrder: Order["status"][] = [
  "pending",
  "processing",
  "on-route",
  "delivered",
  "cancelled",
];

function OrderCard({ order }: { order: Order }) {
  const config = getStatusConfig(order.status);
  const orderValue = order.value || calculateOrderValue(order.products);

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md gap-0 rounded-md",
        config.borderColor
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(
              order.customer
            )}`}
            alt={order.customer}
            className="w-8 h-8 rounded-full bg-slate-100"
            loading="lazy"
          />
          <div>
            <div className="font-medium text-sm">{order.customer}</div>
            <div className="text-xs text-muted-foreground">{order.id}</div>
          </div>
        </div>
        <Badge variant="outline">{order.payment}</Badge>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground">
          {order.products}
        </div>
        <div className="text-xs text-muted-foreground">
          {(() => {
            const [endereco] = order.address.split(" - ");
            return (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{endereco}</span>
              </div>
            );
          })()}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(order.date).text}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Coins className="h-3 w-3" />
          R$
          {orderValue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          {order.payment.toLowerCase() === "cartão" && order.installments ? (
            <span className="ml-1">
              ({order.installments.count}xR$
              {order.installments.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              )
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-muted/50">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Eye className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Edit className="h-3 w-3" />
        </Button>
        {order.status === "on-route" && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MapPin className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Card>
  );
}

function SortableOrderCard({ order }: { order: Order }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OrderCard order={order} />
    </div>
  );
}

function KanbanColumn({
  id,
  children,
  title,
  ordersCount,
  isOver,
}: {
  id: string;
  children: React.ReactNode;
  title: string;
  ordersCount: number;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });
  const config = getStatusConfig(id);
  const IconComponent = config.icon;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full w-80 flex-shrink-0 flex-col rounded-lg transition-colors duration-200",
        { "bg-slate-100": isOver }
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 px-3 pt-3">
        <div className="flex items-center gap-2">
          <IconComponent className={cn("h-4 w-4", config.color)} />
          <h3 className={`font-semibold text-sm ${config.color}`}>{title}</h3>
        </div>
        <Badge variant="secondary" className={config.countColor}>
          {ordersCount}
        </Badge>
      </div>

      {/* Column Content (for cards) */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-3 -mr-3 pr-4">
        {children}
      </div>
    </div>
  );
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return (
        <Badge
          variant="default"
          className="flex w-fit items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100"
        >
          <CheckCircle className="h-3 w-3" />
          Entregue
        </Badge>
      );
    case "on-route":
      return (
        <Badge
          variant="default"
          className="flex w-fit items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-100"
        >
          <Truck className="h-3 w-3" />
          Em rota
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="default"
          className="flex w-fit items-center gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        >
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary" className="flex w-fit items-center gap-1">
          <Clock className="h-3 w-3" />
          Vendido
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="default"
          className="flex w-fit items-center gap-1 bg-red-100 text-red-800 hover:bg-red-100"
        >
          <XCircle className="h-3 w-3" />
          Cancelado
        </Badge>
      );
    default:
      return null;
  }
};

function OrdersTable({
  orders,
  searchQuery,
  statusFilter,
}: {
  orders: Order[];
  searchQuery: string;
  statusFilter: string;
}) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const handleSort = (key: keyof Order) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.payment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortConfig.key === "value") {
      const valueA = a.value || calculateOrderValue(a.products);
      const valueB = b.value || calculateOrderValue(b.products);
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="">
      <Card className="border-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <button
                  onClick={() => handleSort("customer")}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                >
                  Cliente
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpDown className="h-4 w-4" />
                  </span>
                </button>
              </TableHead>
              <TableHead className="w-[200px]">
                <button
                  onClick={() => handleSort("products")}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                >
                  Produtos
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpDown className="h-4 w-4" />
                  </span>
                </button>
              </TableHead>
              <TableHead className="w-[120px]">
                <button
                  onClick={() => handleSort("payment")}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                >
                  Pagamento
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpDown className="h-4 w-4" />
                  </span>
                </button>
              </TableHead>
              <TableHead className="w-[140px]">
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                >
                  Data/Hora
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpDown className="h-4 w-4" />
                  </span>
                </button>
              </TableHead>
              <TableHead className="w-[100px]">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
                >
                  Status
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpDown className="h-4 w-4" />
                  </span>
                </button>
              </TableHead>
              <TableHead className="w-[100px] text-left uppercase tracking-[1px] text-[12px]">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b-0">
            {paginatedOrders.map((order) => [
              <TableRow key={order.id} className="border-gray-100">
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="font-medium text-sm">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="font-medium text-sm">{order.products}</div>
                    <div className="text-xs text-muted-foreground">
                      {(() => {
                        const [endereco] = order.address.split(" - ");
                        return (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{endereco}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(order.payment)}
                    <span className="text-sm">{order.payment}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={formatDate(order.date).variant}
                    className={formatDate(order.date).className}
                  >
                    {formatDate(order.date).text}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === "on-route" && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <button
                      type="button"
                      aria-label={
                        expandedRows[order.id] ? "Recolher" : "Expandir"
                      }
                      onClick={() => toggleRow(order.id)}
                      className="flex items-center justify-center w-8 h-8 rounded hover:bg-muted/50 transition"
                    >
                      {expandedRows[order.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>,
              expandedRows[order.id] && (
                <TableRow key={order.id + "-expanded"} className="bg-muted/30">
                  <TableCell colSpan={6} className="py-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Observação:</span>{" "}
                        {extraOrderData[order.id]?.note || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">
                          Código de rastreio:
                        </span>{" "}
                        {extraOrderData[order.id]?.tracking || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Telefone:</span>{" "}
                        {extraOrderData[order.id]?.phone || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">E-mail:</span>{" "}
                        {extraOrderData[order.id]?.email || "-"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ),
            ])}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, sortedOrders.length)} de{" "}
            {sortedOrders.length} resultados
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                    className={`h-8 w-8 p-0 rounded-full ${
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
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { initialOrders, todayString } = useMemo(() => {
    const today = new Date();
    const todayString = today.toISOString().slice(0, 10);
    return {
      todayString,
      initialOrders: [
        {
          id: "PED-001",
          customer: "João Silva",
          products: "iPhone 15 Pro Max 256GB",
          address: "Rua das Flores, 123 - Itapema",
          payment: "Pix",
          date: `${todayString} 09:15`,
          status: "delivered",
          value: 7845.32,
        },
        {
          id: "PED-002",
          customer: "Maria Santos",
          products: "MacBook Air M2 512GB",
          address: "Av. Paulista, 1000 - Itajaí",
          payment: "Cartão",
          date: `${todayString} 11:30`,
          status: "on-route",
          value: 10530.55,
          installments: { count: 10, value: 1053.06 },
        },
        {
          id: "PED-003",
          customer: "Pedro Costa",
          products: "iPhone 15 Pro 128GB",
          address: "Rua Augusta, 500 - Balneario Camboriu",
          payment: "Dinheiro",
          date: "2024-01-15 18:20",
          status: "cancelled",
          value: 6923.32,
        },
        {
          id: "PED-004",
          customer: "Ana Costa",
          products: 'iPad Pro 12.9"',
          address: "Rua Oscar Freire, 200 - São Paulo",
          payment: "Pix",
          date: "2024-01-17 09:20",
          status: "processing",
          value: 14523.67,
        },
        {
          id: "PED-005",
          customer: "Carlos Mendes",
          products: "Apple Watch Series 9",
          address: "Av. Brigadeiro Faria Lima, 1500 - São Paulo",
          payment: "Cartão",
          date: "2024-01-17 16:30",
          status: "cancelled",
          value: 3501.54,
          installments: { count: 2, value: 1750.77 },
        },
        {
          id: "PED-006",
          customer: "Juliana Lima",
          products: "iPhone 15 128GB",
          address: "Rua Haddock Lobo, 400 - São Paulo",
          payment: "Pix",
          date: "2024-01-18 11:45",
          status: "on-route",
          value: 5845.32,
        },
        {
          id: "PED-007",
          customer: "Roberto Alves",
          products: 'MacBook Pro 16" M3 Pro',
          address: "Av. Rebouças, 800 - São Paulo",
          payment: "Cartão",
          date: "2024-01-18 14:15",
          status: "pending",
          value: 18530.55,
          installments: { count: 12, value: 1544.21 },
        },
        {
          id: "PED-008",
          customer: "Fernanda Martins",
          products: "AirPods Max",
          address: "Rua Bela Cintra, 300 - São Paulo",
          payment: "Dinheiro",
          date: "2024-01-19 10:30",
          status: "processing",
          value: 4501.54,
        },
        {
          id: "PED-009",
          customer: "Lucas Souza",
          products: "iPad Air 5",
          address: "Av. Berrini, 1200 - São Paulo",
          payment: "Pix",
          date: "2024-01-19 15:20",
          status: "delivered",
          value: 5845.32,
        },
        {
          id: "PED-010",
          customer: "Patrícia Gomes",
          products: "Apple Watch Ultra 2",
          address: "Rua da Consolação, 600 - São Paulo",
          payment: "Cartão",
          date: "2024-01-20 09:45",
          status: "on-route",
          value: 8501.54,
          installments: { count: 6, value: 1416.92 },
        },
        {
          id: "PED-011",
          customer: "Rafael Costa",
          products: "iPhone 15 Pro 512GB",
          address: "Av. Morumbi, 2000 - São Paulo",
          payment: "Pix",
          date: "2024-01-20 13:15",
          status: "cancelled",
          value: 8923.32,
        },
        {
          id: "PED-012",
          customer: "Beatriz Santos",
          products: "MacBook Air M3",
          address: "Rua Estados Unidos, 100 - São Paulo",
          payment: "Dinheiro",
          date: "2024-01-21 11:30",
          status: "processing",
          value: 11530.55,
        },
        {
          id: "PED-013",
          customer: "Gabriel Oliveira",
          products: "AirPods Pro 2 + AppleCare+",
          address: "Av. Jabaquara, 1500 - São Paulo",
          payment: "Cartão",
          date: "2024-01-21 16:45",
          status: "delivered",
          value: 2501.54,
          installments: { count: 3, value: 833.85 },
        },
        {
          id: "PED-014",
          customer: "Mariana Lima",
          products: 'iPad Pro 11" + Apple Pencil',
          address: "Rua Pamplona, 300 - São Paulo",
          payment: "Pix",
          date: "2024-01-22 10:20",
          status: "on-route",
          value: 12523.67,
        },
        {
          id: "PED-015",
          customer: "Thiago Mendes",
          products: "Apple Watch Series 9 + AppleCare+",
          address: "Av. São João, 800 - São Paulo",
          payment: "Cartão",
          date: "2024-01-22 14:30",
          status: "pending",
          value: 4001.54,
          installments: { count: 4, value: 1000.39 },
        },
      ] as Order[],
    };
  }, []);

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [originalColumnId, setOriginalColumnId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"kanban" | "table">("kanban");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const statusMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    orders.forEach((order) => {
      map[order.id] = order.status;
    });
    statusMapRef.current = map;
  }, [orders]);

  const ordersByStatus = useMemo(() => {
    const filtered = orders.filter((order) => {
      // Filtro por busca
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.products.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.payment.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por data
      let matchesDate = true;
      if (dateRange?.from || dateRange?.to) {
        const orderDate = new Date(order.date);
        const orderDateOnly = new Date(
          orderDate.getFullYear(),
          orderDate.getMonth(),
          orderDate.getDate()
        );

        if (dateRange.from) {
          const fromDate = new Date(
            dateRange.from.getFullYear(),
            dateRange.from.getMonth(),
            dateRange.from.getDate()
          );
          matchesDate = matchesDate && orderDateOnly >= fromDate;
        }

        if (dateRange.to) {
          const toDate = new Date(
            dateRange.to.getFullYear(),
            dateRange.to.getMonth(),
            dateRange.to.getDate()
          );
          matchesDate = matchesDate && orderDateOnly <= toDate;
        }
      }

      return matchesSearch && matchesDate;
    });
    return statusOrder.reduce((acc, status) => {
      acc[status] = filtered.filter((order) => order.status === status);
      return acc;
    }, {} as Record<string, Order[]>);
  }, [orders, searchQuery, dateRange]);

  const sensors = useSensors(useSensor(PointerSensor));

  function findContainer(id: string) {
    if (id in ordersByStatus) {
      return id;
    }
    return statusOrder.find((status) =>
      ordersByStatus[status].some((order) => order.id === id)
    );
  }

  function handleDragStart(event: { active: Active }) {
    const { active } = event;
    const order = orders.find((o) => o.id === active.id);
    setActiveOrder(order || null);
    setOverColumnId(null);

    const startContainer = findContainer(active.id as string);
    setOriginalColumnId(startContainer || null);
  }

  function handleDragOver(event: { active: Active; over: Over | null }) {
    const { active, over } = event;
    if (!over) return;

    const overContainer = findContainer(over.id as string);
    setOverColumnId(overContainer || null);

    const activeContainer = findContainer(active.id as string);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setOrders((prev) => {
      const activeItems = prev.filter(
        (order) => order.status === activeContainer
      );
      const overItems = prev.filter((order) => order.status === overContainer);

      const activeIndex = activeItems.findIndex((o) => o.id === active.id);
      const overIndex = overItems.findIndex((o) => o.id === over.id);

      let newIndex;
      if (over.id in ordersByStatus) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;

        if (isBelowLastItem) {
          newIndex = overItems.length + 1;
        } else {
          newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;
        }
      }

      const movedOrder = prev.find((o) => o.id === active.id);
      if (!movedOrder) return prev;

      const updatedOrder = {
        ...movedOrder,
        status: overContainer as Order["status"],
      };

      return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    });
  }

  function handleDragEnd(event: { active: Active; over: Over | null }) {
    const { active, over } = event;
    if (!over) {
      setActiveOrder(null);
      setOverColumnId(null);
      setOriginalColumnId(null);
      return;
    }

    const activeContainer = originalColumnId;
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) {
      setActiveOrder(null);
      setOverColumnId(null);
      setOriginalColumnId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeContainer !== overContainer) {
      const movedOrder = orders.find((o) => o.id === activeId);
      if (movedOrder) {
        const config = getStatusConfig(overContainer);
        toast(`Pedido ${movedOrder.id} movido com sucesso!`, {
          description: `Agora está em "${config.title}"`,
        });
      }
      setOrders((prev) => {
        const activeIndex = prev.findIndex((item) => item.id === activeId);
        if (activeIndex === -1) return prev;

        // Determine the target index for the drop
        let overIndex = prev.findIndex((item) => item.id === overId);
        if (overIndex === -1) {
          // Dropped on a column, not an item. Find last item in that column.
          const itemsInCol = prev.filter((o) => o.status === overContainer);
          if (itemsInCol.length > 0) {
            const lastItem = itemsInCol[itemsInCol.length - 1];
            overIndex = prev.findIndex((item) => item.id === lastItem.id);
          } else {
            // Dropped on an empty column. We will place it after the last item of the previous column.
            const containerIndex = statusOrder.indexOf(
              overContainer as Order["status"]
            );
            let lastItemOfPreviousCol: Order | undefined;
            for (let i = containerIndex - 1; i >= 0; i--) {
              const prevStatus = statusOrder[i];
              const items = prev.filter((o) => o.status === prevStatus);
              if (items.length > 0) {
                lastItemOfPreviousCol = items[items.length - 1];
                break;
              }
            }
            if (lastItemOfPreviousCol) {
              overIndex = prev.findIndex(
                (item) => item.id === lastItemOfPreviousCol!.id
              );
            } else {
              // No previous items, so it becomes the first.
              overIndex = 0;
            }
          }
        }

        const reorderedOrders = arrayMove(prev, activeIndex, overIndex);

        return reorderedOrders.map((o) =>
          o.id === activeId
            ? { ...o, status: overContainer as Order["status"] }
            : o
        );
      });
    } else {
      // Reordenar dentro da mesma coluna
      const itemsInContainer = ordersByStatus[activeContainer];
      const oldIndex = itemsInContainer.findIndex((o) => o.id === active.id);
      const newIndex = itemsInContainer.findIndex((o) => o.id === over.id);

      if (oldIndex !== newIndex && newIndex !== -1) {
        setOrders((currentOrders) => {
          const containerItems = currentOrders.filter(
            (o) => o.status === activeContainer
          );
          const otherItems = currentOrders.filter(
            (o) => o.status !== activeContainer
          );
          const reorderedItems = arrayMove(containerItems, oldIndex, newIndex);

          // Rebuild the array respecting the original column order
          const statusToItems = otherItems.reduce((acc, item) => {
            if (!acc[item.status]) {
              acc[item.status] = [];
            }
            acc[item.status].push(item);
            return acc;
          }, {} as Record<string, Order[]>);

          statusToItems[activeContainer] = reorderedItems;

          return statusOrder.flatMap((status) => statusToItems[status] || []);
        });
      }
    }
    setActiveOrder(null);
    setOverColumnId(null);
    setOriginalColumnId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <MainSectionLayout headerTitle="SpacePhoneBC">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-muted/50">
            <div className="flex flex-row justify-between pb-4">
              <div className="px-6">
                <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Visualize e gerencie seus pedidos
                </p>
              </div>

              <div className="flex items-end justify-end gap-2">
                {/* Tabs */}
                <div className="flex bg-muted/60 rounded-full p-1">
                  <button
                    onClick={() => setActiveTab("kanban")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-[7px] rounded-full text-sm font-medium transition-colors",
                      activeTab === "kanban"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Kanban className="w-4 h-4" />
                    Kanban
                  </button>
                  <button
                    onClick={() => setActiveTab("table")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-[7px] rounded-full text-sm font-medium transition-colors",
                      activeTab === "table"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Table2 className="w-4 h-4" />
                    Tabela
                  </button>
                </div>

                {/* Date Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal rounded-full border-0 shadow-sm",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", {
                              locale: ptBR,
                            })}{" "}
                            -{" "}
                            {format(dateRange.to, "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                      ) : (
                        ""
                      )}
                      {dateRange && (dateRange.from || dateRange.to) && (
                        <X
                          className="ml-2 h-4 w-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDateRange(undefined);
                          }}
                        />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>

                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pedidos..."
                    className="pl-9 border-0 rounded-full shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button className="rounded-full">
                  <Plus className="h-4 w-4" />
                  Novo Pedido
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === "kanban" ? (
            <div className="relative flex-1">
              {/* Absolutely positioned scrollable area */}
              <div className="absolute inset-0 overflow-auto scrollbar-hide">
                <div className="flex h-full gap-1 px-3 pt-2 pb-0">
                  {statusOrder.map((status) => {
                    const columnOrders = ordersByStatus[status] || [];
                    const config = getStatusConfig(status);

                    return (
                      <KanbanColumn
                        key={status}
                        id={status}
                        title={config.title}
                        ordersCount={columnOrders.length}
                        isOver={status === overColumnId}
                      >
                        <SortableContext
                          items={columnOrders.map((o) => o.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {columnOrders.length > 0 ? (
                            columnOrders.map((order) => (
                              <SortableOrderCard key={order.id} order={order} />
                            ))
                          ) : (
                            <div
                              className={cn(
                                "p-8 text-center border border-dashed rounded-lg h-full flex items-center justify-center",
                                config.borderColor,
                                config.bgColor
                              )}
                            >
                              <p className={`text-sm ${config.color}`}>
                                Nenhum pedido {config.title.toLowerCase()}
                              </p>
                            </div>
                          )}
                        </SortableContext>
                      </KanbanColumn>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-5">
              <OrdersTable
                orders={orders}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
              />
            </div>
          )}
        </div>
      </MainSectionLayout>
      <DragOverlay>
        {activeOrder ? (
          <div className="shadow-2xl rounded-lg rotate-3 transform">
            <OrderCard order={activeOrder} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

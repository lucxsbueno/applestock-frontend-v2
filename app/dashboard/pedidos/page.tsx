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
  Coins,
  Calendar,
  X,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState, useMemo } from "react";
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
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { MainSectionLayout } from "@/components/main-section-layout";
import { initialOrders } from "@/mocks/mocks";
import moment from "moment";
import "moment/locale/pt-br";

// Types
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

type OrderStatus = Order["status"];

// Constants
const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "processing",
  "on-route",
  "delivered",
  "cancelled",
];

const STATUS_CONFIG = {
  delivered: {
    title: "Entregue",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50/20",
    borderColor: "border-green-200",
    countColor: "bg-green-100 text-green-800",
  },
  "on-route": {
    title: "Em rota",
    icon: Truck,
    color: "text-blue-600",
    bgColor: "bg-blue-50/20",
    borderColor: "border-blue-200",
    countColor: "bg-blue-100 text-blue-800",
  },
  pending: {
    title: "Em Orçamento",
    icon: Clock,
    color: "text-slate-600",
    bgColor: "bg-slate-50/20",
    borderColor: "border-slate-300",
    countColor: "bg-slate-100 text-slate-800",
  },
  cancelled: {
    title: "Cancelado",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50/20",
    borderColor: "border-red-200",
    countColor: "bg-red-100 text-red-800",
  },
  processing: {
    title: "Vendido",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-50/20",
    borderColor: "border-purple-200",
    countColor: "bg-purple-100 text-purple-800",
  },
} as const;

const PAYMENT_ICONS = {
  Pix: <Coins className="h-4 w-4 text-green-600" />,
  Cartão: <CreditCard className="h-4 w-4 text-blue-600" />,
  Dinheiro: <Banknote className="h-4 w-4 text-green-600" />,
} as const;

// Set moment locale
moment.locale("pt-br");

// Utility functions
const formatDate = (dateString: string) => {
  const date = moment(dateString);
  const now = moment();
  
  const timeString = date.format("HH:mm");

  if (date.isSame(now, "day")) {
    return {
      text: `Hoje às ${timeString}`,
      variant: "outline" as const,
      className: "border-green-500 text-green-600 hover:bg-green-50",
    };
  } else if (date.isSame(now.clone().subtract(1, "day"), "day")) {
    return {
      text: `Ontem às ${timeString}`,
      variant: "outline" as const,
      className: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    };
  } else {
    return {
      text: date.format("DD [de] MMM [às] HH:mm"),
      variant: "outline" as const,
      className: "border-gray-300 text-gray-600 hover:bg-gray-50",
    };
  }
};

const getPaymentIcon = (payment: string) => {
  return PAYMENT_ICONS[payment as keyof typeof PAYMENT_ICONS] || 
         <CreditCard className="h-4 w-4 text-gray-600" />;
};

const getStatusConfig = (status: OrderStatus) => {
  return STATUS_CONFIG[status];
};

// Components
const OrderCard = ({ order }: { order: Order }) => {
  const orderValue = order.value || 0;

  return (
    <Card className="p-4 cursor-pointer gap-0 rounded-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(order.customer)}`}
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
        <div className="text-sm font-medium text-foreground">{order.products}</div>
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{order.address.split(" - ")[0]}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(order.date).text}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Coins className="h-3 w-3" />
          R$ {orderValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {order.payment.toLowerCase() === "cartão" && order.installments && (
            <span className="ml-1">
              ({order.installments.count}xR$
              {order.installments.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })})
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-muted/50">
        <Button variant="ghost" size="sm" className="cursor-pointer h-7 w-7 p-0 hover:bg-background">
          <Eye className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" className="cursor-pointer h-7 w-7 p-0 hover:bg-background">
          <Edit className="h-3 w-3" />
        </Button>
        {order.status === "on-route" && (
          <Button variant="ghost" size="sm" className="cursor-pointer h-7 w-7 p-0 hover:bg-background">
            <MapPin className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Card>
  );
};

const SortableOrderCard = ({ order }: { order: Order }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: order.id });

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
};

const KanbanColumn = ({
  id,
  children,
  title,
  ordersCount,
  isOver,
}: {
  id: OrderStatus;
  children: React.ReactNode;
  title: string;
  ordersCount: number;
  isOver: boolean;
}) => {
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
      <div className="flex items-center justify-between mb-4 flex-shrink-0 px-3 pt-3">
        <div className="flex items-center gap-2">
          <IconComponent className={cn("h-4 w-4", config.color)} />
          <h3 className={cn("font-semibold text-sm", config.color)}>{title}</h3>
        </div>
        <Badge variant="secondary" className={config.countColor}>
          {ordersCount}
        </Badge>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-3 -mr-3 pr-4">
        {children}
      </div>
    </div>
  );
};

const SearchHeader = ({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}) => (
  <div className="flex items-end justify-end gap-2 pr-4">
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "cursor-pointer bg-sidebar shadow-none justify-start text-left font-normal rounded-full border-0",
            !dateRange && "text-muted-foreground"
          )}
        >
          <Calendar className="h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {moment(dateRange.from).format("DD/MM/YYYY")} -{" "}
                {moment(dateRange.to).format("DD/MM/YYYY")}
              </>
            ) : (
              moment(dateRange.from).format("DD/MM/YYYY")
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
        />
      </PopoverContent>
    </Popover>

    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar pedidos..."
        className="pl-9 border-0 rounded-full shadow-none bg-sidebar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <Button className="rounded-full text-xs font-semibold cursor-pointer">
      <PlusCircle className="h-4 w-4" />
      Novo Pedido
    </Button>
  </div>
);

const EmptyColumnState = ({ status }: { status: OrderStatus }) => {
  const config = getStatusConfig(status);
  
  return (
    <div
      className={cn(
        "p-8 text-center border border-dashed rounded-lg h-full flex items-center justify-center",
        config.borderColor,
        config.bgColor
      )}
    >
      <p className={cn("text-sm", config.color)}>
        Nenhum pedido {config.title.toLowerCase()}
      </p>
    </div>
  );
};

// Custom hooks
const useOrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [overColumnId, setOverColumnId] = useState<OrderStatus | null>(null);
  const [originalColumnId, setOriginalColumnId] = useState<OrderStatus | null>(null);

  const ordersByStatus = useMemo(() => {
    return STATUS_ORDER.reduce((acc, status) => {
      acc[status] = orders.filter((order) => order.status === status);
      return acc;
    }, {} as Record<OrderStatus, Order[]>);
  }, [orders]);

  const findContainer = (id: string): OrderStatus | undefined => {
    if (id in ordersByStatus) {
      return id as OrderStatus;
    }
    return STATUS_ORDER.find((status) =>
      ordersByStatus[status].some((order) => order.id === id)
    );
  };

  return {
    orders,
    setOrders,
    ordersByStatus,
    activeOrder,
    setActiveOrder,
    overColumnId,
    setOverColumnId,
    originalColumnId,
    setOriginalColumnId,
    findContainer,
  };
};

const useDragAndDrop = (ordersManagement: ReturnType<typeof useOrdersManagement>) => {
  const {
    orders,
    setOrders,
    ordersByStatus,
    activeOrder,
    setActiveOrder,
    overColumnId,
    setOverColumnId,
    originalColumnId,
    setOriginalColumnId,
    findContainer,
  } = ordersManagement;

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: { active: Active }) => {
    const { active } = event;
    const order = orders.find((o) => o.id === active.id);
    setActiveOrder(order || null);
    setOverColumnId(null);

    const startContainer = findContainer(active.id as string);
    setOriginalColumnId(startContainer || null);
  };

  const handleDragOver = (event: { active: Active; over: Over | null }) => {
    const { active, over } = event;
    if (!over) return;

    const overContainer = findContainer(over.id as string);
    setOverColumnId(overContainer || null);

    const activeContainer = findContainer(active.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // Movendo entre colunas diferentes - apenas atualizar o status
    setOrders((prev) =>
      prev.map((order) =>
        order.id === active.id ? { ...order, status: overContainer } : order
      )
    );
  };

  const handleDragEnd = (event: { active: Active; over: Over | null }) => {
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
      // Movendo entre colunas diferentes
      const movedOrder = orders.find((o) => o.id === activeId);
      if (movedOrder) {
        const config = getStatusConfig(overContainer);
        toast(`Pedido ${movedOrder.id} movido com sucesso!`, {
          description: `Agora está em "${config.title}"`,
        });
      }

      // Calcular a posição correta na nova coluna
      setOrders((prev: Order[]) => {
        const activeIndex = prev.findIndex((item: Order) => item.id === activeId);
        if (activeIndex === -1) return prev;

        // Encontrar o índice do item sobre o qual foi solto
        let overIndex = prev.findIndex((item: Order) => item.id === overId);
        
        if (overIndex === -1) {
          // Se não encontrou o item, significa que foi solto na coluna vazia
          // Colocar no final da nova coluna
          const itemsInNewCol = prev.filter((o: Order) => o.status === overContainer);
          if (itemsInNewCol.length > 0) {
            const lastItem = itemsInNewCol[itemsInNewCol.length - 1];
            overIndex = prev.findIndex((item: Order) => item.id === lastItem.id);
          } else {
            // Coluna vazia, colocar após o último item da coluna anterior
            const containerIndex = STATUS_ORDER.indexOf(overContainer);
            let lastItemOfPreviousCol: Order | undefined;
            for (let i = containerIndex - 1; i >= 0; i--) {
              const prevStatus = STATUS_ORDER[i];
              const items = prev.filter((o: Order) => o.status === prevStatus);
              if (items.length > 0) {
                lastItemOfPreviousCol = items[items.length - 1];
                break;
              }
            }
            if (lastItemOfPreviousCol) {
              overIndex = prev.findIndex((item: Order) => item.id === lastItemOfPreviousCol.id);
            } else {
              overIndex = 0;
            }
          }
        }

        // Remover o item da posição atual e colocar na nova posição
        const reorderedOrders = arrayMove(prev, activeIndex, overIndex);
        
        // Atualizar o status do item movido
        return reorderedOrders.map((o: Order) =>
          o.id === activeId ? { ...o, status: overContainer } : o
        );
      });
    }

    setActiveOrder(null);
    setOverColumnId(null);
    setOriginalColumnId(null);
  };

  return {
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

// Main component
export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const ordersManagement = useOrdersManagement();
  const dragAndDrop = useDragAndDrop(ordersManagement);

  const filteredOrdersByStatus = useMemo(() => {
    const filtered = ordersManagement.orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.products.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.payment.toLowerCase().includes(searchQuery.toLowerCase());

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

    return STATUS_ORDER.reduce((acc, status) => {
      acc[status] = filtered.filter((order) => order.status === status);
      return acc;
    }, {} as Record<OrderStatus, Order[]>);
  }, [ordersManagement.orders, searchQuery, dateRange]);

  return (
    <DndContext
      sensors={dragAndDrop.sensors}
      collisionDetection={closestCenter}
      onDragStart={dragAndDrop.handleDragStart}
      onDragOver={dragAndDrop.handleDragOver}
      onDragEnd={dragAndDrop.handleDragEnd}
    >
      <MainSectionLayout headerTitle="SpacePhoneBC">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-shrink-0 border-b border-muted/50">
            <div className="flex flex-row justify-between pb-4">
              <div className="px-6">
                <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                <p className="text-muted-foreground text-sm font-normal mt-1">
                  Visualize e gerencie seus pedidos
                </p>
              </div>

              <SearchHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-0 overflow-auto scrollbar-hide">
              <div className="flex h-full gap-1 px-3 pt-2 pb-0">
                {STATUS_ORDER.map((status) => {
                  const columnOrders = filteredOrdersByStatus[status] || [];
                  const config = getStatusConfig(status);

                  return (
                    <KanbanColumn
                      key={status}
                      id={status}
                      title={config.title}
                      ordersCount={columnOrders.length}
                      isOver={status === ordersManagement.overColumnId}
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
                          <EmptyColumnState status={status} />
                        )}
                      </SortableContext>
                    </KanbanColumn>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </MainSectionLayout>

      <DragOverlay>
        {ordersManagement.activeOrder ? (
          <div className="shadow-2xl rounded-lg rotate-3 transform">
            <OrderCard order={ordersManagement.activeOrder} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

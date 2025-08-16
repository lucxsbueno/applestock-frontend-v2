"use client";

import { useEffect, useState } from "react";
import { MainSectionLayout } from "../main-section-layout";
import { DollarSign, Package, ShoppingCart, Truck, Search } from "lucide-react";
import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";

import { mostSoldProducts, salesPerDay } from "@/mocks/mocks";
import { useTheme } from "next-themes";
import { SearchModal } from "../search-modal";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export function DashboardSection() {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  // Atalho de teclado ⌘K para abrir o modal de busca
  useKeyboardShortcut('k', () => setIsSearchOpen(true), true);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // ou um loader

  const isDark = theme === "dark" || resolvedTheme === "dark";

  return (
    <MainSectionLayout headerTitle="SpacePhoneBC" rightContent={
      <Button 
        variant="ghost" 
        size="sm" 
        className="cursor-pointer flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
        onClick={() => setIsSearchOpen(true)}
      >
        <Search className="h-4 w-4" />
        Buscar
      </Button>
    }>
      <div className="px-6 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Olá, Lucas! 👋🏼</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fique por dentro das suas principais métricas
        </p>
        {/* Content */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <Card className="bg-blue-500 text-white border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-white">
              <CardTitle className="text-sm font-medium text-white">
                Total de Pedidos
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                <CountUp end={1234} duration={2.5} separator="," />
              </div>
              <p className="text-xs text-white/80">
                +20.1% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Produtos no Estoque
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp end={156} duration={2.5} separator="," />
              </div>
              <p className="text-xs text-muted-foreground">
                +5 novos produtos esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos em Rota
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp end={23} duration={2.5} separator="," />
              </div>
              <p className="text-xs text-muted-foreground">12 entregas hoje</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita do Mês
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ <CountUp end={45231} duration={2.5} separator="." />
              </div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7 mt-5">
          <Card className="col-span-4 shadow-none border-0 bg-slate-100 dark:bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Vendas por dia</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-end h-[280px] p-0">
              <div className="w-full px-6 pb-4">
                <div
                  className="h-[200px] w-full flex items-end justify-center rounded-lg"
                  style={{ background: isDark ? "var(--card)" : "#f1f5f9" }}
                >
                  {mounted && (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart
                        data={salesPerDay}
                        barSize={32}
                        style={{ fontFamily: "inherit" }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke={isDark ? "#334155" : "#e5e7eb"}
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          stroke={isDark ? "#94a3b8" : "#64748b"}
                          fontSize={14}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          stroke={isDark ? "#94a3b8" : "#64748b"}
                          fontSize={14}
                          width={60}
                          tickFormatter={(value) =>
                            `R$${Math.round(value).toLocaleString("pt-BR")}`
                          }
                        />
                        <Tooltip
                          cursor={{ fill: isDark ? "#1e293b" : "#f1f5f9" }}
                          contentStyle={{
                            borderRadius: 8,
                            background: isDark ? "#1e293b" : "#fff",
                            border: "none",
                            fontSize: 14,
                            color: isDark ? "#fff" : "#000",
                          }}
                          formatter={(value) => [
                            `R$${value.toLocaleString("pt-BR")}`,
                            "sales",
                          ]}
                        />
                        <Bar
                          dataKey="sales"
                          radius={[8, 8, 0, 0]}
                          fill={isDark ? "#38bdf8" : "#0f172a"}
                          name="sales"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3 shadow-none border-0 bg-slate-100 dark:bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Produtos mais vendidos</CardTitle>
              <CardDescription>
                Distribuição de vendas dos 5 produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="h-[240px] flex items-center justify-center rounded-lg"
                style={{ background: isDark ? "var(--card)" : "" }}
              >
                {mounted && (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={mostSoldProducts}
                        dataKey="sales"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={48}
                        paddingAngle={4}
                      >
                        {mostSoldProducts.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={entry.color}
                            fontSize="12px"
                            stroke="0px"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          background: isDark ? "#1e293b" : "#fff",
                          border: "none",
                          fontSize: 12,
                          color: isDark ? "#fff" : "#000",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: 10,
                          paddingTop: 16,
                          color: isDark ? "#fff" : "#000",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none border-0 bg-slate-100 dark:bg-card w-full mt-5">
          <CardHeader>
            <CardTitle className="text-xl">Novos clientes por dia</CardTitle>
            <CardDescription>
              Quantidade de novos clientes cadastrados em cada dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-end h-[320px] p-0">
            <div className="w-full px-6 pb-4">
              <div
                className="h-[220px] w-full flex items-end justify-center rounded-lg"
                style={{ background: isDark ? "var(--card)" : "#f1f5f9" }}
              >
                {mounted && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={[
                        { day: "Seg", customers: 3 },
                        { day: "Ter", customers: 5 },
                        { day: "Qua", customers: 2 },
                        { day: "Qui", customers: 6 },
                        { day: "Sex", customers: 8 },
                        { day: "Sáb", customers: 4 },
                        { day: "Dom", customers: 1 },
                      ]}
                      style={{ fontFamily: "inherit" }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={isDark ? "#334155" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        stroke={isDark ? "#94a3b8" : "#64748b"}
                        fontSize={14}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        stroke={isDark ? "#94a3b8" : "#64748b"}
                        fontSize={14}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          background: isDark ? "#1e293b" : "#fff",
                          border: "none",
                          fontSize: 14,
                          color: isDark ? "#fff" : "#000",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke={isDark ? "#38bdf8" : "#0ea5e9"}
                        strokeWidth={3}
                        dot={{ r: 5, fill: isDark ? "#38bdf8" : "#0ea5e9" }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </MainSectionLayout>
  );
}

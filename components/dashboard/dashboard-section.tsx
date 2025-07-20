"use client";

import CountUp from "react-countup";
import { MainSectionLayout } from "../main-section-layout";
import { DollarSign, Package, ShoppingCart, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardSection() {
  return (
    <MainSectionLayout headerTitle="Space Phone">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Olá, Lucas! 👋🏼</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Página de perfil do usuário
        </p>
        {/* Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
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
      </div>
    </MainSectionLayout>
  );
}

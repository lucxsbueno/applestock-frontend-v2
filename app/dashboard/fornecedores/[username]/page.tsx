"use client";

import { useParams, useRouter } from "next/navigation";
import { MainSectionLayoutWithBack } from "@/components/main-section-layout-with-back";
import { suppliers } from "@/mocks/mocks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, MapPin, Mail, Phone, Globe } from "lucide-react";

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

// Função para obter cor da reputação
function getReputationColor(reputation: number): string {
  switch (reputation) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-orange-500';
    case 3: return 'bg-yellow-500';
    case 4: return 'bg-blue-500';
    case 5: return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  // Buscar o fornecedor pelo username
  const supplier = suppliers.find(s => s.username === username);

  if (!supplier) {
    return (
      <MainSectionLayoutWithBack headerTitle="SpacePhoneBC">
        <div className="px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Fornecedor não encontrado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              O fornecedor com username "{username}" não foi encontrado.
            </p>
          </div>
        </div>
      </MainSectionLayoutWithBack>
    );
  }

  return (
    <MainSectionLayoutWithBack headerTitle="Detalhes do fornecedor">
      <div className="px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
            <p className="text-muted-foreground text-sm font-normal mt-1">
              Detalhes do fornecedor
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {shouldUseLogo(supplier.name) ? (
                      <img
                        src={getLogoUrl(supplier.name)}
                        alt={supplier.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-full text-white text-2xl font-semibold ${getAvatarColor(
                          supplier.name
                        )}`}
                      >
                        {getInitials(supplier.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{supplier.name}</h2>
                    <p className="text-muted-foreground">@{supplier.username}</p>
                    <Badge
                      className={`mt-2 ${
                        supplier.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {supplier.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações de Contato */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{supplier.email}</span>
                    </div>
                    {supplier.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{supplier.website}</span>
                      </div>
                    )}
                    {supplier.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{supplier.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estatísticas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{supplier.productsCount} produtos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Última atualização: {getRelativeTime(supplier.lastUpdate)}</span>
                    </div>
                  </div>
                </div>

                {/* Reputação */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Reputação</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Nível:</span>
                      <span className="text-sm font-medium">{supplier.reputation}/5</span>
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-3 flex-1 ${
                            level === 1 
                              ? 'rounded-l-full' 
                              : level === 5 
                              ? 'rounded-r-full' 
                              : ''
                          } ${
                            level <= supplier.reputation
                              ? getReputationColor(supplier.reputation)
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vendas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Histórico de Vendas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total de vendas:</span>
                      <span className="text-sm font-medium">
                        {supplier.totalSales < 100 ? (
                          <span className="text-orange-600">Vendas insuficientes para calcular</span>
                        ) : (
                          <span className="text-green-600">{supplier.totalSales} vendas</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Último mês:</span>
                      <span className="text-sm font-medium">
                        {supplier.lastMonthSales < 10 ? (
                          <span className="text-orange-600">Dados insuficientes</span>
                        ) : (
                          <span className="text-blue-600">{supplier.lastMonthSales} vendas</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Ações Rápidas</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Conectar
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Favoritar
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Ver Produtos
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainSectionLayoutWithBack>
  );
} 
"use client";

import { useState } from "react";
import Link from "next/link";

import { MainSectionLayout } from "@/components/main-section-layout";

import {
  Search,
  Package,
  Calendar,
  Heart,
  Star,
  Sparkles,
  Shield,
  Zap,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { suppliers } from "@/mocks/mocks";


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

export default function SuppliersPage() {
  const { toast } = useToast();
  // Adicionar estado para favoritedSuppliers
  const [favoritedSuppliers, setFavoritedSuppliers] = useState<{
    [id: string]: boolean;
  }>(() => Object.fromEntries(suppliers.map((s) => [s.id, !!s.pinned])));

  // Adicionar estado para conexões
  const [connectedSuppliers, setConnectedSuppliers] = useState<{
    [id: string]: boolean;
  }>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <MainSectionLayout headerTitle="SpacePhoneBC" rightContent={
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar fornecedor..."
          className="pl-9 rounded-full border-0 font-normal bg-sidebar shadow-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    }>
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
            <p className="text-muted-foreground text-sm font-normal mt-1">
              Conecte-se com os parceiros comerciais da sua região
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          {/* <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedor..."
              className="pl-9 rounded-full border-0 font-normal bg-sidebar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}

          <div className="flex items-center gap-2">

          </div>
        </div>

        {/* Suppliers Grid */}
        <div className={`grid gap-4 ${viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
          }`}>
          {suppliers
            .filter((supplier) => {
              if (!searchQuery.trim()) return true;

              const query = searchQuery.toLowerCase();
              return (
                supplier.name.toLowerCase().includes(query) ||
                (supplier.location && supplier.location.toLowerCase().includes(query)) ||
                supplier.status.toLowerCase().includes(query)
              );
            })
            .sort((a, b) => {
              // Primeiro os favoritados, depois os não favoritados
              const aFavorited = favoritedSuppliers[a.id];
              const bFavorited = favoritedSuppliers[b.id];

              if (aFavorited && !bFavorited) return -1;
              if (!aFavorited && bFavorited) return 1;
              return 0;
            })
            .map((supplier) => (
              <Link key={supplier.id} href={`/dashboard/fornecedores/${supplier.username}`}>
                <Card
                  className="cursor-pointer gap-3 py-4 transition-transform duration-200 hover:scale-102"
                >
                  <CardHeader className="px-4 w-full">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center w-full gap-2">
                        <div className={`shrink-0 relative`}>
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
                          {favoritedSuppliers[supplier.id] && (
                            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                              <Heart fill="white" className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 w-full">
                          <div className="w-full flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-sm truncate">{supplier.name}</h3>
                            <Badge
                              className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}
                            >
                              {supplier.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground truncate">{supplier.location}</p>
                        </div>
                      </div>

                      {/* <DropdownMenu>
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
                  </DropdownMenu> */}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 px-4">
                    <div className="space-y-3">

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="h-3 w-3" />
                          {supplier.productsCount} produtos
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Última atualização: {getRelativeTime(supplier.lastUpdate)}</span>
                        </div>
                      </div>

                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 px-4">
                    <div className="w-full space-y-4">
                      {/* Reputação com ícone e título */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getReputationColor(supplier.reputation)}`}>
                            {supplier.reputation === 5 ? (
                              <Sparkles className="h-3 w-3 text-white fill-white" />
                            ) : supplier.reputation === 4 ? (
                              <Star className="h-3 w-3 text-white fill-white" />
                            ) : supplier.reputation === 3 ? (
                              <Shield className="h-3 w-3 text-white fill-white" />
                            ) : supplier.reputation === 2 ? (
                              <Zap className="h-3 w-3 text-white fill-white" />
                            ) : (
                              <HelpCircle className="h-3 w-3 text-white fill-white" />
                            )}
                          </div>
                          <div>
                            <h4 className={`text-xs font-semibold ${supplier.reputation === 5 ? "text-green-600" :
                              supplier.reputation === 4 ? "text-blue-600" :
                                supplier.reputation === 3 ? "text-yellow-600" :
                                  supplier.reputation === 2 ? "text-orange-600" : "text-red-600"
                              }`}>
                              {supplier.reputation === 5 ? "Excelente" :
                                supplier.reputation === 4 ? "Muito Bom" :
                                  supplier.reputation === 3 ? "Bom" :
                                    supplier.reputation === 2 ? "Regular" : "Baixo"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {supplier.reputation === 5 ? "Excelente reputação!" :
                                supplier.reputation === 4 ? "Muito confiável" :
                                  supplier.reputation === 3 ? "Em desenvolvimento" :
                                    supplier.reputation === 2 ? "Iniciante" : "Novo"}
                            </p>
                          </div>
                        </div>

                        {/* Barra de reputação */}
                        <div className="flex items-center gap-1 w-full">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 ${level === 1
                                ? 'rounded-l-full'
                                : level === 5
                                  ? 'rounded-r-full'
                                  : ''
                                } ${level <= supplier.reputation
                                  ? getReputationColor(supplier.reputation)
                                  : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Métricas de performance */}
                      <div className="flex fle-row justify-between px-2 pt-1">
                        <div className="flex flex-col items-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-1">
                              <Package className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">
                              {supplier.productsCount}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">Produtos</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 ${supplier.status === "active"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900"
                              }`}>
                              <span className={`text-xs ${supplier.status === "active"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                                }`}>
                                {supplier.status === "active" ? "✓" : "✗"}
                              </span>
                            </div>
                            <p className={`text-xs font-medium ${supplier.status === "active"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                              }`}>
                              {supplier.status === "active" ? "Ativo" : "Inativo"}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">Status</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-1">
                              <Star className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">
                              {supplier.reputation}/5
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">Avaliação</p>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
        </div>

      </div>
    </MainSectionLayout>
  );
}

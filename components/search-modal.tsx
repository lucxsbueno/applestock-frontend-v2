"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Command, X, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "product" | "order" | "customer" | "category";
  url: string;
  icon?: string;
}

// Mock data para demonstração
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "iPhone 15 Pro",
    description: "Produto em estoque - 23 unidades disponíveis",
    type: "product",
    url: "/products/iphone-15-pro",
    icon: "📱"
  },
  {
    id: "2",
    title: "Pedido #12345",
    description: "Status: Em preparação - Cliente: João Silva",
    type: "order",
    url: "/orders/12345",
    icon: "📦"
  },
  {
    id: "3",
    title: "Maria Santos",
    description: "Cliente VIP - 15 pedidos realizados",
    type: "customer",
    url: "/customers/maria-santos",
    icon: "👤"
  },
  {
    id: "4",
    title: "Smartphones",
    description: "Categoria com 45 produtos",
    type: "category",
    url: "/categories/smartphones",
    icon: "📱"
  },
  {
    id: "5",
    title: "Samsung Galaxy S24",
    description: "Produto em estoque - 12 unidades disponíveis",
    type: "product",
    url: "/products/samsung-galaxy-s24",
    icon: "📱"
  },
  {
    id: "6",
    title: "Pedido #12346",
    description: "Status: Entregue - Cliente: Ana Costa",
    type: "order",
    url: "/orders/12346",
    icon: "📦"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "product":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "order":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "customer":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "category":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "product":
      return "Produto";
    case "order":
      return "Pedido";
    case "customer":
      return "Cliente";
    case "category":
      return "Categoria";
    default:
      return "Item";
  }
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, resolvedTheme } = useTheme();

  const isDark = theme === "dark" || resolvedTheme === "dark";

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simular delay de busca
    const timer = setTimeout(() => {
      const filtered = mockSearchResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    console.log(`Navegando para: ${result.url}`);
    // Aqui você pode implementar a navegação real
    onClose();
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 border-0" showCloseButton={false}>
        <DialogHeader className="p-4 border-b border-slate-200/50 dark:border-sidebar">
          <DialogTitle className="sr-only">Pesquisa rápida</DialogTitle>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 flex flex-row items-center justify-center">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              ref={inputRef}
              placeholder="Pesquisar produtos, pedidos, clientes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="dark:bg-card border-0 font-medium placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-transparent cursor-pointer"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {query.trim() === "" ? (
            <div className="px-6 py-12 text-center">
              <Command className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-muted-foreground">Pesquisa rápida</h3>
              <p className="text-muted-foreground font-normal text-sm mb-6">
                Digite para buscar produtos, pedidos, clientes e mais
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs bg-slate-200/50 dark:bg-sidebar">
                  ⌘K
                </Badge>
                <Badge variant="secondary" className="text-xs bg-slate-200/50 dark:bg-sidebar">
                  ↑↓ Navegar
                </Badge>
                <Badge variant="secondary" className="text-xs bg-slate-200/50 dark:bg-sidebar">
                  Enter Selecionar
                </Badge>
                <Badge variant="secondary" className="text-xs bg-slate-200/50 dark:bg-sidebar">
                  Esc Fechar
                </Badge>
              </div>
            </div>
          ) : isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground text-sm mt-2">Buscando...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground text-sm">
                Tente usar termos diferentes ou verificar a ortografia
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`px-6 py-3 cursor-pointer transition-colors ${index === selectedIndex
                      ? "bg-card"
                      : "hover:bg-card/50"
                    }`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">{result.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{result.title}</h4>
                        <Badge
                          variant="secondary"
                          className={`text-xs rounded-full ${getTypeColor(result.type)}`}
                        >
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {result.description}
                      </p>
                    </div>
                    {index === selectedIndex && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ArrowRight className="h-3 w-3" />
                        <span>Enter</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="px-6 py-3 border-t dark:border-t-sidebar bg-sidebar rounded-b-lg text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>{results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" />
                  Navegar
                </span>
                <span className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Selecionar
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 
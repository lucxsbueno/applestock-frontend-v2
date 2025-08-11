"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Smartphone, Package, Notebook, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export function StockTabs() {
	const pathname = usePathname();

	return (
		<div className="px-6 mt-4">
			<div className="flex border-b border-zinc-200">
				<Link
					href="/dashboard/estoque"
					className={cn(
						"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2",
						pathname === "/dashboard/estoque"
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
					)}
				>
					<Smartphone className="w-4 h-4" />
					Celulares
				</Link>
				<Link
					href="/dashboard/estoque/macbooks"
					className={cn(
						"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2",
						pathname === "/dashboard/estoque/macbooks"
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
					)}
				>
					<Laptop className="w-4 h-4" />
					MacBooks
				</Link>
				<Link
					href="/dashboard/estoque/produtos"
					className={cn(
						"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2",
						pathname === "/dashboard/estoque/produtos"
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
					)}
				>
					<Package className="w-4 h-4" />
					Produtos
				</Link>
			</div>
		</div>
	);
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/app/dashboard/estoque/mock-data";

export function StockTabs() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentType = searchParams.get("type") || "all";

	const [activeTab, setActiveTab] = useState(currentType);

	// Contar produtos por tipo
	const productCounts = {
		all: mockProducts.length,
		iphone: mockProducts.filter(p => p.productType === "iphone").length,
		macbook: mockProducts.filter(p => p.productType === "macbook").length,
		accessory: mockProducts.filter(p => p.productType === "accessory").length,
	};

	const tabs = [
		{ key: "all", label: "Todos", count: productCounts.all },
		{ key: "iphone", label: "iPhone", count: productCounts.iphone },
		{ key: "macbook", label: "MacBook", count: productCounts.macbook },
		{ key: "accessory", label: "Acessórios", count: productCounts.accessory },
	];

	const handleTabChange = (type: string) => {
		setActiveTab(type);
		
		const params = new URLSearchParams(searchParams);
		if (type === "all") {
			params.delete("type");
		} else {
			params.set("type", type);
		}
		
		router.push(`/dashboard/estoque?${params.toString()}`);
	};

	return (
		<div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="flex items-center space-x-6">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							onClick={() => handleTabChange(tab.key)}
							className={`flex items-center space-x-2 border-b-2 px-1 py-2 text-sm font-medium transition-colors hover:text-foreground/80 ${
								activeTab === tab.key
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground"
							}`}
						>
							<span>{tab.label}</span>
							<Badge
								variant="secondary"
								className="ml-1 rounded-full px-2 py-0 text-xs font-normal"
							>
								{tab.count}
							</Badge>
						</button>
					))}
				</div>
			</div>
		</div>
	);
} 
"use client";

import { MainSectionLayout } from "@/components/main-section-layout";
import { StockTabs } from "@/components/dashboard/stock/stock-tabs";

interface StockPageProps {
	children: React.ReactNode;
}

export default function StockPage({ children }: StockPageProps) {
	return (
		<MainSectionLayout headerTitle="SpacePhoneBC">
			<div className="sticky top-0 bg-background z-10">
				<div className="px-6">
					<h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
					<p className="text-muted-foreground text-sm font-normal mt-1">
						Adicione produtos e gerencie seu estoque
					</p>
				</div>
				{/* Tabs Navigation */}
				<StockTabs />
			</div>
			{/* Content */}
			{children}
		</MainSectionLayout>
	);
}

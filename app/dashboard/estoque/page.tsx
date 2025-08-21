"use client";

import { useState, useMemo, useEffect } from "react";

import {
	Plus,
	Edit,
	Trash2,
	Search,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Copy,
	Filter,
	BatteryFull,
	BatteryLow,
	BatteryMedium,
	X,
	Check,
	Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { mockProducts, productTypes, Product } from "./mock-data";
import { MainSectionLayout } from "@/components/main-section-layout";



type SortConfig = {
	key: string;
	direction: "asc" | "desc";
};

type Filters = {
	productType: string;
	status: string;
	priceRange: [number, number];
	batteryRange: [number, number];
	grade: string;
	color: string;
	storageRange: [number, number];
};

const defaultFilters: Filters = {
	productType: "all",
	status: "all",
	priceRange: [0, 15000],
	batteryRange: [0, 100],
	grade: "all",
	color: "all",
	storageRange: [0, 2000],
};

export default function StockPage() {
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const urlProductType = searchParams.get("type");
	
	const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "name",
		direction: "asc",
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<Filters>({
		...defaultFilters,
		productType: "all" // All como padrão
	});
	const [tempFilters, setTempFilters] = useState<Filters>(filters);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	// Sincronizar com mudanças na URL
	useEffect(() => {
		const urlCategory = searchParams.get("categoria");
		if (urlCategory) {
			const productType = reverseCategoryMap[urlCategory as keyof typeof reverseCategoryMap] || "all";
			if (productType !== filters.productType) {
				setFilters(prev => ({
					...prev,
					productType: productType
				}));
			}
		}
	}, [searchParams, filters.productType]);

	// Mapeamento de categorias para português
	const categoryMap = {
		"all": "tudo",
		"iphone": "iphone",
		"macbook": "macbook", 
		"accessory": "acessorios"
	};

	// Mapeamento reverso (português para inglês)
	const reverseCategoryMap = {
		"tudo": "all",
		"iphone": "iphone",
		"macbook": "macbook",
		"acessorios": "accessory"
	};

	// Definir query param padrão se não existir
	useEffect(() => {
		const urlCategory = searchParams.get("categoria");
		if (!urlCategory) {
			const params = new URLSearchParams(searchParams);
			params.set("categoria", "tudo");
			router.push(`/dashboard/estoque?${params.toString()}`);
		}
	}, []);



	// Reset para primeira página quando mudar itemsPerPage
	const handleItemsPerPageChange = (value: string) => {
		setItemsPerPage(Number(value));
		setCurrentPage(1);
	};

	const handleSheetOpenChange = (open: boolean) => {
		if (open) {
			setTempFilters(filters);
		}
		setIsFilterSheetOpen(open);
	};

	const handleApplyFilters = () => {
		setFilters(tempFilters);
		setIsFilterSheetOpen(false);
	};

	const handleClearFilters = () => {
		setTempFilters(defaultFilters);
	};

	const handleSort = (key: string) => {
		setSortConfig((current) => ({
			key,
			direction:
				current.key === key && current.direction === "asc" ? "desc" : "asc",
		}));
	};

	// Função para obter valor de atributo com fallback
	const getAttributeValue = (product: Product, key: string) => {
		return product.attributes[key] || "";
	};

	// Função para renderizar valor baseado no tipo
	const renderAttributeValue = (product: Product, key: string, type?: string) => {
		const value = getAttributeValue(product, key);
		
		if (type === "image") {
			return (
				<div className="w-10 h-10 flex items-center justify-center">
					{product.mainPicture ? (
						<img 
							src={product.mainPicture} 
							alt={product.name}
							className="w-10 h-10 rounded-lg object-cover"
							onError={(e) => {
								e.currentTarget.style.display = 'none';
								e.currentTarget.nextElementSibling?.classList.remove('hidden');
							}}
						/>
					) : null}
					<div className={`w-10 h-10 rounded-lg bg-gray-200/50 flex items-center justify-center ${product.mainPicture ? 'hidden' : ''}`}>
						<Image className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
					</div>
				</div>
			);
		}
		
		if (type === "percentage" && typeof value === "number") {
			return (
				<div className="px-2 flex items-center gap-1.5">
					{value >= 90 ? (
						<BatteryFull className="h-4 w-4 text-green-600" />
					) : value >= 80 ? (
						<BatteryMedium className="h-4 w-4 text-yellow-600" />
					) : (
						<BatteryLow className="h-4 w-4 text-red-600" />
					)}
					<span
						className={`text-sm ${value >= 90
							? "text-green-600"
							: value >= 80
								? "text-yellow-600"
								: "text-red-600"
							}`}
					>
						{value}%
					</span>
				</div>
			);
		}

		if (type === "boolean") {
			return (
				<div className="px-2">
					{value ? (
						<Check className="h-4 w-4 text-green-600" />
					) : (
						<X className="h-4 w-4 text-red-600" />
					)}
				</div>
			);
		}

		if (type === "enum" && key === "grade") {
			const gradeMap: Record<string, string> = {
				"A": "Ótimo",
				"B": "Muito Bom", 
				"C": "Bom",
				"D": "Regular"
			};
			
			const gradeText = gradeMap[value as string] || `Grade ${value}`;
			
			return (
				<Badge 
					variant={value === "A" ? "default" : value === "B" ? "secondary" : "outline"}
					className="rounded-2xl text-xs"
				>
					{gradeText}
				</Badge>
			);
		}

		if (type === "number" && key === "storageGb") {
			return <span className="text-sm px-2">{value}GB</span>;
		}

		// Fallback para qualquer outro tipo
		return <span className="text-sm px-2">{String(value)}</span>;
	};

	const filteredProducts = useMemo(() => {
		return mockProducts.filter((product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
				getAttributeValue(product, "color").toLowerCase().includes(searchQuery.toLowerCase());

			const matchesProductType =
				filters.productType === "all" || product.productType === filters.productType;

			const matchesStatus =
				filters.status === "all" || product.status === filters.status;

			const matchesPrice =
				product.price >= filters.priceRange[0] &&
				product.price <= filters.priceRange[1];

			const matchesBattery = (() => {
				const battery = getAttributeValue(product, "batteryHealthPct");
				if (typeof battery !== "number") return true;
				return battery >= filters.batteryRange[0] && battery <= filters.batteryRange[1];
			})();

			const matchesGrade =
				filters.grade === "all" || getAttributeValue(product, "grade") === filters.grade;

			const matchesColor =
				filters.color === "all" || getAttributeValue(product, "color") === filters.color;

			const matchesStorage = (() => {
				const storage = getAttributeValue(product, "storageGb");
				if (typeof storage !== "number") return true;
				return storage >= filters.storageRange[0] && storage <= filters.storageRange[1];
			})();

			return (
				matchesSearch &&
				matchesProductType &&
				matchesStatus &&
				matchesPrice &&
				matchesBattery &&
				matchesGrade &&
				matchesColor &&
				matchesStorage
			);
		});
	}, [mockProducts, searchQuery, filters.productType, filters.status, filters.priceRange, filters.batteryRange, filters.grade, filters.color, filters.storageRange]);

	const sortedProducts = useMemo(() => {
		return [...filteredProducts].sort((a, b) => {
			const aValue = sortConfig.key === "price" || sortConfig.key === "cost" || sortConfig.key === "quantity"
				? a[sortConfig.key as keyof Product]
				: getAttributeValue(a, sortConfig.key);
			
			const bValue = sortConfig.key === "price" || sortConfig.key === "cost" || sortConfig.key === "quantity"
				? b[sortConfig.key as keyof Product]
				: getAttributeValue(b, sortConfig.key);

			if (typeof aValue === "number" && typeof bValue === "number") {
				return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
			}

			const aString = String(aValue);
			const bString = String(bValue);
			return sortConfig.direction === "asc"
				? aString.localeCompare(bString)
				: bString.localeCompare(aString);
		});
	}, [filteredProducts, sortConfig.key, sortConfig.direction]);

	const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

	// Função para calcular as 5 páginas visíveis
	const getVisiblePages = () => {
		if (totalPages <= 5) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		let startPage = Math.max(1, currentPage - 2);
		let endPage = startPage + 4;

		if (endPage > totalPages) {
			endPage = totalPages;
			startPage = Math.max(1, endPage - 4);
		}

		return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	};

	const paginatedProducts = sortedProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleCopyRow = (product: Product) => {
		const grade = getAttributeValue(product, "grade");
		const color = getAttributeValue(product, "color");
		const storage = getAttributeValue(product, "storageGb");
		const battery = getAttributeValue(product, "batteryHealthPct");
		const hasBox = getAttributeValue(product, "hasBox");
		const isSealed = getAttributeValue(product, "isSealed");

		const formattedData = `${product.name} ${storage ? storage + "GB" : ""} ${color} - R$${product.price.toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})} - 🔋 ${battery}% ${hasBox ? "Com caixa" : ""} ${isSealed ? "Lacrado" : "Seminovo"} - Grade ${grade}`;

		navigator.clipboard.writeText(formattedData);
		toast("Copiado!", {
			description: "Informações do produto copiadas com sucesso",
			duration: 2000,
		});
	};

	// Obter colunas dinâmicas baseadas no tipo de produto selecionado
	const dynamicColumns = useMemo(() => {
		
		// Sempre incluir colunas base
		const baseColumns = [
			{ key: "image", label: "Foto", type: "image" },
			{ key: "name", label: "Produto", type: "string" },
			{ key: "price", label: "Preço", type: "number" },
			{ key: "quantity", label: "UND", type: "number" },
		];

		// Para tipos específicos, adicionar colunas baseadas no tipo
		if (filters.productType === "iphone") {
			return [
				...baseColumns,
				{ key: "storageGb", label: "Storage", type: "number" },
				{ key: "color", label: "Color", type: "string" },
				{ key: "batteryHealthPct", label: "Battery", type: "percentage" },
				{ key: "grade", label: "Grade", type: "enum" },
				{ key: "hasBox", label: "Has Box", type: "boolean" },
				{ key: "isSealed", label: "Sealed", type: "boolean" },
			];
		}

		if (filters.productType === "macbook") {
			return [
				...baseColumns,
				{ key: "storageGb", label: "Storage", type: "number" },
				{ key: "ramGb", label: "RAM", type: "number" },
				{ key: "processor", label: "Processor", type: "string" },
				{ key: "color", label: "Color", type: "string" },
				{ key: "batteryHealthPct", label: "Battery", type: "percentage" },
				{ key: "grade", label: "Grade", type: "enum" },
			];
		}

		if (filters.productType === "accessory") {
			return [
				...baseColumns,
				{ key: "material", label: "Material", type: "string" },
				{ key: "color", label: "Color", type: "string" },
				{ key: "compatibleModel", label: "Compatible with", type: "string" },
				{ key: "size", label: "Size", type: "string" },
			];
		}

		// Para "all", mostrar apenas colunas base
		return baseColumns;
	}, [filters.productType]);
	
	return (
		<MainSectionLayout headerTitle="SpacePhoneBC">
			<div className="bg-background">
				<div className="px-6">
					<h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
					<p className="text-muted-foreground text-sm font-normal mt-1">
						Adicione produtos e gerencie seu estoque
					</p>
				</div>
			</div>
		<div>
			{/* Content */}
			<div className="px-4 mt-4">
				{/* Seletor de Categoria */}

				<div className="space-x-4">
					<div className="flex justify-between mb-4">
						<p className="text-muted-foreground font-normal text-sm mt-2 px-4 flex flex-row items-center gap-3">
							<span className="w-2 h-2 bg-green-500 rounded-full flex"></span>
							{filteredProducts.length} itens em estoque
						</p>

						<div className="flex items-center justify-center gap-2">
							{/* Select de Categorias */}
							<Select
								value={filters.productType}
								onValueChange={(value) => {
									setFilters(prev => ({ ...prev, productType: value }));
									setCurrentPage(1);
									
									// Atualizar URL
									const params = new URLSearchParams(searchParams);
									const categoryParam = categoryMap[value as keyof typeof categoryMap];
									params.set("categoria", categoryParam);
									router.push(`/dashboard/estoque?${params.toString()}`);
								}}
							>
								<SelectTrigger className="w-48 rounded-full border-0 bg-sidebar shadow-none cursor-pointer">
									<SelectValue className="border-0">
										<div className="flex items-center gap-2">
											<span className="text-lg">
												{filters.productType === "all" && "📦"}
												{filters.productType === "iphone" && "📱"}
												{filters.productType === "macbook" && "💻"}
												{filters.productType === "accessory" && "🔧"}
											</span>
											<span className="text-sm font-medium">
												{filters.productType === "all" && "Tudo"}
												{filters.productType === "iphone" && "iPhone"}
												{filters.productType === "macbook" && "MacBook"}
												{filters.productType === "accessory" && "Acessórios"}
											</span>
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="w-48">
									<SelectItem value="all">
										<div className="flex items-center gap-2">
											<span className="text-lg">📦</span>
											<span>Tudo</span>
										</div>
									</SelectItem>
									<SelectItem value="iphone">
										<div className="flex items-center gap-2">
											<span className="text-lg">📱</span>
											<span>iPhone</span>
										</div>
									</SelectItem>
									<SelectItem value="macbook">
										<div className="flex items-center gap-2">
											<span className="text-lg">💻</span>
											<span>MacBook</span>
										</div>
									</SelectItem>
									<SelectItem value="accessory">
										<div className="flex items-center gap-2">
											<span className="text-lg">🔧</span>
											<span>Acessórios</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>

							{/* Search */}
							<div className="relative w-72">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Buscar produtos..."
									className="pl-9 rounded-full border-0 font-normal bg-sidebar shadow-none"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							<div className="flex items-center justify-center gap-2">
								<Sheet
									open={isFilterSheetOpen}
									onOpenChange={handleSheetOpenChange}
								>
									<SheetTrigger asChild>
										<Button
											variant="outline"
											className="text-xs cursor-pointer gap-1.5 rounded-full border-0 bg-card font-semibold shadow-none"
										>
											<Filter className="h-4 w-4" />
										</Button>
									</SheetTrigger>
									<SheetContent>
										<SheetHeader>
											<SheetTitle>Filtros</SheetTitle>
											<SheetDescription>
												Refine sua busca de produtos no estoque.
											</SheetDescription>
										</SheetHeader>
										<div className="grid gap-6 p-4 pt-0">
											<div className="grid gap-3">
												<Label>Tipo de Produto</Label>
												<Select
													value={tempFilters.productType}
													onValueChange={(value) =>
														setTempFilters((prev) => ({ ...prev, productType: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Filtrar por tipo" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">Tudo</SelectItem>
														<SelectItem value="iphone">iPhone</SelectItem>
														<SelectItem value="macbook">MacBook</SelectItem>
														<SelectItem value="accessory">Acessórios</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="grid gap-3">
												<Label>Status</Label>
												<Select
													value={tempFilters.status}
													onValueChange={(value) =>
														setTempFilters((prev) => ({ ...prev, status: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Filtrar por status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">Todos os status</SelectItem>
														<SelectItem value="in_stock">Em estoque</SelectItem>
														<SelectItem value="reserved">Reservado</SelectItem>
														<SelectItem value="repair">Em reparo</SelectItem>
														<SelectItem value="sold">Vendido</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<Separator />

											<div className="grid gap-3">
												<Label>Faixa de Preço</Label>
												<Slider
													value={tempFilters.priceRange}
													onValueChange={(value) =>
														setTempFilters((prev) => ({
															...prev,
															priceRange: value as [number, number],
														}))
													}
													min={0}
													max={15000}
													step={100}
												/>
												<div className="flex justify-between text-sm text-muted-foreground">
													<span>R$ {tempFilters.priceRange[0]}</span>
													<span>R$ {tempFilters.priceRange[1]}</span>
												</div>
											</div>

											<Separator />

											<div className="grid gap-3">
												<Label>Saúde da Bateria</Label>
												<Slider
													value={tempFilters.batteryRange}
													onValueChange={(value) =>
														setTempFilters((prev) => ({
															...prev,
															batteryRange: value as [number, number],
														}))
													}
													min={0}
													max={100}
													step={1}
												/>
												<div className="flex justify-between text-sm text-muted-foreground">
													<span>{tempFilters.batteryRange[0]}%</span>
													<span>{tempFilters.batteryRange[1]}%</span>
												</div>
											</div>

											<Separator />

											<div className="grid gap-3">
												<Label>Armazenamento (GB)</Label>
												<Slider
													value={tempFilters.storageRange}
													onValueChange={(value) =>
														setTempFilters((prev) => ({
															...prev,
															storageRange: value as [number, number],
														}))
													}
													min={0}
													max={2000}
													step={64}
												/>
												<div className="flex justify-between text-sm text-muted-foreground">
													<span>{tempFilters.storageRange[0]}GB</span>
													<span>{tempFilters.storageRange[1]}GB</span>
												</div>
											</div>

											<Separator />

											<div className="grid gap-3">
												<Label>Grade</Label>
												<Select
													value={tempFilters.grade}
													onValueChange={(value) =>
														setTempFilters((prev) => ({ ...prev, grade: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Filtrar por grade" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">Todas as grades</SelectItem>
														<SelectItem value="A">Grade A</SelectItem>
														<SelectItem value="B">Grade B</SelectItem>
														<SelectItem value="C">Grade C</SelectItem>
														<SelectItem value="D">Grade D</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<Separator />

											<div className="grid gap-3">
												<Label>Cor</Label>
												<Select
													value={tempFilters.color}
													onValueChange={(value) =>
														setTempFilters((prev) => ({ ...prev, color: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Filtrar por cor" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">Todas as cores</SelectItem>
														<SelectItem value="Midnight">Midnight</SelectItem>
														<SelectItem value="Blue">Blue</SelectItem>
														<SelectItem value="Black">Black</SelectItem>
														<SelectItem value="White">White</SelectItem>
														<SelectItem value="Space Gray">Space Gray</SelectItem>
														<SelectItem value="Silver">Silver</SelectItem>
														<SelectItem value="black">Preto</SelectItem>
														<SelectItem value="white">Branco</SelectItem>
														<SelectItem value="transparent">Transparente</SelectItem>
														<SelectItem value="silver">Prateado</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<SheetFooter>
											<Button
												variant="outline"
												className="border-0 rounded-full"
												onClick={handleClearFilters}
											>
												Limpar Filtros
											</Button>
											<Button
												onClick={handleApplyFilters}
												className="rounded-full"
											>
												Aplicar
											</Button>
										</SheetFooter>
									</SheetContent>
								</Sheet>

								<Button
									className="cursor-pointer rounded-full text-xs font-semibold"
									onClick={() => {
										router.push("/dashboard/estoque/novo-produto");
									}}
								>
									<Plus className="h-4 w-4" />
									Novo Produto
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full overflow-x-scroll rounded-2xl">
					<Table key={filters.productType} className="bg-white dark:bg-card mb-2 w-full table-auto border-collapse sticky-table z-10">
						<TableHeader className="">
							<TableRow className="bg-white dark:bg-card hover:bg-white dark:hover:bg-card">
								{dynamicColumns.map((column) => (
									<TableHead key={column.key} className={column.key === "image" ? "w-[40px] p-0" : ""}>
										{column.key === "image" ? (
											<div className="w-10 h-10 flex items-center justify-center">
											</div>
										) : (
											<button
												onClick={() => handleSort(column.key)}
												className="cursor-pointer px-2 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group uppercase tracking-[1px] text-[12px]"
											>
												{column.label}
												<span className="opacity-0 group-hover:opacity-100 transition-opacity">
													<ArrowUpDown className="h-4 w-4" />
												</span>
											</button>
										)}
									</TableHead>
								))}

								<TableHead className="text-muted-foreground text-left uppercase tracking-[1px] text-[12px] px-4 w-[100px] rounded-tr-xl">
									Ações
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="font-normal text-xs">
							{paginatedProducts.map((product) => (
								<TableRow
									key={product.id}
									className="cursor-pointer !text-foreground hover:bg-slate-50/50 dark:hover:bg-background/50 border-b border-slate-100/50 dark:border-zinc-900"
								>
									{dynamicColumns.map((column, index) => (
										<TableCell 
											key={column.key}
											contentEditable={column.type !== "percentage" && column.type !== "boolean" && column.type !== "enum"}
											className={`${index > 0 ? "border-l border-slate-100/50 dark:border-zinc-900" : ""} focus:outline focus:outline-offset focus:outline-dashed focus:outline-blue-600`}
										>
											{column.key === "image" ? (
												renderAttributeValue(product, column.key, "image")
											) : column.key === "name" ? (
												<div className="space-y-0.5 px-2 py-1">
													<div className="text-sm">
														{product.name}
														{getAttributeValue(product, "storageGb") && ` ${getAttributeValue(product, "storageGb")}GB`}
													</div>
												</div>
											) : column.key === "price" ? (
												<span className="px-2 text-sm">
													R$
													{product.price.toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</span>
											) : column.key === "quantity" ? (
												<span className="text-sm px-2">{product.quantity}</span>
											) : column.type === "percentage" ? (
												renderAttributeValue(product, column.key, "percentage")
											) : column.type === "boolean" ? (
												renderAttributeValue(product, column.key, "boolean")
											) : column.type === "enum" ? (
												renderAttributeValue(product, column.key, "enum")
											) : column.type === "number" ? (
												renderAttributeValue(product, column.key, "number")
											) : (
												<span className="text-sm px-2">
													{String(getAttributeValue(product, column.key))}
												</span>
											)}
										</TableCell>
									))}

									<TableCell className="border-l border-slate-100/50 dark:border-zinc-900">
										<div className="flex items-center justify-start gap-1">
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 cursor-pointer"
												onClick={() => handleCopyRow(product)}
											>
												<Copy className="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
												<Edit className="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{/* Paginação e Itens por Página */}
				<div className="flex items-center justify-between px-4 mb-2">
					{/* Select Itens por Página */}
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground font-normal">
							Itens por página:
						</span>
						<Select
							value={itemsPerPage.toString()}
							onValueChange={handleItemsPerPageChange}
						>
							<SelectTrigger className="cursor-pointer h-8 w-16 text-sm font-medium rounded-full border-0 bg-card">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="15">15</SelectItem>
								<SelectItem value="17">17</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="30">30</SelectItem>
								<SelectItem value="50">50</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Paginação */}
					<div className="flex items-center gap-2">
						{/* Botão Primeiro */}
						<Button
							variant="ghost"
							size="sm"
							className="text-xs font-semibold cursor-pointer h-8 px-3 rounded-full hover:bg-muted/50"
							onClick={() => setCurrentPage(1)}
							disabled={currentPage === 1}
						>
							Primeiro
						</Button>

						{/* Botão << */}
						<Button
							variant="ghost"
							size="sm"
							className="text-xs font-semibold cursor-pointer h-8 w-8 p-0 rounded-full hover:bg-muted/50"
							onClick={() =>
								setCurrentPage((prev) => Math.max(prev - 5, 1))
							}
							disabled={currentPage <= 5}
						>
							<ChevronLeft className="h-4 w-4" />
							<ChevronLeft className="h-4 w-4 -ml-3" />
						</Button>

						{/* Botão < */}
						<Button
							variant="ghost"
							size="sm"
							className="text-xs font-semibold cursor-pointer h-8 w-8 p-0 rounded-full hover:bg-muted/50"
							onClick={() =>
								setCurrentPage((prev) => Math.max(prev - 1, 1))
							}
							disabled={currentPage === 1}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						{/* Páginas Visíveis (sempre 5) */}
						<div className="flex items-center gap-1">
							{getVisiblePages().map((page) => (
								<Button
									key={page}
									variant={page === currentPage ? "default" : "ghost"}
									size="sm"
									className={`font-semibold text-xs cursor-pointer h-8 w-8 p-0 rounded-full ${page === currentPage
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "hover:bg-muted/50"
										}`}
									onClick={() => setCurrentPage(page)}
								>
									{page}
								</Button>
							))}
						</div>

						{/* Botão > */}
						<Button
							variant="ghost"
							size="sm"
							className="font-semibold text-xs cursor-pointer h-8 w-8 p-0 rounded-full hover:bg-muted/50"
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>

						{/* Botão >> */}
						<Button
							variant="ghost"
							size="sm"
							className="font-semibold text-xs cursor-pointer h-8 w-8 p-0 rounded-full hover:bg-muted/50"
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages - 4}
						>
							<ChevronRight className="h-4 w-4" />
							<ChevronRight className="h-4 w-4 -ml-3" />
						</Button>

						{/* Botão Último */}
						<Button
							variant="ghost"
							size="sm"
							className="font-semibold text-xs cursor-pointer h-8 px-3 rounded-full hover:bg-muted/50"
							onClick={() => setCurrentPage(totalPages)}
							disabled={currentPage === totalPages}
						>
							Último
						</Button>
					</div>
				</div>
			</div>
		</div>
		</MainSectionLayout>
	);
} 
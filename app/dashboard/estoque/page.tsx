import { MainSectionLayout } from "@/components/main-section-layout";

export default function StockPage() {
  return (
    <MainSectionLayout headerTitle="Space Phone">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
        <p className="text-muted-foreground text-md mt-1">
          Adicione produtos e gerencie seu estoque
        </p>
      </div>
    </MainSectionLayout>
  );
}

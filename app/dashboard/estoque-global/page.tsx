import { MainSectionLayout } from "@/components/main-section-layout";

export default function GlobalStockPage() {
  return (
    <MainSectionLayout headerTitle="Space Phone">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Estoque global</h1>
        <p className="text-muted-foreground text-md mt-1">
          Acompanhe o estoque dos fornecedores
        </p>
      </div>
    </MainSectionLayout>
  );
}

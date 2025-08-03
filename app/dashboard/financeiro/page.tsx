import { MainSectionLayout } from "@/components/main-section-layout";

export default function BillPage() {
  return (
    <MainSectionLayout headerTitle="SpacePhoneBC">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cuide das suas contas aqui
        </p>
      </div>
    </MainSectionLayout>
  );
}

import { MainSectionLayout } from "@/components/main-section-layout";

export default function ConfigurationsPage() {
  return (
    <MainSectionLayout headerTitle="Space Phone">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure sua conta
        </p>
      </div>
    </MainSectionLayout>
  );
}

import { MainSectionLayout } from "../main-section-layout";

export function DashboardSection() {
  return (
    <MainSectionLayout headerTitle="Space Phone">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Página de perfil do usuário
        </p>
      </div>
    </MainSectionLayout>
  );
}

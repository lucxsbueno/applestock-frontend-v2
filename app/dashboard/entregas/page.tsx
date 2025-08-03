import { MainSectionLayout } from "@/components/main-section-layout";

export default function DeliveryPage() {
  return (
    <MainSectionLayout headerTitle="SpacePhoneBC">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Entregas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fique por dentro das suas entregas
        </p>
      </div>
    </MainSectionLayout>
  );
}

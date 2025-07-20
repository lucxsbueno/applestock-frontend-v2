import { MainSectionLayout } from "@/components/main-section-layout";

export default function ProfilePage() {
  return (
    <MainSectionLayout headerTitle="Space Phone">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground text-md mt-1">
          Página de perfil do usuário
        </p>
      </div>
    </MainSectionLayout>
  );
}

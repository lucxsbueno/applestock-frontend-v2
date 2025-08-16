import { MainSectionLayout } from "@/components/main-section-layout";
import React from "react";

interface ProfilePageProps {
  children: React.ReactNode;
}

export default function ProfilePage({ children }: ProfilePageProps) {
  return (
    <MainSectionLayout headerTitle="SpacePhoneBC" rightContent={<div>Editar</div>}>
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Página de perfil do usuário
        </p>
      </div>
      <div>{children}</div>
    </MainSectionLayout>
  );
}

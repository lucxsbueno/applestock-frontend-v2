"use client";

import { ReactNode } from "react";
import { DashboardHeaderWithBack } from "./dashboard/dashboard-header-with-back";

interface MainSectionLayoutWithBackProps {
  headerTitle: string;
  children: ReactNode;
  rightContent?: ReactNode;
  onBack?: () => void;
}

const MainSectionLayoutWithBack = ({
  headerTitle,
  children,
  rightContent,
  onBack,
}: MainSectionLayoutWithBackProps) => {
  return (
    <div className="w-full h-dvh flex flex-col">
      <DashboardHeaderWithBack title={headerTitle} rightContent={rightContent} onBack={onBack} />
      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  );
};

export { MainSectionLayoutWithBack }; 
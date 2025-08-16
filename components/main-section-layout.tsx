import { ReactNode } from "react";
import { DashboardHeader } from "./dashboard/dashboard-header";

interface MainSectionLayoutProps {
  headerTitle: string;
  children: ReactNode;
  rightContent?: ReactNode;
}

const MainSectionLayout = ({
  headerTitle,
  children,
  rightContent,
}: MainSectionLayoutProps) => {
  return (
    <div className="w-full h-dvh flex flex-col">
      <DashboardHeader title={headerTitle} rightContent={rightContent} />
      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  );
};

export { MainSectionLayout };

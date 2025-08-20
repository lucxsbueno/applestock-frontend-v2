"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Props {
  title: string;
  rightContent?: ReactNode;
  onBack?: () => void;
}

export function DashboardHeaderWithBack({ title, rightContent, onBack }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4 py-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="-ml-1 cursor-pointer size-7 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="h-5">
      <Separator orientation="vertical" className="mr-2" />
      </div>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      </div>
    </header>
  );
} 
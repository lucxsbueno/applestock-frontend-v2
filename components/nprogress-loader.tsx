"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function NProgressLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: "ease",
      speed: 500,
      trickleSpeed: 200,
    });
  }, []);

  useEffect(() => {
    // Finalizar o progresso quando a rota mudar
    NProgress.done();
  }, [pathname]);

  return null;
}

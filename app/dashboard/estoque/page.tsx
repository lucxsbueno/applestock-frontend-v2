"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EstoquePage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect para a página de celulares
		router.replace("/dashboard/estoque/celulares");
	}, [router]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<p className="text-muted-foreground">Redirecionando para Celulares...</p>
			</div>
		</div>
	);
}

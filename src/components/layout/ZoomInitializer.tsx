"use client";

import { usePathname } from "next/navigation";
import { ZoomProvider, PAGES } from "./ZoomContext";

export function ZoomInitializer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const initialPage = PAGES.indexOf(pathname) !== -1 ? PAGES.indexOf(pathname) : 0;

  return (
    <ZoomProvider initialPage={initialPage}>
      {children}
    </ZoomProvider>
  );
}

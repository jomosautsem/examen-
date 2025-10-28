"use client";

import type { ReactNode } from "react";
import { SyncManager } from "./SyncManager";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <SyncManager />
      {children}
    </>
  );
}

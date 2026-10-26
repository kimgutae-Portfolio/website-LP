"use client";

import { useEffect } from "react";
import { analyticsConfig } from "@/analytics.config";
import { clarityProjectId, startClarity, stopClarity } from "@/lib/clarity";

const id = clarityProjectId(analyticsConfig.clarityProjectId);

export function ClarityMeasurement({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active || !id) return;
    startClarity(id);
    return () => stopClarity();
  }, [active]);
  return null;
}

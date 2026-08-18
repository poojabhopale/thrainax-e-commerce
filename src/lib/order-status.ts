import type { OrderStatus } from "./types";

export const TRACKING_STEPS = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"] as const;

export function statusVariant(status: OrderStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "DELIVERED") return "default";
  if (status === "CANCELLED") return "destructive";
  if (status === "PLACED") return "outline";
  return "secondary";
}

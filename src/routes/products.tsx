import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/products")({
  component: () => <Outlet />,
});

export function useProductsPathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}

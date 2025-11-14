import { createRouter } from "@tanstack/solid-router";
import { setupRouterSsrQueryIntegration } from '@tanstack/solid-router-ssr-query'
import { QueryClient } from '@tanstack/solid-query'

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultStaleTime: 10000
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router;
};

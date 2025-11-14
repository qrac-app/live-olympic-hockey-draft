import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { HydrationScript } from "solid-js/web";
import { onMount, Suspense } from "solid-js";
import styleCss from "../styles.css?url";

import { fetchAuth } from "~/lib/server.ts";
import { AppConvexProvider, convexClient } from "~/lib/convex-client.tsx";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [{
      title: 'Live Olympic Hockey Draft',
    }, {
      name: 'description',
      content: 'Tanstack Start Hackathon Project',
    }],
    links: [{ rel: "stylesheet", href: styleCss }],
  }),
  beforeLoad: async () => {
    const { session, token } = await fetchAuth();
    return { session, token };
  },
  shellComponent: RootComponent,
});

function RootComponent() {
  const context = Route.useRouteContext();

  onMount(() => {
    convexClient.setAuth(async () => {
      return context().token;
    });
  })

  return (
    <html lang="en">
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        <Suspense>
          <AppConvexProvider>
            <Outlet />
            {import.meta.env.DEV && <TanStackRouterDevtools />}
          </AppConvexProvider>
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}

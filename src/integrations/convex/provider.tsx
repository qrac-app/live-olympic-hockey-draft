import { setupConvex, ConvexProvider } from "convex-solidjs";
import type { JSXElement } from "solid-js";
import { fetchAuth } from "~/lib/auth.ts";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("missing envar CONVEX_URL");
}

// Set up Convex client with Better Auth token
export const convexClient = setupConvex(CONVEX_URL);

convexClient.setAuth(async () => {
  const { token } = await fetchAuth();
  return token;
});

export default function AppConvexProvider(props: { children: JSXElement }) {
  return (
    <ConvexProvider client={convexClient}>{props.children}</ConvexProvider>
  );
}

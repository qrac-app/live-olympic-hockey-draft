import { setupConvex } from "convex-solidjs";
import { ConvexProvider } from "convex-solidjs";
import type { JSXElement } from "solid-js";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("missing envar CONVEX_URL");
}

// Set up Convex client with auth
export const convexClient = setupConvex(CONVEX_URL);

export function AppConvexProvider(props: { children: JSXElement }) {
  return (
    <ConvexProvider client={convexClient} > {props.children} </ConvexProvider>
  );
}

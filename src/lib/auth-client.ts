import { createAuthClient } from "better-auth/solid";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { reactStartCookies } from "better-auth/react-start";

export const authClient = createAuthClient({
  plugins: [convexClient(), reactStartCookies()],
});

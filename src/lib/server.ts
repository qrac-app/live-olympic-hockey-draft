import {
  fetchSession,
  getCookieName,
} from "@convex-dev/better-auth/react-start";
import { createServerFn } from "@tanstack/solid-start";
import { getCookie, getRequest } from "@tanstack/solid-start/server";
import { fetchQuery } from "./auth-server";
import { api } from "convex/_generated/api";

// Get auth information for SSR using available cookies
export const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { createAuth } = await import("../../convex/auth");
  const { session } = await fetchSession(getRequest());
  const sessionCookieName = getCookieName(createAuth);
  const token = getCookie(sessionCookieName);

  return {
    session,
    token,
  };
});

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = fetchQuery(api.auth.getCurrentUser, {});
  return user;
});

export const fetchUserDrafts = createServerFn({ method: "GET" }).handler(
  async () => {
    const drafts = fetchQuery(api.drafts.getUserDrafts, {});
    return drafts;
  }
);

export const fetchDraftPostData = createServerFn({ method: "GET" })
  .inputValidator((d: any) => d)
  .handler(
    async (ctx) => {
      const draftPromise = fetchQuery(api.drafts.getDraftById, { draftId: ctx.data.draftId });
      const teamsWithRostersPromise = fetchQuery(api.draftPicks.getDraftRosters, {
        draftId: ctx.data.draftId,
      });
      const draftStatsPromise = fetchQuery(api.draftPicks.getDraftStats, { draftId: ctx.data.draftId });

      const [draft, teamsWithRosters, draftStats] = await Promise.all([draftPromise, teamsWithRostersPromise, draftStatsPromise]);
      return { draft, teamsWithRosters, draftStats };
    }
  );


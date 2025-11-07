import {
  fetchSession,
  getCookieName,
} from "@convex-dev/better-auth/react-start";
import { createServerFn } from "@tanstack/solid-start";
import { redirect } from "@tanstack/solid-router";
import { getCookie, getRequest } from "@tanstack/solid-start/server";
import { fetchQuery } from "./auth-server";
import { api } from "convex/_generated/api";

// Get auth information for SSR using available cookies
export const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { createAuth } = await import("../../convex/auth");
  const request = getRequest();
  const { session } = await fetchSession(request);
  const sessionCookieName = getCookieName(createAuth);
  const token = getCookie(sessionCookieName);

  return {
    session,
    token,
  };
});

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const user = await fetchQuery(api.auth.getCurrentUser, {});
    return user;
  } catch (error) {
    throw redirect({ to: "/" });
  }
});

export const fetchUserDrafts = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const drafts = await fetchQuery(api.drafts.getUserDrafts, {});
      return drafts;
    } catch (error) {
      throw redirect({ to: "/" });
    }
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


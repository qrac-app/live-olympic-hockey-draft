import { createFileRoute, Navigate } from "@tanstack/solid-router";
import {
  createSignal,
  Show,
  onMount,
  onCleanup,
  createMemo,
} from "solid-js";
import { useQuery, useMutation } from "convex-solidjs";
import { api } from "../../../../../convex/_generated/api";
import { authClient } from "~/lib/auth-client";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "~/components/header";
import DraftHeader from "~/components/pre-draft/draft-header";
import CountdownTimer from "~/components/pre-draft/countdown-timer";
import ShareLink from "~/components/pre-draft/share-link";
import TeamsList from "~/components/pre-draft/teams-list";
import PreDraftActions from "~/components/pre-draft/pre-draft-actions";

export const Route = createFileRoute("/_authed/draft/$id/pre")({
  component: PreDraft,
});

function PreDraft() {
  const params = Route.useParams();
  const [timeRemaining, setTimeRemaining] = createSignal<number | null>(null);
  const draftId = params().id as Id<"drafts">;
  const session = authClient.useSession();

  // queries
  const { data: draft } = useQuery(api.drafts.getDraftById, { draftId });
  const { data: teams } = useQuery(api.draftTeams.getDraftTeams, { draftId });

  // mutations
  const { mutate: heartbeat } = useMutation(api.draftPresence.heartbeat);

  // Check if current user is host
  const isHost = (): boolean => {
    const user = session()?.data?.user;
    return !!(
      user &&
      draft?.() &&
      draft()!.hostBetterAuthUserId &&
      draft()!.hostBetterAuthUserId === user.id
    );
  };

  // Check if current user is part of the draft
  const isPartOfDraft = createMemo(() => {
    const userId = session()?.data?.user?.id;
    if (!userId || !teams?.()) return false;
    return teams()!.some((team) => team.betterAuthUserId === userId);
  });

  // Redirect to join page if user is not part of the draft
  const shouldRedirectToJoin = createMemo(() => {
    const draftData = draft?.();
    const teamsData = teams?.();
    // Only redirect if draft and teams are loaded, and user is not host and not part of draft
    return (
      draftData && teamsData !== undefined && !isHost() && !isPartOfDraft()
    );
  });

  // Redirect non-hosts when draft status changes to DURING
  const shouldRedirect = createMemo(() => {
    return !isHost() && draft?.() && draft()!.status === "DURING";
  });

  // Check if all data is loaded
  const isDataReady = createMemo(() => {
    return (
      draft?.() !== undefined &&
      teams?.() !== undefined &&
      session()?.data?.user !== undefined
    );
  });

  // Countdown timer
  onMount(() => {
    const updateCountdown = () => {
      if (draft?.()) {
        const now = Date.now();
        const startTime = draft()!.startDatetime;
        const remaining = startTime - now;
        setTimeRemaining(remaining > 0 ? remaining : 0);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Simplified presence: just call heartbeat every 15 seconds
    // Auto-cleanup handles stale entries, no need for manual removal
    heartbeat({ draftId });
    const presenceInterval = setInterval(() => {
      heartbeat({ draftId });
    }, 15000);

    onCleanup(() => {
      clearInterval(interval);
      clearInterval(presenceInterval);
    });
  });

  return (
    <>
      <Show when={shouldRedirectToJoin()}>
        <Navigate to="/draft/join" search={{ id: draftId }} />
      </Show>
      <Show when={shouldRedirect()}>
        <Navigate to="/draft/$id/during" params={{ id: draftId }} />
      </Show>
      <Show when={draft?.() && draft()!.status === "POST"}>
        <Navigate to="/draft/$id/post" params={{ id: params().id }} />
      </Show>
      <div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800">
        <Header />

        <Show when={!shouldRedirectToJoin() && !shouldRedirect()}>
          <div class="p-8">
            <div class="max-w-6xl mx-auto">
              {/* Main Content - Only show when data is ready */}
              <Show when={isDataReady()} fallback={<div class="flex flex-col items-center justify-center min-h-[60vh]">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
                <p class="text-slate-300 text-lg font-medium">Loading draft...</p>
              </div>}>
                <Show when={draft?.() && teams?.()}>
                  <DraftHeader
                    draft={draft()!}
                    teamCount={teams()!.length}
                  />
                  <CountdownTimer timeRemaining={timeRemaining()} />
                  <ShareLink draftId={draftId} />
                </Show>

                <TeamsList
                  teams={teams?.()}
                  currentUserId={session()?.data?.user?.id}
                  draftId={draftId}
                />

                <PreDraftActions
                  isHost={isHost()}
                  timeRemaining={timeRemaining()}
                  draftId={draftId}
                />
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
}

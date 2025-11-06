import { createFileRoute, useNavigate } from "@tanstack/solid-router";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { For, Show, createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { Header } from "~/components/header";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/_authed/draft/$id/during")({
  component: DuringDraft,
});

function DuringDraft() {
  const params = Route.useParams();
  const id = () => params().id;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = createSignal("");
  const [selectedPlayer, setSelectedPlayer] = createSignal<string | null>(null);

  const session = authClient.useSession();
  const draftId = id() as Id<"drafts">;
  const { data: draft } = useQuery(api.drafts.getDraftById, { draftId });
  const { data: currentPickData } = useQuery(api.drafts.getCurrentPick, { draftId });
  const { mutate: finishDraft } = useMutation(api.drafts.finishDraft);
  const { mutate: advancePick } = useMutation(api.drafts.advancePick);
  const [timeRemaining, setTimeRemaining] = createSignal<number>(45);
  const [hasAdvanced, setHasAdvanced] = createSignal<boolean>(false);

  const currentUserId = () => session()?.data?.user?.id;

  const isHost = () => {
    const user = session()?.data?.user;
    return user && draft?.() && draft()!.hostBetterAuthUserId && draft()!.hostBetterAuthUserId === user.id;
  };

  const isMyTurn = () => {
    const pick = currentPickData?.();
    const userId = currentUserId();
    return pick && userId && pick.team.betterAuthUserId === userId;
  };

  // Redirect to post page if draft is complete
  createEffect(() => {
    const draftData = draft?.();
    if (draftData && draftData.status === "POST") {
      navigate({ to: "/draft/$id/post", params: { id: id() } });
    }
  });

  // Countdown timer and auto-advance
  onMount(() => {
    const updateCountdown = () => {
      const pick = currentPickData?.();
      if (pick && pick.startTime) {
        const now = Date.now();
        const elapsed = now - pick.startTime;
        const remaining = Math.max(0, 45000 - elapsed); // 45 seconds
        setTimeRemaining(Math.floor(remaining / 1000));

        // Auto-advance if time is up (only once per pick)
        if (remaining <= 0 && !hasAdvanced()) {
          setHasAdvanced(true);
          advancePick({ draftId }).catch((err) => {
            console.error("Failed to advance pick:", err);
            setHasAdvanced(false); // Reset on error so it can retry
          });
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 100);

    onCleanup(() => clearInterval(interval));
  });

  // Reset countdown and advance flag when pick changes
  createEffect(() => {
    const pick = currentPickData?.();
    if (pick && pick.startTime) {
      setHasAdvanced(false); // Reset advance flag for new pick
      const now = Date.now();
      const elapsed = now - pick.startTime;
      const remaining = Math.max(0, 45000 - elapsed);
      setTimeRemaining(Math.floor(remaining / 1000));
    }
  });

  const availablePlayers = [
    { id: "1", name: "Connor McDavid", position: "C", team: "EDM" },
    { id: "2", name: "Auston Matthews", position: "C", team: "TOR" },
    { id: "3", name: "Nathan MacKinnon", position: "C", team: "COL" },
    { id: "4", name: "Cale Makar", position: "D", team: "COL" },
    { id: "5", name: "Connor Hellebuyck", position: "G", team: "WPG" },
  ];

  const recentPicks = [
    { team: "Lightning", player: "Leon Draisaitl", position: "C" },
    { team: "Penguins", player: "David Pastrnak", position: "RW" },
    { team: "Bruins", player: "Igor Shesterkin", position: "G" },
    { team: "Maple Leafs", player: "Victor Hedman", position: "D" },
  ];

  const makePick = () => {
    if (selectedPlayer()) {
      console.log("Making pick:", selectedPlayer());
      // TODO: Implement pick logic
      setSelectedPlayer(null);
    }
  };

  const handleFinishDraft = async () => {
    await finishDraft({ draftId: id() as Id<"drafts"> });
    navigate({ to: "/draft/$id/post", params: { id: id() } });
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800">
      <Header />
      <div class="p-6">
        <div class="max-w-7xl mx-auto">
          {/* Header with Current Pick Info */}
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-white mb-1">
                  {draft?.()?.name || "Draft"}
                </h1>
                <Show when={currentPickData?.()}>
                  {(pick) => (
                    <p class="text-slate-300">
                      Round {pick().round} • Pick #{pick().pickNumber}
                    </p>
                  )}
                </Show>
              </div>
              <span class="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg font-medium border border-red-600/30 animate-pulse">
                LIVE
              </span>
            </div>

            {/* On The Clock */}
            <Show
              when={currentPickData?.()}
              fallback={
                <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
                  <p class="text-white">Loading...</p>
                </div>
              }
            >
              {(pick) => {
                const myTurn = isMyTurn();
                return (
                  <div class={`rounded-lg p-4 border ${myTurn
                      ? "bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-green-500/50 ring-2 ring-green-500/50"
                      : "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30"
                    }`}>
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <p class="text-sm text-slate-300">ON THE CLOCK</p>
                          {myTurn && (
                            <span class="px-2 py-0.5 bg-green-500/30 text-green-300 text-xs font-bold rounded-full border border-green-500/50 animate-pulse">
                              YOUR TURN
                            </span>
                          )}
                        </div>
                        <p class="text-2xl font-bold text-white">
                          {pick().team.teamName}
                        </p>
                        <p class="text-slate-400 text-sm">Pick #{pick().pickNumber}</p>
                      </div>
                      <div class="text-center">
                        <div class={`text-4xl font-bold ${timeRemaining() <= 10 ? "text-red-400" : myTurn ? "text-green-300" : "text-white"}`}>
                          {timeRemaining()}s
                        </div>
                        <p class="text-slate-400 text-sm">remaining</p>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Show>

            {/* Your Turn Banner */}
            <Show when={isMyTurn()}>
              <div class="bg-gradient-to-r from-green-600/40 to-emerald-600/40 rounded-lg p-4 border-2 border-green-500/50 mb-6 animate-pulse">
                <div class="flex items-center justify-center gap-3">
                  <div class="text-3xl">⏰</div>
                  <div>
                    <p class="text-xl font-bold text-white">It's Your Turn to Pick!</p>
                    <p class="text-green-200 text-sm">You have {timeRemaining()} seconds remaining</p>
                  </div>
                </div>
              </div>
            </Show>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Players - Only show when it's your turn */}
            <Show
              when={isMyTurn()}
              fallback={
                <div class="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-6 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-6xl mb-4">⏳</div>
                    <p class="text-xl font-bold text-white mb-2">Waiting for Your Turn</p>
                    <p class="text-slate-400">
                      The player selection will appear when it's your turn to pick.
                    </p>
                  </div>
                </div>
              }
            >
              <div class="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-6">
                <h2 class="text-2xl font-bold text-white mb-4">
                  Available Players
                </h2>

                {/* Search */}
                <div class="mb-4">
                  <input
                    type="text"
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    placeholder="Search players..."
                    class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Players List */}
                <div class="space-y-2 max-h-[600px] overflow-y-auto">
                  <For each={availablePlayers}>
                    {(player) => (
                      <button
                        onClick={() => setSelectedPlayer(player.id)}
                        class={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${selectedPlayer() === player.id
                          ? "bg-blue-600/20 border-blue-500"
                          : "bg-slate-900/50 border-slate-600 hover:bg-slate-900/80"
                          }`}
                      >
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                            {player.name.charAt(0)}
                          </div>
                          <div class="text-left">
                            <p class="text-white font-semibold">{player.name}</p>
                            <p class="text-slate-400 text-sm">
                              {player.position} • {player.team}
                            </p>
                          </div>
                        </div>
                        {selectedPlayer() === player.id && (
                          <span class="text-blue-400">✓</span>
                        )}
                      </button>
                    )}
                  </For>
                </div>

                {/* Make Pick Button */}
                <button
                  onClick={makePick}
                  disabled={!selectedPlayer()}
                  class="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg"
                >
                  {selectedPlayer() ? "Confirm Pick" : "Select a Player"}
                </button>
              </div>
            </Show>

            {/* Sidebar */}
            <div class="space-y-6">
              {/* Recent Picks */}
              <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-6">
                <h3 class="text-xl font-bold text-white mb-4">Recent Picks</h3>
                <div class="space-y-3">
                  <For each={recentPicks}>
                    {(pick) => (
                      <div class="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                        <p class="text-white font-semibold">{pick.player}</p>
                        <p class="text-slate-400 text-sm">
                          {pick.position} • {pick.team}
                        </p>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Quick Stats */}
              <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-6">
                <h3 class="text-xl font-bold text-white mb-4">Draft Stats</h3>
                <dl class="space-y-2">
                  <div class="flex justify-between">
                    <dt class="text-slate-400">Total Picks:</dt>
                    <dd class="text-white font-semibold">4 / 80</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-slate-400">Forwards:</dt>
                    <dd class="text-white font-semibold">2</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-slate-400">Defense:</dt>
                    <dd class="text-white font-semibold">1</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-slate-400">Goalies:</dt>
                    <dd class="text-white font-semibold">1</dd>
                  </div>
                </dl>
              </div>

              {/* Admin Actions (for host only) */}
              <Show when={isHost()}>
                <button
                  onClick={handleFinishDraft}
                  class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Finish Draft
                </button>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


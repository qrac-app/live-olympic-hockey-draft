import { useQuery } from "convex-solidjs";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { For, Show, createSignal } from "solid-js";

interface RecentPicksProps {
    draftId: Id<'drafts'>;
}

export function RecentPicks(props: RecentPicksProps) {
    const { data: recentPicks } = useQuery(api.draftPicks.getRecentPicks, {
        draftId: props.draftId,
        limit: 10,
    });

    return (
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-6">
            <h3 class="text-xl font-bold text-white mb-4">Recent Picks</h3>
            <Show
                when={recentPicks() && recentPicks()!.length > 0}
                fallback={
                    <div class="text-center py-4 text-slate-400 text-sm">
                        No picks yet
                    </div>
                }
            >
                <div class="space-y-3">
                    <For each={recentPicks() || []}>
                        {(pick) => {
                            const [imageError, setImageError] = createSignal(false);
                            return (
                                <div class="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                                    <div class="flex items-center gap-3">
                                        <Show
                                            when={pick.player?.avatar && !imageError()}
                                            fallback={
                                                <div class="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {pick.player?.name?.charAt(0) || "?"}
                                                </div>
                                            }
                                        >
                                            <img
                                                src={pick.player?.avatar}
                                                alt={pick.player?.name || "Player"}
                                                class="w-10 h-10 rounded-full object-cover border-2 border-slate-600 flex-shrink-0"
                                                onError={() => setImageError(true)}
                                            />
                                        </Show>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center justify-between mb-1">
                                                <p class="text-white font-semibold truncate">
                                                    {pick.player?.name || "Unknown"}
                                                </p>
                                                <span class="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded ml-2 flex-shrink-0">
                                                    #{pick.pickNumber}
                                                </span>
                                            </div>
                                            <p class="text-slate-400 text-sm">
                                                {pick.player?.position} • {pick.teamName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Show>
        </div>
    );
}


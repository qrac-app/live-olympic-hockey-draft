import { Show, createSignal, createMemo } from "solid-js";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "convex/_generated/api";
import { PlayerSearch } from "./player-search";
import { PlayerList } from "./player-list";
import { WaitingMessage } from "./waiting-message";

interface PlayerSelectionProps {
    isMyTurn: boolean;
    draftId: Id<"drafts">;
}

export function PlayerSelection(props: PlayerSelectionProps) {
    const { data: availablePlayers } = useQuery(api.draftPicks.getAvailablePlayers, {
        draftId: props.draftId,
    });
    const [searchQuery, setSearchQuery] = createSignal("");
    const [selectedPlayer, setSelectedPlayer] =
        createSignal<Id<"draftablePlayers"> | null>(null);
    const [isMakingPick, setIsMakingPick] = createSignal<boolean>(false);

    const { mutate: makePickMutation } = useMutation(api.draftPicks.makePick);

    // Filter players by search query
    const filteredPlayers = createMemo(() => {
        const players = availablePlayers() || [];
        const query = searchQuery().toLowerCase();
        if (!query) return players;
        return players.filter(
            (player) =>
                player.name.toLowerCase().includes(query) ||
                player.position.toLowerCase().includes(query)
        );
    });

    const makePick = async () => {
        const playerId = selectedPlayer();
        if (!playerId) return;

        // Prevent multiple simultaneous picks
        if (isMakingPick()) {
            return;
        }

        setIsMakingPick(true);
        try {
            await makePickMutation({
                draftId: props.draftId,
                playerId,
            });
            setSelectedPlayer(null);
        } catch (err) {
            console.error("Failed to make pick:", err);
            alert(err instanceof Error ? err.message : "Failed to make pick");
        } finally {
            setIsMakingPick(false);
        }
    };

    return (
        <Show
            when={props.isMyTurn}
            fallback={<WaitingMessage />}
        >
            <div class="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-6">
                <h2 class="text-2xl font-bold text-white mb-4">Available Players</h2>

                <PlayerSearch
                    searchQuery={searchQuery}
                    onInput={setSearchQuery}
                />

                <PlayerList
                    players={filteredPlayers}
                    selectedPlayer={selectedPlayer}
                    onSelectPlayer={setSelectedPlayer}
                    isMakingPick={isMakingPick}
                />

                <button
                    onClick={makePick}
                    disabled={!selectedPlayer() || isMakingPick()}
                    class="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg"
                >
                    {isMakingPick()
                        ? "Making Pick..."
                        : selectedPlayer()
                            ? "Confirm Pick"
                            : "Select a Player"}
                </button>
            </div>
        </Show>
    );
}


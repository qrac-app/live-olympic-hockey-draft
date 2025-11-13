import { For, Show, createMemo } from "solid-js";
import TeamItem from "./team-item";
import { useQuery } from "convex-solidjs";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

export type Team = {
  draftOrderNumber: number;
  teamName: string;
  betterAuthUserId: string;
};

export type TeamsListProps = {
  teams: Team[] | undefined;
  currentUserId: string | undefined;
  draftId: Id<"drafts">;
};

export default function TeamsList(props: TeamsListProps) {
  const { data: onlineUsers } = useQuery(api.draftPresence.getOnlineUsers, {
    draftId: props.draftId,
  });

  return (
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 p-8 mb-6">
      <h2 class="text-2xl font-bold text-white mb-6">
        Draft Order & Teams ({props.teams?.length || 0})
      </h2>
      <Show
        when={props.teams && props.teams.length > 0}
        fallback={
          <div class="text-center py-8 text-slate-400">
            <p>No teams have joined yet. Share the invite link above!</p>
          </div>
        }
      >
        <div class="space-y-3">
          <For each={props.teams || []}>
            {(team) => (
              <TeamItem
                team={team}
                currentUserId={props.currentUserId}
                isOnline={onlineUsers()?.includes(team.betterAuthUserId) ?? false}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}


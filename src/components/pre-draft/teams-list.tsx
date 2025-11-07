import { For, Show, createMemo } from "solid-js";
import TeamItem from "./team-item";

export type Team = {
  draftOrderNumber: number;
  teamName: string;
  betterAuthUserId: string;
};

export type TeamsListProps = {
  teams: Team[] | undefined;
  currentUserId: string | undefined;
  onlineUsers: string[] | undefined;
};

export default function TeamsList(props: TeamsListProps) {
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
            {(team) => {
              const isOnline = createMemo(() => {
                return props.onlineUsers
                  ? props.onlineUsers.includes(team.betterAuthUserId)
                  : false;
              });
              return (
                <TeamItem
                  team={team}
                  currentUserId={props.currentUserId}
                  isOnline={isOnline()}
                />
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}


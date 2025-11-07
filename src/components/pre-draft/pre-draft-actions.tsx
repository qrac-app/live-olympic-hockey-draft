import { Show } from "solid-js";

export type PreDraftActionsProps = {
  isHost: boolean;
  isStarting: boolean;
  timeRemaining: number | null;
  formatTimeRemaining: (ms: number) => string;
  onBackToDashboard: () => void;
  onRandomize: () => void;
  onStartDraft: () => void;
};

export default function PreDraftActions(props: PreDraftActionsProps) {
  return (
    <div class="flex gap-4">
      <button
        onClick={props.onBackToDashboard}
        class="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
      >
        Back to Dashboard
      </button>
      <Show when={props.isHost}>
        <button
          onClick={props.onRandomize}
          class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg shadow-green-500/30"
        >
          Randomize Order
        </button>
        <button
          onClick={props.onStartDraft}
          disabled={
            props.isStarting ||
            (props.timeRemaining !== null && props.timeRemaining > 0)
          }
          class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg shadow-green-500/30"
        >
          {props.isStarting
            ? "Starting..."
            : props.timeRemaining !== null && props.timeRemaining > 0
              ? `Start Draft (${props.formatTimeRemaining(props.timeRemaining)})`
              : "Start Draft →"}
        </button>
      </Show>
      <Show when={!props.isHost}>
        <div class="flex-1 px-6 py-3 bg-slate-700/50 text-slate-400 rounded-lg text-center">
          Waiting for host to start the draft...
        </div>
      </Show>
    </div>
  );
}


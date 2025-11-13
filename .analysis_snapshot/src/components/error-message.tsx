import { Show } from "solid-js";

export type ErrorMessageProps = {
  error: string | undefined;
};

export default function ErrorMessage(props: ErrorMessageProps) {
  return (
    <Show when={props.error}>
      <div class="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6">
        <p class="text-red-300 text-sm">{props.error}</p>
      </div>
    </Show>
  );
}


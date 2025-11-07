import { Show, createSignal, onCleanup } from "solid-js";

export type ShareLinkProps = {
  shareLink: string;
};

export default function ShareLink(props: ShareLinkProps) {
  const [copySuccess, setCopySuccess] = createSignal(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(props.shareLink);
      setCopySuccess(true);
      const timeout = setTimeout(() => setCopySuccess(false), 2000);
      onCleanup(() => clearTimeout(timeout));
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div class="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-6 border border-blue-700/30">
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <p class="text-blue-300 text-sm font-medium mb-2">
            Share Draft Link
          </p>
          <div class="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3 border border-slate-600">
            <input
              type="text"
              value={props.shareLink}
              readonly
              class="flex-1 bg-transparent text-white text-sm focus:outline-none cursor-text"
            />
            <button
              onClick={handleCopyLink}
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap flex items-center gap-2"
            >
              <Show when={copySuccess()} fallback={<>📋 Copy</>}>
                ✓ Copied!
              </Show>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


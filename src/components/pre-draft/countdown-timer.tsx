import { formatTimeRemaining } from "~/lib/utils";

export type CountdownTimerProps = {
  timeRemaining: number | null;
};

export default function CountdownTimer(props: CountdownTimerProps) {
  return (
    <div class="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-6 border border-green-700/30 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-green-300 text-sm font-medium mb-1">
            Draft Starts In
          </p>
          <p class="text-3xl font-bold text-white">
            {props.timeRemaining !== null
              ? formatTimeRemaining(props.timeRemaining)
              : "Loading..."}
          </p>
        </div>
        <div class="text-6xl">⏰</div>
      </div>
    </div>
  );
}


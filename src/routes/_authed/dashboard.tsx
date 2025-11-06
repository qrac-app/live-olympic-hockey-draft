import { createFileRoute, useNavigate, Link } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { useQuery } from "convex-solidjs";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,

});

function Dashboard() {
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = createSignal(false);

  // Convex queries and mutations
  const { data: drafts } = useQuery(api.drafts.getUserDrafts, {});

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      navigate({ to: "/" });
    } catch (err) {
      console.error("Sign out error:", err);
      setIsSigningOut(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800">
      <header class="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <Link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {/* Hockey puck icon */}
                  <ellipse cx="12" cy="8" rx="9" ry="3" opacity="0.3" />
                  <path d="M21 8c0 1.657-4.03 3-9 3S3 9.657 3 8s4.03-3 9-3 9 1.343 9 3z" />
                  <path d="M3 8v8c0 1.657 4.03 3 9 3s9-1.343 9-3V8c0 1.657-4.03 3-9 3s-9-1.343-9-3z" opacity="0.8" />
                  <path d="M21 16c0 1.657-4.03 3-9 3s-9-1.343-9-3" />
                </svg>
              </div>
              <h1 class="text-xl font-bold text-white">Live Olympic Hockey Draft</h1>
            </Link>
            <div class="flex items-center gap-4">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium text-white">{session()?.data?.user?.name}</p>
                <p class="text-xs text-slate-300">{session()?.data?.user?.email}</p>
              </div>
              {/* User Avatar */}
              <div class="relative">
                {session()?.data?.user?.image ? (
                  <img
                    src={session()?.data?.user?.image ?? ""}
                    alt={session()?.data?.user?.name ?? "User"}
                    class="w-10 h-10 rounded-full border-2 border-white/30 bg-slate-700 object-cover"
                  />
                ) : (
                  <div class="w-10 h-10 rounded-full border-2 border-white/30 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">
                      {session()?.data?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              <Button
                onClick={handleSignOut}
                disabled={isSigningOut()}
                variant="outline"
                class="bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                {isSigningOut() ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid gap-6">
          {/* Welcome Section */}
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div class="flex items-center gap-4 mb-6">
              <div class="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-slate-900">Welcome back, {session().data?.user?.name}!</h2>
                <p class="text-slate-600 mt-1">Ready to start your Olympic Hockey Draft?</p>
              </div>
            </div>
          </div>

          {/* Draft Status Cards */}
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-slate-900">Pre-Draft</h3>
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold text-slate-900">{drafts?.()?.filter(d => d?.status === "PRE").length ?? 0}</p>
              <p class="text-sm text-slate-600 mt-2">
                {(drafts?.()?.filter(d => d?.status === "PRE").length ?? 0) === 0 ? "No upcoming drafts" : "Waiting to start"}
              </p>
            </div>

            <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-slate-900">Live Drafts</h3>
                <div class="p-2 bg-red-100 rounded-lg">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold text-slate-900">{drafts?.()?.filter(d => d?.status === "DURING").length ?? 0}</p>
              <p class="text-sm text-slate-600 mt-2">
                {(drafts?.()?.filter(d => d?.status === "DURING").length ?? 0) === 0 ? "No active drafts" : "In progress"}
              </p>
            </div>


          </div>

          {/* Quick Actions */}
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div class="grid sm:grid-cols-2 gap-4">
              <Link to="/draft/create">
                <Button class="w-full h-16 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Draft
                </Button>
              </Link>
              <Link to="/draft/join" search={{ id: "" }}>
                <Button variant="outline" class="w-full h-16 text-base font-semibold border-2">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Join Existing Draft
                </Button>
              </Link>
            </div>
          </div>

          {/* Your Drafts */}
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h3 class="text-2xl font-bold text-slate-900 mb-6">Your Drafts</h3>

            <Show
              when={drafts?.() && (drafts()?.length ?? 0) > 0}
              fallback={
                <div class="text-center py-12 text-slate-500">
                  <svg class="w-20 h-20 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p class="text-xl font-medium mb-2">No drafts yet</p>
                  <p class="text-sm mb-6">Create a new draft or join an existing one to get started!</p>
                  <div class="flex justify-center gap-3">
                    <Link to="/draft/create">
                      <Button class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Create New Draft
                      </Button>
                    </Link>
                    <Link to="/draft/join" search={{ id: "" }}>
                      <Button variant="outline">
                        Join Draft
                      </Button>
                    </Link>
                  </div>
                </div>
              }
            >
              <div class="space-y-4">
                <For each={drafts?.() ?? []}>
                  {(draft) => {
                    const statusConfig = () => {
                      switch (draft?.status) {
                        case "PRE":
                          return {
                            route: "/draft/$id/pre" as const,
                            bgClass: "from-yellow-50 to-orange-50",
                            borderClass: "border-yellow-200 hover:border-yellow-300",
                            badgeClass: "bg-yellow-500",
                            badgeText: "PRE-DRAFT",
                          };
                        case "DURING":
                          return {
                            route: "/draft/$id/during" as const,
                            bgClass: "from-red-50 to-pink-50",
                            borderClass: "border-red-200 hover:border-red-300",
                            badgeClass: "bg-red-500 animate-pulse",
                            badgeText: "LIVE",
                          };
                        case "POST":
                          return {
                            route: "/draft/$id/post" as const,
                            bgClass: "from-green-50 to-emerald-50",
                            borderClass: "border-green-200 hover:border-green-300",
                            badgeClass: "bg-green-500",
                            badgeText: "COMPLETE",
                          };
                        default:
                          return {
                            route: "/draft/$id/pre" as const,
                            bgClass: "from-slate-50 to-slate-100",
                            borderClass: "border-slate-200 hover:border-slate-300",
                            badgeClass: "bg-slate-500",
                            badgeText: "UNKNOWN",
                          };
                      }
                    };

                    const formatDate = (timestamp: number) => {
                      const date = new Date(timestamp);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      });
                    };

                    return (
                      <Link to={statusConfig().route} params={{ id: draft?._id ?? "" }}>
                        <div class={`p-6 bg-gradient-to-r ${statusConfig().bgClass} rounded-xl border-2 ${statusConfig().borderClass} transition-all cursor-pointer hover:shadow-md mb-4`}>
                          <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-3">
                              <span class={`px-3 py-1 ${statusConfig().badgeClass} text-white text-xs font-bold rounded-full`}>
                                {statusConfig().badgeText}
                              </span>
                              <h4 class="text-lg font-bold text-slate-900">{draft?.name}</h4>
                            </div>
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <div class="flex items-center gap-4 text-sm text-slate-600">
                            <span>📅 {formatDate(draft?.startDatetime ?? 0)}</span>
                            <span>•</span>
                            <span>👥 {draft?.teamCount} {draft?.teamCount === 1 ? "team" : "teams"}</span>
                            {draft?.userTeamName && (
                              <>
                                <span>•</span>
                                <span>🏆 {draft?.userTeamName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  }}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </main>
    </div>
  );
}


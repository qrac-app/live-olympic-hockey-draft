import { createSignal, For, Show } from "solid-js";
import { useQuery, useMutation } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import type { Id } from "../../convex/_generated/dataModel";

export function TodoList() {
    const { data: todos } = useQuery(api.todos.getTodos, {});
    const { mutate: createTodo } = useMutation(api.todos.createTodo);
    const { mutate: toggleTodo } = useMutation(api.todos.toggleTodo);
    const { mutate: deleteTodo } = useMutation(api.todos.deleteTodo);

    const [newTodoText, setNewTodoText] = createSignal("");
    const [isAdding, setIsAdding] = createSignal(false);

    const handleAddTodo = async (e: Event) => {
        e.preventDefault();
        const text = newTodoText().trim();
        if (!text) return;

        setIsAdding(true);
        try {
            await createTodo({ text });
            setNewTodoText("");
        } catch (error) {
            console.error("Failed to create todo:", error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggle = async (id: Id<"todos">) => {
        try {
            await toggleTodo({ id });
        } catch (error) {
            console.error("Failed to toggle todo:", error);
        }
    };

    const handleDelete = async (id: Id<"todos">) => {
        try {
            await deleteTodo({ id });
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const todosList = () => todos() ?? [];
    const completedCount = () => todosList().filter((t) => t.isCompleted).length;
    const totalCount = () => todosList().length;

    return (
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div class="flex items-center gap-3">
                    <div class="p-3 bg-white/20 rounded-lg">
                        <svg
                            class="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-white">My Todos</h2>
                        <p class="text-blue-100 text-sm">
                            {completedCount()} of {totalCount()} completed
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Todo Form */}
            <div class="p-6 border-b border-slate-200">
                <form onSubmit={handleAddTodo} class="flex gap-3">
                    <input
                        type="text"
                        value={newTodoText()}
                        onInput={(e) => setNewTodoText(e.currentTarget.value)}
                        placeholder="What needs to be done?"
                        class="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isAdding()}
                    />
                    <Button
                        type="submit"
                        disabled={isAdding() || !newTodoText().trim()}
                        class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <svg
                            class="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add
                    </Button>
                </form>
            </div>

            {/* Todo List */}
            <div class="p-6">
                <Show
                    when={todosList().length > 0}
                    fallback={
                        <div class="text-center py-12">
                            <div class="inline-block p-4 bg-slate-100 rounded-full mb-4">
                                <svg
                                    class="w-12 h-12 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <p class="text-slate-600 font-medium">No todos yet</p>
                            <p class="text-sm text-slate-500 mt-2">
                                Add your first todo to get started!
                            </p>
                        </div>
                    }
                >
                    <div class="space-y-2">
                        <For each={todosList()}>
                            {(todo) => (
                                <div class="group flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleToggle(todo._id)}
                                        class={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.isCompleted
                                            ? "bg-green-500 border-green-500"
                                            : "border-slate-300 hover:border-blue-500"
                                            }`}
                                    >
                                        <Show when={todo.isCompleted}>
                                            <svg
                                                class="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="3"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </Show>
                                    </button>

                                    {/* Todo Text */}
                                    <span
                                        class={`flex-1 transition-all ${todo.isCompleted
                                            ? "text-slate-400 line-through"
                                            : "text-slate-900"
                                            }`}
                                    >
                                        {todo.text}
                                    </span>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(todo._id)}
                                        class="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </div>
    );
}


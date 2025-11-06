import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Get all todos for the current user
export const getTodos = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) {
            return [];
        }

        const todos = await ctx.db
            .query("todos")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        return todos;
    },
});

// Create a new todo
export const createTodo = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) {
            throw new Error("User must be authenticated");
        }

        const todoId = await ctx.db.insert("todos", {
            text: args.text,
            isCompleted: false,
            userId: user._id,
        });

        return todoId;
    },
});

// Toggle todo completion status
export const toggleTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) {
            throw new Error("User must be authenticated");
        }

        const todo = await ctx.db.get(args.id);
        if (!todo) {
            throw new Error("Todo not found");
        }

        if (todo.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, {
            isCompleted: !todo.isCompleted,
        });
    },
});

// Delete a todo
export const deleteTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) {
            throw new Error("User must be authenticated");
        }

        const todo = await ctx.db.get(args.id);
        if (!todo) {
            throw new Error("Todo not found");
        }

        if (todo.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});

// Update todo text
export const updateTodo = mutation({
    args: {
        id: v.id("todos"),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) {
            throw new Error("User must be authenticated");
        }

        const todo = await ctx.db.get(args.id);
        if (!todo) {
            throw new Error("Todo not found");
        }

        if (todo.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, {
            text: args.text,
        });
    },
});


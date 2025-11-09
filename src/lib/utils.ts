import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createResource, sharedConfig, untrack } from "solid-js";
import { isServer } from "solid-js/web";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Ready to start!";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}


// solid routers createAsync function
export type AccessorWithLatest<T> = {
  (): T;
  latest: T;
}

export function createAsync<T>(
  fn: (prev: T) => Promise<T>,
  options: {
    name?: string;
    initialValue: T;
    deferStream?: boolean;
  }
): AccessorWithLatest<T>;
export function createAsync<T>(
  fn: (prev: T | undefined) => Promise<T>,
  options?: {
    name?: string;
    initialValue?: T;
    deferStream?: boolean;
  }
): AccessorWithLatest<T | undefined>;
export function createAsync<T>(
  fn: (prev: T | undefined) => Promise<T>,
  options?: {
    name?: string;
    initialValue?: T;
    deferStream?: boolean;
  }
): AccessorWithLatest<T | undefined> {
  let resource: () => T;
  let prev = () => !resource || (resource as any).state === "unresolved" ? undefined : (resource as any).latest;
  [resource] = createResource(
    () => subFetch(fn, untrack(prev)),
    v => v,
    options as any
  );

  const resultAccessor: AccessorWithLatest<T> = (() => resource()) as any;
  Object.defineProperty(resultAccessor, 'latest', {
    get() {
      return (resource as any).latest;
    }
  })

  return resultAccessor;
}

function subFetch<T>(fn: (prev: T | undefined) => Promise<T>, prev: T | undefined) {
  if (isServer || !sharedConfig.context) return fn(prev);
  const ogFetch = fetch;
  const ogPromise = Promise;
  try {
    window.fetch = () => new MockPromise() as any;
    Promise = MockPromise as any;
    return fn(prev);
  } finally {
    window.fetch = ogFetch;
    Promise = ogPromise;
  }
}

class MockPromise {
  static all() {
    return new MockPromise();
  }
  static allSettled() {
    return new MockPromise();
  }
  static any() {
    return new MockPromise();
  }
  static race() {
    return new MockPromise();
  }
  static reject() {
    return new MockPromise();
  }
  static resolve() {
    return new MockPromise();
  }
  catch() {
    return new MockPromise();
  }
  then() {
    return new MockPromise();
  }
  finally() {
    return new MockPromise();
  }
}

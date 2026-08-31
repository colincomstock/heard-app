// Utility function to handle cases where Supabase returns an array for a single relation, and we want to get the first element or null if it doesn't exist.

export function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
    return Array.isArray(value) ? value[0] ?? null : value ?? null;
};

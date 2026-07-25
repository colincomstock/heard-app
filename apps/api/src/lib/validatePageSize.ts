const DEFAULT_PAGE_SIZE_FALLBACK = 20;
const MAX_PAGE_SIZE_FALLBACK = 50;

export default function validatePageSize(
    rawLimit: string | undefined,
    options?: { 
        defaultSize?: number; 
        maxSize?: number;
    }
): number {
    const defaultSize = options?.defaultSize ?? DEFAULT_PAGE_SIZE_FALLBACK;
    const maxSize = options?.maxSize ?? MAX_PAGE_SIZE_FALLBACK;

    const requested = Number(rawLimit ?? defaultSize);

    if (!Number.isFinite(requested) || requested <= 0) {
        return defaultSize;
    }

    return Math.min(Math.max(Math.floor(requested), 1), maxSize);
};
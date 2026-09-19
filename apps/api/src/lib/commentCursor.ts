export type CommentCursor = {
    likeCount: number;
    createdAt: string;
    id: string;
};

// Functions to parse and serialize comment cursors for pagination
export function parseCommentCursor(rawCursor: string): CommentCursor | null {
    try {
        const value: unknown = JSON.parse(rawCursor);

        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return null;
        }

        const cursor = value as Record<string, unknown>;

        if (
            typeof cursor.likeCount !== 'number' ||
            !Number.isInteger(cursor.likeCount) ||
            cursor.likeCount < 0 ||
            typeof cursor.createdAt !== 'string' ||
            Number.isNaN(Date.parse(cursor.createdAt)) ||
            typeof cursor.id !== 'string' ||
            cursor.id.length === 0
        ) {
            return null;
        }

        return {
            likeCount: cursor.likeCount,
            createdAt: cursor.createdAt,
            id: cursor.id,
        };
    } catch {
        return null;
    }
}

export function serializeCommentCursor(cursor: CommentCursor): string {
    return JSON.stringify(cursor);
}

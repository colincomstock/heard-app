import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import type { Bindings } from '../types/bindings';

const maxAvatarBytes = 2 * 1024 * 1024;
const pngType = 'image/png';
const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const previewFilename = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.png$/;
const previewPrefix = 'test/uploads/';

export const AvatarPreviewRoute = new Hono<{ Bindings: Bindings }>();
export const AvatarUploadRoute = new Hono<{ Bindings: Bindings }>();

AvatarPreviewRoute.get('/:filename?', async (c) => {
    if (c.env.ENABLE_AVATAR_TEST_ROUTE !== 'true') {
        return c.notFound();
    }

    const filename = c.req.param('filename');
    if (filename && !previewFilename.test(filename)) {
        return c.notFound();
    }

    const key = filename ? previewPrefix + filename : 'test/placeholder.png';
    const avatar = await c.env.PFPS.get(key);
    if (!avatar) {
        return c.notFound();
    }

    return c.body(avatar.body, 200, {
        'Content-Type': pngType,
        'Cache-Control': 'no-store',
    });
});

AvatarUploadRoute.put(
    '/',
    bodyLimit({
        maxSize: maxAvatarBytes,
        onError: (c) => c.json({ error: 'Avatar must be 2 MiB or smaller.' }, 413),
    }),
    async (c) => {
        if (c.env.ENABLE_AVATAR_TEST_ROUTE !== 'true') {
            return c.notFound();
        }

        const contentType = c.req.header('Content-Type')?.split(';', 1)[0].trim().toLowerCase();
        if (contentType !== pngType) {
            return c.json({ error: 'Send a PNG image as the request body.' }, 415);
        }

        const image = await c.req.arrayBuffer();
        const bytes = new Uint8Array(image);
        if (bytes.length <= pngSignature.length || !pngSignature.every((byte, index) => bytes[index] === byte)) {
            return c.json({ error: 'The request body is not a PNG image.' }, 415);
        }

        const filename = `${crypto.randomUUID()}.png`;
        await c.env.PFPS.put(previewPrefix + filename, image, {
            httpMetadata: { contentType: pngType },
        });

        return c.json({ previewPath: `/avatars/test/${filename}` }, 201);
    },
);

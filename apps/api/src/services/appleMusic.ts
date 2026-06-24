import type { Bindings } from "../types/bindings";
import generateAppleMusicToken from "../lib/appleMusicAuth";

export async function getAppleMusicTrackById(
    env: Bindings,
    appleMusicTrackId: string
) {
    const token = await generateAppleMusicToken(env);

    const appleMusicTrackUrl = `https://api.music.apple.com/v1/catalog/us/songs/${appleMusicTrackId}/?include=genres`;
        
        const res = await fetch(appleMusicTrackUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        if (!res.ok) {
            const detail = await res.text();
            throw new Error(
                `Apple Music API error: ${res.status}: ${detail}`
            );
        }

        const json = await res.json() as any;
        return json.data[0] ?? null;
}
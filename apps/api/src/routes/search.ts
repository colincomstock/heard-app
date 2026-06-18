import { Hono } from "hono";
import keysToCamelCase from "../lib/case";
import type { Bindings, AuthVariables } from "../types/bindings";
import generateAppleMusicToken from "../lib/appleMusic";

export const searchRoute = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

searchRoute.get("/", async (c) => {
    const rawTerm = c.req.query("term");
    if (!rawTerm) {
        return c.json({ error: "Missing search term" }, 400);
    }
    const term = rawTerm.replace(/\+/g, " ");

    const params = new URLSearchParams({ types: "songs", term, limit: "10" });

    console.log("Search term:", term);
    console.log("Request URL:", `https://api.music.apple.com/v1/catalog/us/search?${params}`);

    const token = await generateAppleMusicToken(c.env);

    const url = `https://api.music.apple.com/v1/catalog/us/search?${params}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Apple Music API error:", response.status, error);
        return c.json({ error: "Apple Music API error", status: response.status, detail: error }, 500);
    }

    const data = await response.json();

    const songs = data.results?.songs?.data.map((song: any) => ({
        id: song.id,
        name: song.attributes.name,
        artistName: song.attributes.artistName,
        coverUrl: song.attributes.artwork.url.replace("{w}x{h}", "200x200"),
        genres: song.attributes.genreNames,
        previewUrl: song.attributes.previews?.[0]?.url || null,
        appleMusicUrl: song.attributes.url,
        })) || [];


    return c.json({ songs });

});
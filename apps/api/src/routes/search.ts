import { Hono } from "hono";
import keysToCamelCase from "../lib/case";
import type { Bindings, AuthVariables } from "../types/bindings";
import generateAppleMusicToken from "../lib/appleMusic";

export const searchRoute = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

searchRoute.get("/", async (c) => {
    const term = c.req.query("term");
    if (!term) {
        return c.json({ error: "Missing search term" }, 400);
    }

    const params = new URLSearchParams({ types: "songs", term, limit: "25" });

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
    return c.json(keysToCamelCase(data));

});
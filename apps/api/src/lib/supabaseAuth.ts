import { createMiddleware } from "hono/factory";
import type { Bindings, AuthVariables } from "../types/bindings";
import { createSupabaseClientWithAuth } from "./supabase";

export const requireAuth = createMiddleware<{ Bindings: Bindings, Variables: AuthVariables}>(async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
    };

    const token = authHeader.replace("Bearer ", "");
    const supabase = createSupabaseClientWithAuth(c.env, token);

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    c.set('userId', user.id);
    return next();
});
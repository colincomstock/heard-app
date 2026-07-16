import { Hono } from 'hono'

export const HealthRoute = new Hono()

HealthRoute.get('/', (c) => {
    return c.json({ 
        ok: true,
        service: 'Heard API',
        timestamp: Date.now(),
    })
});
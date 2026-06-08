import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Heard API')
})

app.get('/health', (c) => {
  return c.json({ 
    ok: true,
    service: 'Heard API',
    timestamp: Date.now(),
  })
})

export default app

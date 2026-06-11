import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from './types/bindings'
import { healthRoute } from './routes/health'
import { profilesRoute } from './routes/profiles'

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', 
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (c) => {
  return c.text('Heard API')
});

app.route('/health', healthRoute);

app.route('/profile', profilesRoute);

app.notFound((c) => {
  return c.json(
    { 
      error: 'Not Found' 
    }, 
    404
  );
});

app.onError((err, c) => {
  console.error('Error:', err);
  return c.json(
    { 
      error: 'Internal Server Error' 
    }, 
    500
  );
});

export default app

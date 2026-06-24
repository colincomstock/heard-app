import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from './types/bindings'
import { healthRoute } from './routes/health'
import { requireAuth } from './lib/supabaseAuth'
import { profilesRoute } from './routes/profiles'
import { meRoute } from './routes/me'
import { PostsRoute } from './routes/posts'

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

app.use('*', requireAuth);

app.route('/profile', profilesRoute);

app.route('/me', meRoute);

app.route('/posts', PostsRoute);

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

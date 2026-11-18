import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const result = spawnSync(
    'supabase gen types typescript --project-id pmbnzbpxcghgdkevhtxw --schema public',
    {
        shell: true,
        stdio: ['inherit', 'pipe', 'inherit'],
        encoding: 'utf8',
    },
);

if (result.error) {
    throw result.error;
}
if (result.status !== 0) {
    process.exit(result.status ?? 1);
}
if (!result.stdout.trim()) {
    throw new Error('Supabase returned empty database types.');
}

writeFileSync(new URL('../apps/api/src/types/database.types.ts', import.meta.url), result.stdout);

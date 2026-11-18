import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

type UserProfileArgs = {
    supabase: SupabaseClient<Database>;
    userId: string;
};

type CreateUserProfileArgs = UserProfileArgs & {
    handle: string;
    displayName: string;
};

const profileFields = 'id, handle, displayName:display_name, pfpUrl:pfp_url, bio';

export async function getUserProfile({ supabase, userId }: UserProfileArgs) {
    const { data: profile, error } = await supabase
        .from('profile')
        .select(profileFields)
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        throw new Error('Failed to fetch profile', { cause: error });
    }

    return profile;
}

export async function createUserProfile({ supabase, userId, handle, displayName }: CreateUserProfileArgs) {
    const { data: profile, error } = await supabase
        .from('profile')
        .insert({ id: userId, handle, display_name: displayName })
        .select(profileFields)
        .single();

    if (!error) {
        return { outcome: 'created', profile } as const;
    }
    if (error.code !== '23505') {
        throw new Error('Failed to create profile', { cause: error });
    }

    // A retry can hit the primary key even when the first request succeeded.
    const existing = await getUserProfile({ supabase, userId });
    if (!existing) {
        return { outcome: 'handle_taken' } as const;
    }
    if (existing.handle === handle && existing.displayName === displayName) {
        return { outcome: 'unchanged', profile: existing } as const;
    }
    return { outcome: 'profile_exists' } as const;
}

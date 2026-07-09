import type { SupabaseClient } from "@supabase/supabase-js";

type CreateUserPostArgs = {
    supabase: SupabaseClient;
    userId: string;
    trackId: string;
    caption?: string;
};

export default async function createUserPost({
    supabase,
    userId,
    trackId,
    caption,
}: CreateUserPostArgs) {
    try {
        const { data: newPost, error: insertError } = await supabase
            .from('post')
            .insert({
                user_id: userId,
                track_id: trackId,
                caption: caption,
            })
            .select("*")
            .single();
        
        if (insertError || !newPost) {
            console.error("Failed to create post:", insertError);
            throw new Error("Failed to create post");
        }

        return newPost;
    } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Create post failed", { cause: error });
    }
};

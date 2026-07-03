export async function getQueuePosts(token: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/queue`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching queue posts: ${response.statusText}`);
    }
    return response.json();
};
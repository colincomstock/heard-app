export async function getSearchResults(query: string, token: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/search?term=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Error fetching search results: ${response.statusText}`);
    }
    return response.json();
}
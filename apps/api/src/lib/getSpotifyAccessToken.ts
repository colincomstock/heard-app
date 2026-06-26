export default async function getSpotifyAccessToken(clientId: string, clientSecret: string): Promise<string> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`),
        },
        body: "grant_type=client_credentials",
    });

    if (!response.ok) {
        throw new Error("Failed to get Spotify access token");
    }

    const data = await response.json();
    return data.access_token;
}
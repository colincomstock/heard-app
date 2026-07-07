import { SignJWT, importPKCS8 } from "jose";
import type { Bindings } from "../types/bindings";

export default async function generateAppleMusicToken(env: Bindings): Promise<string> {
    const privateKey = await importPKCS8(
        `-----BEGIN PRIVATE KEY-----\n${env.APPLE_MUSIC_PRIVATE_KEY}\n-----END PRIVATE KEY-----`,
        "ES256"
    );

    const now = Math.floor(Date.now() / 1000);

    return new SignJWT({})
        .setProtectedHeader({ alg: "ES256", kid: env.APPLE_MUSIC_KEY_ID })
        .setIssuer(env.APPLE_MUSIC_TEAM_ID)
        .setIssuedAt(now)
        .setExpirationTime(now + 60*60) // Token valid for 1 hour
        .sign(privateKey);
}
// common.ts

import { prominent } from 'color.js';

// constants

export const SPOTIFY_BASE_URL = 'https://accounts.spotify.com/';

const SPOTIFY_SCOPE = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'app-remote-control',
    'user-read-currently-playing',
    'user-read-playback-state',
].join(' ');

const spotifyQueryParameters = new URLSearchParams({
    'response_type': 'code',
    'client_id': import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    'scope': SPOTIFY_SCOPE,
    'redirect_uri': import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
} as Record<string, string>);

export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize?' + spotifyQueryParameters.toString();

// functions

export function generateRandomString(length: number): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateRandomChar(): string {
        let randomIndex = Math.floor(Math.random() * possible.length)
        return possible.charAt(randomIndex);
    }

    for (let i = 0; i < length; i++) {
        text += generateRandomChar();
    }

    return text;
}

export function brightnessLevel(color: string) {
    const hex = color.replace('#', '');

    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);

    return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
}

export function alterColor(color: string, factor: number) {
    const hex = color.replace('#', '');

    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);

    const alteredComponentToHex = (c: number) => {
        const alteredComponent = Math.max(
            Math.min( c * factor, 255 ), 0
        );
        const hex = alteredComponent.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return '#'
        + alteredComponentToHex(c_r)
        + alteredComponentToHex(c_g)
        + alteredComponentToHex(c_b);
}

export async function extractProminentColors(src: string): Promise<string[]> {
    return await prominent(src, { amount: 5, format: 'hex' }) as string[];
}

export function pxToRem(pixels: number): string {
    return `${pixels / 16}rem`;
}

export const reorder = <T>(
    list: T[],
    startIndex: number,
    endIndex: number
): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

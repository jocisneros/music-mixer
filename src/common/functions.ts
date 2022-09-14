// functions.ts

import { prominent } from "color.js";

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

export async function extractProminentColor(src: string): Promise<string> {
    return await prominent(src, { amount: 1, format: 'hex' }) as string;
}

export function pxToRem(pixels: number): string {
    return `${pixels / 16}rem`;
}

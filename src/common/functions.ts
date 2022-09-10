// functions.ts

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

/**
 * Converts a string to a 6-digit RGB hex color code.
 * Uses a seeded PRNG for even color distribution.
 */
export function createColor(str: string): string {
    // Simple hash function to get a seed
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Seeded pseudo-random number generator
    function seededRand(seed: number) {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    // Generate RGB values
    const r = Math.floor(seededRand(hash) * 256);
    const g = Math.floor(seededRand(hash + 1) * 256);
    const b = Math.floor(seededRand(hash + 2) * 256);

    return (
        `#${[r, g, b]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase()}`
    );
}
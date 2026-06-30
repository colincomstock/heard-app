type Hsl = {
    h: number;
    s: number;
    l: number;
}

type Rgb = {
    r: number;
    g: number;
    b: number;
}

type DerivedPostColors = {
    bgColor: string;
    border: string;
    isLight: boolean;
    usedFallback: boolean;
    lowContrastBgBadge: boolean;
}

const FALLBACK: DerivedPostColors = {
    bgColor: '#444444',
    border: '#6a6a6a',
    isLight: false,
    usedFallback: true,
    lowContrastBgBadge: false,
}

const BADGE_LOW_CONTRAST_THRESHOLD = 2; // Contrast ratio below which the badge is considered low contrast
const LUMINANCE_THRESHOLD = 0.5; // Luminance threshold to determine if a color is light or dark
const LIGHT_BG_SAT_ADJUSTMENT = -10; // Saturation adjustment for light backgrounds
const LIGHT_BG_LUM_ADJUSTMENT = -5; // Luminance adjustment for light backgrounds
const LIGHT_BORDER_SAT_ADJUSTMENT = -30; // Saturation adjustment for borders on light backgrounds
const LIGHT_BORDER_LUM_ADJUSTMENT = -30; // Luminance adjustment for borders on light backgrounds
const DARK_BORDER_SAT_ADJUSTMENT = 15; // Saturation adjustment for borders on dark backgrounds
const DARK_BORDER_LUM_ADJUSTMENT = 15; // Luminance adjustment for borders on dark backgrounds

export default function derivePostColors(bgHexColor: string, badgeHexColor: string): DerivedPostColors {
    const bgNormalized = normalizeHexColor(bgHexColor);
    const badgeNormalized = normalizeHexColor(badgeHexColor);

    if (!bgNormalized || !badgeNormalized) {
        return { ...FALLBACK};
    }

    // Convert to RGB for luminance and contrast calculations, hsl conversion
    const { r: rBg, g: gBg, b: bBg } = hexToRgb(bgNormalized);
    const { r: rBadge, g: gBadge, b: bBadge } = hexToRgb(badgeNormalized);

    const bgLuminance = relativeLuminance({ r: rBg, g: gBg, b: bBg });
    const badgeLuminance = relativeLuminance({ r: rBadge, g: gBadge, b: bBadge });
    const lowContrastBgBadge = hasLowBadgeContrast(bgLuminance, badgeLuminance);
    const hsl = rgbToHsl({ r: rBg, g: gBg, b: bBg });

    // If background is luminant, darken it slightly and compute dark border
    // If background is not luminant (i.e., dark), keep it as is and compute a lighter border
    if (bgLuminance >= LUMINANCE_THRESHOLD) {
        const lightBgColor: Hsl = {
            h: hsl.h,
            s: clamp(hsl.s + LIGHT_BG_SAT_ADJUSTMENT, 0, 100),
            l: clamp(hsl.l + LIGHT_BG_LUM_ADJUSTMENT, 0, 100),
        };

        const lightBorderColor: Hsl = {
            h: hsl.h,
            s: clamp(hsl.s + LIGHT_BORDER_SAT_ADJUSTMENT, 0, 100),
            l: clamp(hsl.l + LIGHT_BORDER_LUM_ADJUSTMENT, 0, 100),
        };
        return {
            bgColor: hslToHex(lightBgColor),
            border: hslToHex(lightBorderColor),
            isLight: true,
            usedFallback: false,
            lowContrastBgBadge: lowContrastBgBadge,
        };
    } else {
        const darkBgColor: Hsl = {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
        };
        const darkBorderColor: Hsl = {
            h: hsl.h,
            s: clamp(hsl.s + DARK_BORDER_SAT_ADJUSTMENT, 0, 100),
            l: clamp(hsl.l + DARK_BORDER_LUM_ADJUSTMENT, 0, 100),
        };
        return {
            bgColor: hslToHex(darkBgColor),
            border: hslToHex(darkBorderColor),
            isLight: false,
            usedFallback: false,
            lowContrastBgBadge: lowContrastBgBadge,
        };
    }
}

// Clamps a value between a minimum and maximum range
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// Computes the relative luminance of a color based on its RGB values
function relativeLuminance({ r, g, b }: Rgb): number {
    const srgb = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

// Computes the contrast ratio between two luminance values
function contrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Compares the luminance values of the background and badge colors
function hasLowBadgeContrast(bgLuminance: number, badgeLuminance: number): boolean {
    const ratio = contrastRatio(bgLuminance, badgeLuminance);

    return ratio < BADGE_LOW_CONTRAST_THRESHOLD;
}


// Helper function to ensure the hex color comes in a standard predictable format
// and returns null if the input is not a valid hex color.
function normalizeHexColor(input: string): string | null {
    if (!input || typeof input !== 'string') {
        return null;
    }

    const value = input.trim().replace(/^#/, '').toLowerCase();

    if (/^[0-9a-f]{3}$/.test(value)) {
        return `#${value.split('').map((char) => char + char).join('')}`
    }

    if (/^[0-9a-f]{6}$/.test(value)) {
        return `#${value}`
    }

    return null;
}

// Converts hex to RGB
function hexToRgb(hex: string): Rgb{
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return { r, g, b };
}

// Converts RGB to HSL
function rgbToHsl({ r, g, b }: Rgb): Hsl {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;  

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case r:
                h = ((g - b) / delta) % 6;
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }
    }

    if (h < 0) {
        h += 360;
    }

    return {
        h: Math.round(h * 60),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

// Converts HSL to hex
function hslToHex({ h, s, l }: Hsl): string {
    const sat = s / 100;
    const light = l / 100;

    const c = (1 - Math.abs(2 * light - 1)) * sat;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = light - c / 2;

    let rPrime = 0;
    let gPrime = 0;
    let bPrime = 0;

    if (h >= 0 && h < 60) {
        rPrime = c;
        gPrime = x;
    } else if (h >= 60 && h < 120) {
        rPrime = x;
        gPrime = c;
    } else if (h >= 120 && h < 180) {
        gPrime = c;
        bPrime = x;
    } else if (h >= 180 && h < 240) {
        gPrime = x;
        bPrime = c;
    } else if (h >= 240 && h < 300) {
        rPrime = x;
        bPrime = c;
    } else {
        rPrime = c;
        bPrime = x;
    }

    const r = Math.round((rPrime + m) * 255);
    const g = Math.round((gPrime + m) * 255);
    const b = Math.round((bPrime + m) * 255);

    return `#${rgbChanneltoHex(r)}${rgbChanneltoHex(g)}${rgbChanneltoHex(b)}`;
}

// Converts a single RGB channel value to a two-digit hexadecimal string
function rgbChanneltoHex(value: number): string {
    return value.toString(16).padStart(2, '0');
}   


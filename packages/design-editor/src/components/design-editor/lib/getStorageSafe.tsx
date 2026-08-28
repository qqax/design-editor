export function getStorageSafe(key: string, DEFAULT_SETTINGS: any) {
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
        return DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
}
export function getStorageSafe<T>(key: string, defaultSettings: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
}

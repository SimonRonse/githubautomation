export function envBool(value: unknown, fallback = false): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return ["1","true","yes","on"].includes(value.toLowerCase());
    return fallback;
}
export const initialConnected = envBool(import.meta.env.VITE_REACT_APP_CONNECTED, false);

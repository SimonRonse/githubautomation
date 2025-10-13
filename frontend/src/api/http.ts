export async function postJson<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: tokenHeader() },
        body: JSON.stringify(body),
        credentials: "include",
    });
    if (!res.ok) {
        // try to read backend error shape
        let err: any;
        try { err = await res.json(); } catch { err = { error: "HTTP_" + res.status }; }
        throw err;
    }
    return res.json();
}

export async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(path, {
        headers: { Authorization: tokenHeader() },
        credentials: "include",
    });
    if (!res.ok) {
        let err: any;
        try { err = await res.json(); } catch { err = { error: "HTTP_" + res.status }; }
        throw err;
    }
    return res.json();
}

function tokenHeader() {
    const t = localStorage.getItem("jwt");
    return t ? `Bearer ${t}` : "";
}

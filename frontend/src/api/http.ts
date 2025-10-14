export async function postJson<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: tokenHeader() },
        body: JSON.stringify(body),
        credentials: "include",
    });
    if (!res.ok) {

        let err: unknown;
        console.log("POST " + path + " failed with status " + res.status);
        try { err = await res.json(); } catch { err = { error: "HTTP_" + res.status }; }
        throw err;
    }
    console.log("POST " + path + " succeeded with status " + res.status);
    return res.json();
}

export async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(path, {
        headers: { Authorization: tokenHeader() },
        credentials: "include",
    });
    if (!res.ok) {
        let err: unknown;
        console.log("GET " + path + " failed with status " + res.status);
        try { err = await res.json(); } catch { err = { error: "HTTP_" + res.status }; }
        throw err;
    }
    console.log("GET " + path + " succeeded with status " + res.status);
    return res.json();
}

function tokenHeader() {
    const t = localStorage.getItem("jwt");
    return t ? `Bearer ${t}` : "";
}

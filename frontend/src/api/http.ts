import axios, { AxiosError, type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Unified error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized — token may be invalid");
            localStorage.removeItem("jwt");
        }
        throw error;
    }
);

// Generic helpers
export async function getJson<T>(url: string): Promise<T> {
    const res = await api.get<T>(url);
    return res.data;
}

export async function postJson<T>(url: string, body?: unknown): Promise<T> {
    const res = await api.post<T>(url, body);
    return res.data;
}

export async function patchJson<T>(url: string, body?: unknown): Promise<T> {
    const res = await api.patch<T>(url, body);
    return res.data;
}

export async function putJson<T>(url: string, body?: unknown): Promise<T> {
    const res = await api.put<T>(url, body);
    return res.data;
}

export async function deleteJson<T>(url: string): Promise<T> {
    const res = await api.delete<T>(url);
    return res.data;
}

export default api;

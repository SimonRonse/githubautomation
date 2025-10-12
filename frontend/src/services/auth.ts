import axios from 'axios'

console.log(import.meta.env.VITE_API_BASE_URL);
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'


export type LoginResult = { token: string }


export async function loginWithPassword(identifier: string, password: string): Promise<LoginResult> {
// Wire this to your backend: POST /auth/login { identifier, password }
    const { data } = await axios.post(`${API}/auth/login`, { identifier, password })
    return data
}


export function startGithubOAuth() {
// Redirect to your backend which starts the OAuth dance with GitHub.
// Example backend route: GET /auth/github -> 302 to GitHub authorize URL
    window.location.href = `${API}/auth/github`
}
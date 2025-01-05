import { getSession } from 'next-auth/react';

const API_BASE_URL = 'https://api.github.com';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const session = await getSession();
    const accessToken = session?.accessToken;
    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const api = {
    get: (url: string) => fetchWithAuth(url),
};
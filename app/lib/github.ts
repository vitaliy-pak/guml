import { Repository } from "../types/repository";

export const fetchRepositories = async (accessToken: string): Promise<Repository[]> => {
    const response = await fetch('https://api.github.com/user/repos', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }

    return response.json();
};

export const fetchFiles = async (repoFullName: string, accessToken: string, file?: string) => {
    const url = `https://api.github.com/repos/${repoFullName}/contents` + `/${file ? file : ''}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch files');
    }

    return response.json();
};
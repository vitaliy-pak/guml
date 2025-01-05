import { Repository } from "../types/repository";
import { api } from "./api";
import { GitHubFile } from "../types/github-file";

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

export const fetchFiles = async (repoFullName: string, path?: string): Promise<GitHubFile | GitHubFile[]> => {
    const url = `/repos/${repoFullName}/contents${path ? '/' + path : ''}`;
    return await api.get(url);
};

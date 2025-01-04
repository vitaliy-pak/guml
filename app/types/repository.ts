export interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        url: string;
        html_url: string;
    };
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    created_at: string;
    updated_at: string;
    language: string | null;
    license: {
        key: string;
        name: string;
        spdx_id: string;
        url: string | null;
        node_id: string;
    } | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    default_branch: string;
}
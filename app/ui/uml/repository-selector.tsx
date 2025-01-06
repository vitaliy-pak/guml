'use client';
import React from "react";
import { Repository } from "../../types/repository";
import { Select } from '@mantine/core';
import useRepoStore from "../../store/repo-store";
import useFileStore from "../../store/file-store";

interface RepositorySelectorProps {
    repos: Repository[];
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({repos}) => {
    const {selectedRepo, setSelectedRepo} = useRepoStore();
    const {clearStore} = useFileStore();

    const handleSelect = (repo: string | null) => {
        if (repo === null) {
            return;
        }

        setSelectedRepo(repo ?? '');
        clearStore();
    };

    return (
        <Select
            data={repos.map(repo => ({value: repo.full_name, label: repo.name}))} value={selectedRepo}
            onChange={handleSelect}
            w={300}
            placeholder={'Select a repository'}
        >
        </Select>
    );
};

export default RepositorySelector;
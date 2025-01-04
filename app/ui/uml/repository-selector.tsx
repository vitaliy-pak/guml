'use client';
import React, { useState } from "react";
import { Repository } from "../../types/repository";
import { Select } from '@mantine/core';

interface RepositorySelectorProps {
    repos: Repository[];
    onSelect: (repo: string) => void;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({repos, onSelect}) => {
    const [selectedRepo, setSelectedRepo] = useState<string>('');

    const handleSelect = (repo: string | null) => {
        setSelectedRepo(repo ?? '');
        onSelect(repo ?? '');
    };

    return (
        <Select
            data={repos.map(repo => ({value: repo.full_name, label: repo.name}))} value={selectedRepo}
            onChange={handleSelect}
            w={300}
        >
        </Select>
    );
};

export default RepositorySelector;
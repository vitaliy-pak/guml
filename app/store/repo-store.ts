import { create } from 'zustand';

interface RepoStore {
    selectedRepo: string;
    setSelectedRepo: (selectedRepo: string) => void;
}

const useRepoStore = create<RepoStore>((set) => ({
    selectedRepo: '',
    setSelectedRepo: (selectedRepo) => set({selectedRepo}),
}));

export default useRepoStore;
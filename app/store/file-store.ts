import { create } from 'zustand';
import { TreeNodeData } from "@mantine/core";
import { TreeExpandedState } from "@mantine/core/lib/components/Tree/use-tree";

export interface TreeState {
    multiple: boolean,
    expanded: TreeExpandedState,
    checked: string[],
    selected: string[]
}

interface FileStore {
    treeState: TreeState | null;
    treeData: TreeNodeData[];
    selectedFiles: string[];
    fileContents: Record<string, string>,
    setTreeState: (tree: TreeState) => void,
    setTreeData: (treeData: TreeNodeData[]) => void;
    setSelectedFiles: (selectedFiles: string[]) => void;
    addFileContent: (content: Record<string, string>) => void;
    clearFileContents: () => void;
    getFilteredFileContents: () => Record<string, string>;
    clearSelectedFiles: () => void;
    clearTreeData: () => void;
    clearStore: () => void;
}

const useFileStore = create<FileStore>((set, get) => ({
    treeState: null,
    treeData: [],
    selectedFiles: [],
    fileContents: {},
    setTreeState: (treeState) => set({treeState}),
    setTreeData: (treeData) => set({treeData}),
    setSelectedFiles: (selectedFiles) => set({selectedFiles}),
    addFileContent: (content) => set((state) => ({fileContents: {...state.fileContents, ...content}})),
    clearFileContents: () => set(() => ({fileContents: {}})),
    getFilteredFileContents: () => {
        const {selectedFiles, fileContents} = get();
        return Object.fromEntries(
            Object.entries(fileContents).filter(([key]) => selectedFiles.includes(key))
        );
    },
    clearSelectedFiles: () => set(() => ({selectedFiles: []})),
    clearTreeData: () => set({treeData: []}),
    clearStore: () => set({treeData: [], selectedFiles: [], fileContents: {}, treeState: null}),
}));

export default useFileStore;
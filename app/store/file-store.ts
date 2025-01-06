import { create } from 'zustand';
import { TreeNodeData } from "@mantine/core";

interface FileStore {
    treeData: TreeNodeData[];
    selectedFiles: string[];
    setTreeData: (data: TreeNodeData[]) => void;
    setSelectedFiles: (selectedFiles: string[]) => void;
}

const useFileStore = create<FileStore>((set) => ({
    treeData: [],
    selectedFiles: [],
    setTreeData: (data) => set({treeData: data}),
    setSelectedFiles: (selectedFiles) => set({selectedFiles}),
}));

export default useFileStore;
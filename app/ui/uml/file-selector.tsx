'use client';

import { useEffect, useState } from 'react';
import { Checkbox, Group, Loader, RenderTreeNodePayload, ScrollArea, Tree, TreeNodeData, useTree } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { fetchFiles } from "../../lib/github";
import { GitHubFile } from "../../types/github-file";
import useFileStore from "../../store/file-store";
import useRepoStore from "../../store/repo-store";


const FileSelector = () => {
    const {treeState, treeData, setTreeState, setTreeData, setSelectedFiles, addFileContent} = useFileStore();
    const {selectedRepo} = useRepoStore();
    const tree = useTree(
        treeState ? {
                multiple: treeState.multiple,
                initialSelectedState: treeState.selected,
                initialCheckedState: treeState.checked,
                initialExpandedState: treeState.expanded
            } :
            {
                multiple: true,
            }
    );
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (treeData.length > 0) {
            return;
        }

        const formatTreeData = async (data: GitHubFile[]): Promise<TreeNodeData[]> => {
            const treeNodes: TreeNodeData[] = [];

            const fetchChildrenPromises = data.map(async (item) => {
                const node: TreeNodeData = {
                    label: item.name,
                    value: item.path,
                    children: [],
                };

                if (item.type === 'dir') {
                    const children = await fetchFiles(selectedRepo, item.path) as GitHubFile[];
                    node.children = await formatTreeData(children);
                } else {
                    const file = await fetchFiles(selectedRepo, item.path) as GitHubFile;
                    addFileContent({[item.path]: atob(file.content || '')});
                }

                return node;
            });

            const nodes = await Promise.all(fetchChildrenPromises);
            treeNodes.push(...nodes);

            return treeNodes;
        };

        const fetchRepoFiles = async () => {
            const files = await fetchFiles(selectedRepo) as GitHubFile[];
            const formattedData = await formatTreeData(files);
            setTreeData(formattedData);
        };


        setLoading(true)
        fetchRepoFiles().then(() => setLoading(false));
    }, [addFileContent, selectedRepo, setTreeData, treeData.length]);


    useEffect(() => {
        const selectedFiles = tree.selectedState.filter(path => {
            return path.includes('.') && !path.endsWith('/');
        });

        setSelectedFiles(selectedFiles);

        setTreeState({
            multiple: tree.multiple,
            expanded: tree.expandedState,
            checked: tree.checkedState,
            selected: tree.selectedState
        });

    }, [setSelectedFiles, setTreeState, tree]);

    const renderTreeNode = ({
                                node,
                                expanded,
                                hasChildren,
                                elementProps,
                                tree
                            }: RenderTreeNodePayload) => {
        const checked = tree.isNodeChecked(node.value);
        const indeterminate = tree.isNodeIndeterminate(node.value);

        const toggleChildren = (children: TreeNodeData[], isChecking: boolean) => {
            children.forEach((child) => {
                if (isChecking) {
                    tree.select(child.value);
                } else {
                    tree.deselect(child.value);
                }

                if (child.children) {
                    toggleChildren(child.children, isChecking);
                }
            });
        }

        const handleCheck = () => {
            const isChecking = !checked;

            if (isChecking) {
                tree.checkNode(node.value);
                tree.select(node.value);
            } else {
                tree.uncheckNode(node.value);
                tree.deselect(node.value);
            }

            if (node.children) {
                toggleChildren(node.children, isChecking);
            }
        }

        return (

            <Group gap="xs" {...elementProps}>
                <Checkbox.Indicator
                    checked={checked}
                    indeterminate={indeterminate}
                    onClick={handleCheck}
                />
                <Group gap={5} onClick={() => tree.toggleExpanded(node.value)}>
                    <span>{node.label}</span>
                    {hasChildren && (
                        <IconChevronDown
                            size={14}
                            style={{transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'}}
                        />
                    )}
                </Group>
            </Group>
        );
    };

    return (
        loading ? <Loader size={80}/> :
            <ScrollArea h={300} w={300}>
                <Tree
                    tree={tree}
                    data={treeData}
                    levelOffset={23}
                    expandOnClick={false}
                    renderNode={renderTreeNode}
                />
            </ScrollArea>
    );
};

export default FileSelector;
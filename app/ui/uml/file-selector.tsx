'use client';

import { useEffect, useState } from 'react';
import { Checkbox, Group, Loader, RenderTreeNodePayload, ScrollArea, Tree, TreeNodeData, useTree } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { fetchFiles } from "../../lib/github";
import { GitHubFile } from "../../types/github-file";
import useFileStore from "../../store/file-store";

interface FileSelectorProps {
    repoFullName: string;
}

const FileSelector = ({repoFullName}: FileSelectorProps) => {
    const {treeData, setTreeData, setSelectedFiles} = useFileStore();
    const tree = useTree({
        multiple: true,
    });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (treeData.length > 0) {
            return;
        }

        const formatTreeData = async (data: GitHubFile[]): Promise<TreeNodeData[]> => {
            const treeNodes: TreeNodeData[] = [];

            for (const item of data) {
                const node: TreeNodeData = {
                    label: item.name,
                    value: item.path,
                    children: [],
                };

                if (item.type === 'dir') {
                    const children = await fetchFiles(repoFullName, item.path) as GitHubFile[];
                    node.children = await formatTreeData(children);
                }

                treeNodes.push(node);
            }

            return treeNodes;
        };

        const fetchRepoFiles = async () => {
            const files = await fetchFiles(repoFullName) as GitHubFile[];
            const formattedData = await formatTreeData(files);
            setTreeData(formattedData);
        };


        setLoading(true)
        fetchRepoFiles().then(() => setLoading(false));
    }, [repoFullName, setTreeData, treeData.length]);


    useEffect(() => {
        const selectedFiles = tree.selectedState.filter(path => {
            return path.includes('.') && !path.endsWith('/');
        });

        setSelectedFiles(selectedFiles);
    }, [setSelectedFiles, tree.selectedState]);

    const renderTreeNode = ({
                                node,
                                expanded,
                                hasChildren,
                                elementProps,
                                tree
                            }: RenderTreeNodePayload) => {
        const checked = tree.isNodeChecked(node.value);
        const indeterminate = tree.isNodeIndeterminate(node.value);

        const toggleChildren = (children: TreeNodeData[]) => {
            children.forEach((child) => {
                tree.toggleSelected(child.value);

                if (child.children) {
                    toggleChildren(child.children);
                }
            });
        }

        const handleCheck = () => {
            const toggleSelected = () => {
                tree.toggleSelected(node.value);
                toggleChildren(node.children || []);
            }

            if (!checked) {
                tree.checkNode(node.value);
                toggleSelected();
            } else {
                tree.uncheckNode(node.value);
                toggleSelected();
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
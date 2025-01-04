'use client';

import { useEffect, useState } from 'react';
import {
    Checkbox,
    getTreeExpandedState,
    Group,
    RenderTreeNodePayload,
    ScrollArea,
    Tree,
    TreeNodeData,
    useTree
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { fetchFiles } from "../../lib/github";
import { useSession } from "next-auth/react";

interface FileSelectorProps {
    repoFullName: string;
    onSelect: (files: string[]) => void;
}

const FileSelector = ({repoFullName, onSelect}: FileSelectorProps) => {
    const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
    const tree = useTree({
        multiple: true,
        initialExpandedState: getTreeExpandedState(treeData, '*'),
        initialCheckedState: [],
    });
    const {data: session} = useSession();

    useEffect(() => {
        const fetchRepoFiles = async () => {
            const data = session?.accessToken && await fetchFiles(repoFullName, session?.accessToken);
            const formattedData = await formatTreeData(data);
            setTreeData(formattedData);
        };

        repoFullName && fetchRepoFiles();
    }, [repoFullName]);

    const formatTreeData = async (data: any[]): Promise<TreeNodeData[]> => {
        const treeNodes: TreeNodeData[] = [];

        for (const item of data) {
            const node: TreeNodeData = {
                label: item.name,
                value: item.path,
                children: [],
            };

            if (item.type === 'dir') {
                const children = await fetchChildren(item.path);
                node.children = await formatTreeData(children);
            }

            treeNodes.push(node);
        }

        return treeNodes;
    };

    const fetchChildren = async (path: string) => {
        const response = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${path}`);
        if (!response.ok) {
            throw new Error('Failed to fetch children');
        }
        return response.json();
    };

    useEffect(() => {
        onSelect(tree.selectedState);
    }, [tree.selectedState]);

    const renderTreeNode = ({
                                node,
                                expanded,
                                hasChildren,
                                elementProps,
                                tree
                            }: RenderTreeNodePayload) => {
        const checked = tree.isNodeChecked(node.value);
        const indeterminate = tree.isNodeIndeterminate(node.value);

        const handleCheck = () => {
            if (!checked) {
                tree.checkNode(node.value);
                tree.toggleSelected(node.value);
                node.children?.forEach(node => tree.toggleSelected(node.value));
            } else {
                tree.uncheckNode(node.value);
                tree.toggleSelected(node.value);
                node.children?.forEach(node => tree.toggleSelected(node.value));
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
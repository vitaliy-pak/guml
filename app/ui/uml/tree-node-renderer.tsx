import { Checkbox, Group, RenderTreeNodePayload, TreeNodeData } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import React from "react";

export const TreeNodeRenderer = ({
                              node,
                              expanded,
                              hasChildren,
                              elementProps,
                              tree
                          }: RenderTreeNodePayload) => {
    const checked = tree.isNodeChecked(node.value);
    const indeterminate = tree.isNodeIndeterminate(node.value);

    const handleCheck = () => {
        if (checked) {
            tree.uncheckNode(node.value);
        } else {
            tree.checkNode(node.value);
        }
        tree.toggleSelected(node.value);
        toggleChildren(node.children || []);
    };

    const toggleChildren = (children: TreeNodeData[]) => {
        children.forEach((child) => {
            tree.toggleSelected(child.value);
            if (child.children) {
                toggleChildren(child.children);
            }
        });
    };

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
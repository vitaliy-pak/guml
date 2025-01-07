import MDEditor from '@uiw/react-md-editor';
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from "react";
import { ActionIcon, Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconDownload, IconMaximize, IconMinimize, IconMinus, IconPlus } from "@tabler/icons-react";
import { theme } from "@/theme";

const UMLEditor = ({umlText}: { umlText: string }) => {
    const [markdown, setMarkdown] = useState(umlText);
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>('');
    const [opened, {open, close}] = useDisclosure(false);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'base',
            fontFamily: 'monospace',
        });

        const renderMermaidDiagram = () => {
            if (mermaidRef.current) {
                mermaidRef.current.innerHTML = '';
                const mermaidContent = markdown.replace('```mermaid\n', '').replace('```', '');
                mermaid.render('mermaid-diagram', mermaidContent).then((result) => {
                    if (mermaidRef.current) {
                        const svgWithSize = result.svg.replace(
                            /style="/,
                            'style="max-height: 300px; '
                        );
                        mermaidRef.current.innerHTML = svgWithSize;
                        setSvgContent(svgWithSize);
                    }
                });
            }
        };

        const timer = setTimeout(() => {
            renderMermaidDiagram();
        }, 0);

        return () => clearTimeout(timer);
    }, [markdown]);

    const handleDownload = () => {
        const blob = new Blob([svgContent], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uml-diagram.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleScaleUp = () => {
        setScale((prev) => prev + 0.1);
    };

    const handleScaleDown = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.1));
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: 10
        }}>
            <MDEditor height={'50vh'} style={isMobile ? {} : {flex: 1}} preview={'preview'} value={markdown}
                      onChange={(value) => value && setMarkdown(value)}/>
            <div style={{
                height: '50vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1
            }}>
                <div className={'mermaid'} ref={mermaidRef}
                     style={{maxWidth: '100%', maxHeight: '50vh', overflow: 'hidden'}}>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', gap: 10}}>
                    <ActionIcon style={{border: 'none'}} variant={'default'} onClick={open}><IconMaximize/></ActionIcon>
                    <ActionIcon style={{border: 'none'}} variant={'default'}
                                onClick={handleDownload}><IconDownload/></ActionIcon>
                </div>
            </div>
            <Modal
                opened={opened}
                onClose={close}
                fullScreen
                radius={0}
                transitionProps={{transition: 'fade', duration: 0}}
                closeButtonProps={{
                    icon: <IconMinimize/>,
                }}

            >
                <Modal.Body style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{transform: `scale(${scale})`, transformOrigin: 'center top'}}
                         dangerouslySetInnerHTML={{
                             __html: svgContent.replace(
                                 /style="max-height: 300px; /,
                                 'style="max-height: 100%; '
                             )
                         }}/>
                    <div style={{position: 'fixed', bottom: 20, right: 20, display: 'flex', gap: 10}}>
                        <ActionIcon style={{border: 'none'}} variant={'default'}
                                    onClick={handleScaleUp}><IconPlus/></ActionIcon>
                        <ActionIcon style={{border: 'none'}} variant={'default'}
                                    onClick={handleScaleDown}><IconMinus/></ActionIcon>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};

export default UMLEditor;
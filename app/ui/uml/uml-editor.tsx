import MDEditor from '@uiw/react-md-editor';
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from "react";

const UMLEditor = ({umlText}: { umlText: string }) => {
    const [markdown, setMarkdown] = useState(umlText);
    const mermaidRef = useRef<HTMLDivElement>(null);

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
                        mermaidRef.current.innerHTML = result.svg;
                    }
                });
            }
        };

        const timer = setTimeout(() => {
            renderMermaidDiagram();
        }, 0);

        return () => clearTimeout(timer);
    }, [markdown]);

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 10}}>
            <MDEditor height={'50vh'} style={{flex: 1}} preview={'preview'} value={markdown}
                      onChange={(value) => value && setMarkdown(value)}/>
            <div style={{flex: 1}} className={'mermaid'} ref={mermaidRef}></div>
        </div>

    )
};

export default UMLEditor;
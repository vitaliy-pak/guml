'use client';
import { useState } from 'react';
import { Button, Group, Loader, Stepper } from '@mantine/core';
import RepositorySelector from './repository-selector';
import FileSelector from './file-selector';
import { Repository } from '../../types/repository';
import { generateAIResponse } from "../../lib/ai";
import { fetchFiles } from "../../lib/github";
import { useSession } from "next-auth/react";
import UMLEditor from "./uml-editor";
import { GitHubFile } from "../../types/github-file";
import useFileStore from "../../store/file-store";

const UMLGenerationStepper = ({repos}: { repos: Repository[] }) => {
    const [active, setActive] = useState(0);
    const [umlText, setUMLText] = useState('');
    const [selectedRepoFullName, setSelectedRepoFullName] = useState<string | null>(null);
    const {data: session} = useSession();
    const [loading, setLoading] = useState(false);
    const {selectedFiles} = useFileStore();

    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleGenerateUML = async () => {
        if (!selectedRepoFullName || !session?.accessToken) {
            return;
        }

        try {
            setLoading(true);

            const fileContents: Record<string, string> = {};
            for (const file of selectedFiles) {
                const response = await fetchFiles(selectedRepoFullName, file) as GitHubFile;
                fileContents[file] = atob(response.content || '');
            }

            const prompt = `Generate Mermaid format diagram for the following code files:\n\n` +
                Object.entries(fileContents)
                    .map(([file, content]) => `// ${file}\n${content}`)
                    .join('\n\n') +
                `\n\nThe output should not include additional text or explanation or comments from you`;

            const mermaidUML = await generateAIResponse(prompt);

            setUMLText(mermaidUML);

            setLoading(false);

            nextStep();
        } catch (error) {
            console.error('Error generating UML:', error);
            setLoading(false);
        }
    }

    return (
        <>
            <Stepper active={active} onStepClick={setActive} styles={{
                content: {
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    minHeight: 400,
                    maxHeight: 600
                }
            }}>
                <Stepper.Step label="Select Repository" description="Select a code repository">
                    <RepositorySelector repos={repos} onSelect={setSelectedRepoFullName}/>
                </Stepper.Step>
                <Stepper.Step label="Select Files" description="Select files for UML generation">
                    {selectedRepoFullName && (
                        <FileSelector repoFullName={selectedRepoFullName} />
                    )}
                </Stepper.Step>
                <Stepper.Step label="Generate UML" description="Generate UML diagrams">
                    {
                        loading ? <Loader size={80}/> :
                            <Button onClick={handleGenerateUML}>
                                Generate UML
                            </Button>
                    }
                </Stepper.Step>
                <Stepper.Completed>
                    <UMLEditor umlText={umlText}/>
                </Stepper.Completed>
            </Stepper>

            <Group mt="xl">
                <Button variant="default" onClick={prevStep} disabled={active === 0}>
                    Back
                </Button>
                {active < 2 ?
                    <Button onClick={nextStep}>
                        Next step
                    </Button>
                    : null
                }
            </Group>
        </>
    );
};

export default UMLGenerationStepper;
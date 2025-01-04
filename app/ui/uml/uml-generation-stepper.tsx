'use client';
import { useState } from 'react';
import { Button, Group, Stepper } from '@mantine/core';
import RepositorySelector from './repository-selector';
import FileSelect from './file-selector';
import { Repository } from '../../types/repository';
import { generateAIResponse } from "../../lib/ai";
import { useRouter } from "next/navigation";
import { fetchFiles } from "../../lib/github";
import { useSession } from "next-auth/react";

const UMLGenerationStepper = ({repos}: { repos: Repository[] }) => {
    const [active, setActive] = useState(0);
    const [selectedRepoFullName, setSelectedRepoFullName] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const {data: session} = useSession();

    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleGenerateUML = async() => {
        if (!selectedRepoFullName || !session?.accessToken) {
            return;
        }

        for (const file of selectedFiles) {
            const response = await fetchFiles(selectedRepoFullName, session?.accessToken, file);
            const content = atob(response.content);

            const prompt =  `Generate PlantUML format diagram for the following code:
                //${file}
                ${content}
                Do not include any explanation or any additional text.
            `
            const plantUML = await generateAIResponse(prompt)
            console.log(plantUML);
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
                <Stepper.Step label="Select Repository" description="Select a repository">
                    <RepositorySelector repos={repos} onSelect={setSelectedRepoFullName}/>
                </Stepper.Step>
                <Stepper.Step label="Select Files" description="Select files for UML generation">
                    {selectedRepoFullName && (
                        <FileSelect repoFullName={selectedRepoFullName} onSelect={setSelectedFiles}/>
                    )}
                </Stepper.Step>
                <Stepper.Step label="Generate UML" description="Generate UML diagrams">
                    <Button onClick={handleGenerateUML}>
                        Generate UML
                    </Button>
                </Stepper.Step>
            </Stepper>

            <Group mt="xl">
                <Button variant="default" onClick={prevStep} disabled={active === 0}>
                    Back
                </Button>
                <Button onClick={nextStep}>
                    {active === 2 ? 'Finish' : 'Next step'}
                </Button>
            </Group>
        </>
    );
};

export default UMLGenerationStepper;
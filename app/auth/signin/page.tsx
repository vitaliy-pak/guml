'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@mantine/core';
import { IconBrandGithub } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default function Page() {
    const {data: session} = useSession();

    if (session?.accessToken) {
        redirect('/');
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <h1>Sign in</h1>
            <Button leftSection={<IconBrandGithub/>} title={'Sign in with GitHub'} color={'black'}
                    onClick={async () => await signIn('github')}>Sign in with GitHub</Button>
        </div>
    );
}
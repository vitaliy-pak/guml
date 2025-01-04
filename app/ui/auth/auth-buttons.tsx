'use client';
import { Button } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthButtons = () => {
    const { data: session, status } = useSession();
    const { replace } = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            replace(`/uml`);
        }
    }, [replace, status]);

    return (
        <>
            {session ? (
                <Button onClick={() => signOut()}>
                    Sign Out
                </Button>
            ) : (
                <Button onClick={() => signIn('github')}>
                    Sign In
                </Button>
            )}
        </>
    );
};

export default AuthButtons;
'use client';
import { Button } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from "react";

const AuthButtons = () => {
    const {data: session} = useSession();

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
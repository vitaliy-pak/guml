'use client';
import { Button } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import React from "react";

const LogoutButton = () => {
    const {data: session} = useSession();

    return (
        <>
            {session?.accessToken && (
                <Button onClick={() => signOut()}>
                    Sign Out
                </Button>
            )}
        </>
    );
};

export default LogoutButton;
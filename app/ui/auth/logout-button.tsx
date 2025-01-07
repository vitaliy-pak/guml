'use client';

import { Button } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import React from "react";

const LogoutButton = () => {
    const {data: session} = useSession();

    return (
        <>
            {session?.accessToken && (
                <Button onClick={async () => await signOut()}>
                    Sign out
                </Button>
            )}
        </>
    );
};

export default LogoutButton;
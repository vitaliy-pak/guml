import "@mantine/core/styles.css";
import React from "react";
import {
    MantineProvider,
    ColorSchemeScript,
    mantineHtmlProps, AppShell, AppShellHeader, AppShellMain, AppShellFooter,
    Text
} from "@mantine/core";
import { theme } from "../theme";
import AuthButtons from "./ui/auth/auth-buttons";
import AuthProvider from "./providers/auth-provider";

export const metadata = {
    title: "Mantine Next.js template",
    description: "I am using Mantine with Next.js!",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript/>
            <link rel="shortcut icon" href="/favicon.svg"/>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <AuthProvider>
            <MantineProvider theme={theme}>
                <AppShell
                    header={{height: 60}}
                    footer={{height: 60}}
                >
                    <AppShellHeader p="md">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text size="xl" style={{fontWeight: 700}}>
                                GUML
                            </Text>
                            <AuthButtons/>
                        </div>
                    </AppShellHeader>
                    <AppShellMain style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {children}
                    </AppShellMain>
                    <AppShellFooter p="md">
                        <Text size="sm" style={{textAlign: 'center'}}>
                            &copy; {new Date().getFullYear()} GUML. All rights reserved.
                        </Text>
                    </AppShellFooter>
                </AppShell>
            </MantineProvider>
        </AuthProvider>
        </body>
        </html>
    );
}

// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import { HashRouter } from "react-router-dom";
import { BackendProvider, WorkspaceProvider } from "@gooddata/sdk-ui";

import { Router } from "../../components/router";
import { Layout } from "../../components/layout";
import { AuthProvider, useAuth } from "../../contexts";
import { WORKSPACE_ID } from "../../constants";

export const App: FC = () => {
    const { backend } = useAuth();

    return (
        <HashRouter>
            <AuthProvider>
                <BackendProvider backend={backend}>
                    <WorkspaceProvider workspace={WORKSPACE_ID}>
                        <Layout>
                            <Router />
                        </Layout>
                    </WorkspaceProvider>
                </BackendProvider>
            </AuthProvider>
        </HashRouter>
    );
};

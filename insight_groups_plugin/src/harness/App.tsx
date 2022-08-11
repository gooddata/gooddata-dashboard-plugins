// (C) 2019-2021 GoodData Corporation
import React from "react";
import { PluginLoader } from "./PluginLoader";
import { ThemeProvider } from "@gooddata/sdk-ui-theme-provider";
import { ITheme } from "@gooddata/sdk-model";

const SimpleTheme: ITheme = {
    palette: {
        primary: {
            base: "#14b2e2",
        },
    },
    dashboards: {
        content: {
            widget: {
                title: {
                    color: "#464e56",
                },
            },
        },
    },
    modal: {
        outsideBackgroundColor: "#e5e5e5",
        borderColor: "#464e56",
    },
};

export const App: React.FC = () => {
    return (
        <div>
            <ThemeProvider theme={SimpleTheme}>
                <PluginLoader />
            </ThemeProvider>
        </div>
    );
};

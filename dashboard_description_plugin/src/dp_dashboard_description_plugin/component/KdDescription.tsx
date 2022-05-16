// (C) 2022 GoodData Corporation
import React from "react";
import { ExtendedDashboardWidget, IDashboardWidgetProps } from "@gooddata/sdk-ui-dashboard";

import "./kdDescription.css";

type PluginData = {
    description: string[];
};

export interface IWidgetExtras {
    configUrl: string;
}

type PluginDataLoadingState = null | "loading" | "loaded" | "error";

export const KdDescription: React.FC<IDashboardWidgetProps> = (props) => {
    const { configUrl } = props.widget as ExtendedDashboardWidget & IWidgetExtras;

    const [data, setData] = React.useState<PluginData | null>(null);
    const [loadingState, setLoadingState] = React.useState<PluginDataLoadingState>(null);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    React.useEffect(() => {
        setLoadingState("loading");
        fetch(configUrl)
            .then((res) => res.json())
            .then((data) => {
                setLoadingState("loaded");
                setData(data);
            })
            .catch((error) => {
                setLoadingState("error");
                setErrorMessage(error.message);
            });

        return () => {};
    }, []);

    if (loadingState === "error") {
        return <div className="error">{errorMessage}</div>;
    }

    if (loadingState === "loading") {
        return <div className="wrap">Loading...</div>;
    }

    return (
        <div className="wrap">
            {data?.description.map((paragraph, i) => {
                return (
                    <p key={i} className="paragraph">
                        {paragraph}
                    </p>
                );
            })}
        </div>
    );
};

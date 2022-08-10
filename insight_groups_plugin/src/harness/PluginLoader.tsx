// (C) 2019-2021 GoodData Corporation
import React from "react";
import { idRef } from "@gooddata/sdk-model";
import { DashboardStub, IEmbeddedPlugin } from "@gooddata/sdk-ui-loaders";
import PluginFactory from "../dp_insight_groups";
import { DEFAULT_DASHBOARD_ID } from "./constants";
import { DashboardConfig } from "@gooddata/sdk-ui-dashboard";

const Plugins: IEmbeddedPlugin[] = [
    {
        factory: PluginFactory,
        //NOTE: Can added custom configuration here to tests grouping
        parameters: JSON.stringify({}),
    },
];
const Config: DashboardConfig = {
    mapboxToken: process.env.MAPBOX_TOKEN,
};

export const PluginLoader = (): JSX.Element => {
    return (
        <DashboardStub
            dashboard={idRef(process.env.DASHBOARD_ID ?? DEFAULT_DASHBOARD_ID)}
            loadingMode="staticOnly"
            config={Config}
            extraPlugins={Plugins}
        />
    );
};

// (C) 2019-2022 GoodData Corporation
import React from "react";
import { idRef } from "@gooddata/sdk-model";
import { DashboardStub } from "@gooddata/sdk-ui-loaders";
import PluginFactory from "../dp_radial_bar_chart_plugin";
import { DEFAULT_DASHBOARD_ID } from "./constants";

const Plugins = [{ factory: PluginFactory }];
const Config = {
    mapboxToken: process.env.MAPBOX_TOKEN,
};

export const PluginLoader = () => {
    return (
        <DashboardStub
            dashboard={idRef(process.env.DASHBOARD_ID || DEFAULT_DASHBOARD_ID)}
            loadingMode="staticOnly"
            config={Config}
            extraPlugins={Plugins}
        />
    );
};

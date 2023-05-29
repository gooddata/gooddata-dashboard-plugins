// (C) 2019-2022 GoodData Corporation
import React, { useCallback, useMemo, useState } from "react";
import { idRef } from "@gooddata/sdk-model";
import { useDashboardLoaderWithPluginManipulation } from "@gooddata/sdk-ui-loaders";
import PluginFactory from "../dp_jza_workshop";
import { DEFAULT_DASHBOARD_ID } from "./constants";

import { ErrorComponent, LoadingComponent } from "@gooddata/sdk-ui";
import { PluginToolbar } from "./PluginToolbar";

const Plugins = [{ factory: PluginFactory }];
const Config = { mapboxToken: process.env.MAPBOX_TOKEN };
const DashboardRef = idRef(process.env.DASHBOARD_ID || DEFAULT_DASHBOARD_ID, "analyticalDashboard");

export const PluginLoader = () => {
    const { loaderStatus, reloadPlugins, setExtraPlugins, extraPlugins, hidePluginOverlays } =
        useDashboardLoaderWithPluginManipulation({
            dashboard: DashboardRef,
            loadingMode: "staticOnly",
            config: Config,
            extraPlugins: Plugins,
        });

    const isPluginEnabled = !!extraPlugins?.length;

    const togglePlugin = useCallback(() => {
        if (isPluginEnabled) {
            setExtraPlugins([]);
        } else {
            setExtraPlugins(Plugins);
        }
    }, [isPluginEnabled, setExtraPlugins]);

    const [isHideOverlaysEnabled, setIsHideOverlaysEnabled] = useState(true);
    const hidePluginsOverlaysCallbacks = useCallback(() => {
        if (isHideOverlaysEnabled) {
            setIsHideOverlaysEnabled(false);
            hidePluginOverlays();
        }
    }, [isPluginEnabled, setExtraPlugins]);

    const { status, error, result } = loaderStatus;

    const ToolbarComponent = useMemo(() => {
        return function CustomToolbar() {
            return (
                <PluginToolbar
                    isPluginEnabled={isPluginEnabled}
                    reloadPlugins={reloadPlugins}
                    togglePlugin={togglePlugin}
                    isHideOverlaysEnabled={isHideOverlaysEnabled}
                    hideOverlays={hidePluginsOverlaysCallbacks}
                />
            );
        };
    }, [isPluginEnabled, reloadPlugins, togglePlugin]);

    if (status === "loading") {
        return <LoadingComponent />;
    }

    if (status === "error" || result === undefined) {
        return <ErrorComponent message={error?.message ?? ""} />;
    }

    return <result.DashboardComponent {...result.props} ToolbarComponent={ToolbarComponent} />;
};

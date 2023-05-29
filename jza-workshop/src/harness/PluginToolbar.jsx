// (C) 2022-2023 GoodData Corporation
import {
    DefaultDashboardToolbar,
    DefaultDashboardToolbarButton,
    DefaultDashboardToolbarGroup,
    selectIsInEditMode,
    useDashboardSelector,
} from "@gooddata/sdk-ui-dashboard";
import React from "react";

export const PluginToolbar = (props) => {
    const { isPluginEnabled, isHideOverlaysEnabled, reloadPlugins, togglePlugin, hideOverlays } = props;

    const isInEditMode = useDashboardSelector(selectIsInEditMode);

    return (
        <DefaultDashboardToolbar>
            <DefaultDashboardToolbarGroup title="Plugins">
                <DefaultDashboardToolbarButton icon="sync" onClick={reloadPlugins} tooltip="Reload" />
                {!!isInEditMode && (
                    <DefaultDashboardToolbarButton
                        icon="invisible"
                        onClick={hideOverlays}
                        tooltip="Hide overlays"
                        disabled={!isHideOverlaysEnabled}
                    />
                )}

                <DefaultDashboardToolbarButton
                    icon="circle-cross"
                    onClick={togglePlugin}
                    tooltip={isPluginEnabled ? "Disable temporarily" : "Enable"}
                    isActive={!isPluginEnabled}
                />
            </DefaultDashboardToolbarGroup>
        </DefaultDashboardToolbar>
    );
};

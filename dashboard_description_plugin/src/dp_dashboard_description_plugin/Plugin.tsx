// (C) 2021-2022 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    newDashboardSection,
    newDashboardItem,
    newCustomWidget,
} from "@gooddata/sdk-ui-dashboard";

import entryPoint from "../dp_dashboard_description_plugin_entry";

import {IWidgetExtras, KdDescription} from './component/KdDescription';

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;
    private configUrl: string = '';

    onPluginLoaded(_context: any, params: string) {
        this.configUrl = params ?? '/texts.json';
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer
    ): void {
        customize.customWidgets().addCustomWidget("kdDescription", KdDescription);
        customize.layout().customizeFluidLayout((_layout, customizer) => {
            customizer.addSection(
                0,
                newDashboardSection(
                    "Dashboard description",
                    newDashboardItem(
                        /**
                         * Creates new custom widget component with extras defined
                         * in the {@link KdDescription}'s {@link IWidgetExtras}.
                         */
                        newCustomWidget<IWidgetExtras>(
                            "kdDescription1", 
                            "kdDescription", 
                            {configUrl: this.configUrl}
                        ),
                        {
                            xl: {
                                // all 12 columns of the grid will be 'allocated' for this this new item
                                gridWidth: 12,
                                // minimum height since the custom widget now has just some one-liner text
                                gridHeight: 1,
                            },
                        }
                    ),
                ),
            );
        });
    }
}

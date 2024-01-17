// (C) 2021-2024 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
    newCustomWidget,
    newDashboardItem,
    newDashboardSection,
} from "@gooddata/sdk-ui-dashboard";
import invariant from "ts-invariant";
import JSON5 from "json5";

import entryPoint from "../dp_whitelabelling_bar_entry/index.js";

import { IWhiteLabellingBarWidgetExtras, WhiteLabellingBar } from "./components/WhiteLabellingBar.js";
import { PluginParams } from "./interface.js";
import { validateParameters } from "./utils.js";
import { WHITE_LABELLING_BAR_WIDGET_TYPE } from "./constants.js";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    private parameters: PluginParams = {};

    public onPluginLoaded(_ctx: DashboardContext, parameters?: string): Promise<void> | void {
        invariant(!!parameters?.length, `No parameters specified for ${this.displayName} plugin`);

        let parametersParsed: PluginParams;

        try {
            parametersParsed = JSON5.parse(parameters);

            validateParameters(parametersParsed);
            this.parameters = parametersParsed;
        } catch (e) {
            console.error("### Parsing parameters failed:", (e as Error).message);
            console.error("### Parameters:", parameters);

            throw new Error("Check the plugin parameters");
        }
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        _handlers: IDashboardEventHandling,
    ): void {
        customize.customWidgets().addCustomWidget(WHITE_LABELLING_BAR_WIDGET_TYPE, WhiteLabellingBar);
        customize.layout().customizeFluidLayout((layout, customizer) => {
            customizer.addSection(
                layout.sections.length, // add as the last section
                newDashboardSection(
                    undefined, // no section title
                    newDashboardItem(
                        newCustomWidget<IWhiteLabellingBarWidgetExtras>(
                            `plugin-${WHITE_LABELLING_BAR_WIDGET_TYPE}`,
                            WHITE_LABELLING_BAR_WIDGET_TYPE,
                            this.parameters,
                        ),
                        {
                            xl: {
                                // all 12 columns of the grid will be 'allocated' for this new item
                                gridWidth: 12,
                                // minimum height since the custom widget now has just some one-liner text
                                gridHeight: 1,
                            },
                        },
                    ),
                ),
            );
        });
    }
}

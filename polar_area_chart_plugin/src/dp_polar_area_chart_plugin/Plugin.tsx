// (C) 2021-2023 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
} from "@gooddata/sdk-ui-dashboard";
import { insightVisualizationUrl, widgetTitle } from "@gooddata/sdk-model";

import entryPoint from "../dp_polar_area_chart_plugin_entry/index.js";
import PolarAreaChart from "./components/PolarAreaChart.js";

export const WIDGET_TITLE_SUFFIX = "_polar_area_chart_plugin_";
const RE = new RegExp(`(.*)${WIDGET_TITLE_SUFFIX}$`);

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        handlers: IDashboardEventHandling,
    ): void {
        customize.insightWidgets().withCustomProvider((insight, widget) => {
            if (
                (insightVisualizationUrl(insight) === "local:pie" ||
                    insightVisualizationUrl(insight) === "local:donut") &&
                widgetTitle(widget).match(RE)
            ) {
                return PolarAreaChart;
            }
            return undefined;
        });
        handlers.addEventHandler("GDC.DASH/EVT.INITIALIZED", (evt) => {
            // eslint-disable-next-line no-console
            console.log("### Dashboard initialized", evt);
        });
    }
}

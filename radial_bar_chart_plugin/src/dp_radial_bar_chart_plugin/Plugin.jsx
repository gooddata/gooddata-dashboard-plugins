// (C) 2021-2023 GoodData Corporation
import { DashboardPluginV1 } from "@gooddata/sdk-ui-dashboard";
import { insightVisualizationUrl, widgetTitle } from "@gooddata/sdk-model";

import entryPoint from "../dp_radial_bar_chart_plugin_entry";
import RadialBarChart from "./RadialBarChart";

export const WIDGET_TITLE_SUFFIX = '_radial_bar_chart_plugin_';
const RE = new RegExp(`(.*)${WIDGET_TITLE_SUFFIX}$`);

export class Plugin extends DashboardPluginV1 {
    author = entryPoint.author;
    displayName = entryPoint.displayName;
    version = entryPoint.version;
    minEngineVersion = entryPoint.minEngineVersion;
    maxEngineVersion = entryPoint.maxEngineVersion;

    onPluginLoaded(_ctx, _parameters) {
        /*
         * This will be called when the plugin is loaded in context of some dashboard and before
         * the register() method.
         *
         * If the link between the dashboard and this plugin is parameterized, then all the parameters will
         * be included in the parameters string.
         *
         * The parameters are useful to modify plugin behavior in context of particular dashboard.
         *
         * Note: it is safe to delete this stub if your plugin does not need any specific initialization.
         */
    }

    register(_ctx, customize, handlers) {
        customize.insightWidgets().withCustomProvider((insight, widget) => {
            if (
                insightVisualizationUrl(insight) === "local:column" &&
                widgetTitle(widget).match(RE)
                ) {
              return RadialBarChart;
            }
            return undefined;
        });
        handlers.addEventHandler("GDC.DASH/EVT.INITIALIZED", (evt) => {
            // eslint-disable-next-line no-console
            console.log("### Dashboard initialized", evt);
        });
    }

    onPluginUnload(_ctx) {
        /*
         * This will be called when user navigates away from the dashboard enhanced by the plugin. At this point,
         * your code may do additional teardown and cleanup.
         *
         * Note: it is safe to delete this stub if your plugin does not need to do anything extra during unload.
         */
    }
}

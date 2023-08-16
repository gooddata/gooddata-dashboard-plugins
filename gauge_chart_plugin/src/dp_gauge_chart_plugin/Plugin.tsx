// (C) 2021-2023 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
} from "@gooddata/sdk-ui-dashboard";
import { insightTitle } from "@gooddata/sdk-model";

import entryPoint from "../dp_gauge_chart_plugin_entry";

import { gaugeFactory } from "./component/Gauge";
import { isUsableForGauge } from "./utils/gaugeUtils";

/**
 * The format property accepts these values only. Values other than these are taken for invalid.
 */
const VALID_FORMATS = ["#", "%"];

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    /**
     * Prefixes defined by plugin to be replaced.
     */
    public prefixes: string[] = ["gauge"];
    /**
     * Defines gauge chart min/max values label visibility.
     */
    public showLabels: boolean = false;
    /**
     * Defines format in which numbers are shown in the gauge chart.
     */
    public format: "%" | "#" = "%";

    /**
     * Validates, if the format set up in plugin parameters are valid.
     *
     * @param format Format set in the plugin parameters.
     * @private
     */
    private isFormatValid(format?: string): boolean {
        if (!format) {
            return false;
        }
        return VALID_FORMATS.includes(format);
    }

    public onPluginLoaded(_ctx: DashboardContext, parameters?: string): Promise<void> | void {
        /**
         * If the parameters are undefined, the plugin will work with default values.
         */
        if (parameters) {
            try {
                const parsedParameters = JSON.parse(parameters);
                /**
                 * Run the `link-plugin` command with `--with-parameters` flag and enter all the title prefixes you want to replace with
                 * `GaugeChart` separated by space. By default all bullet charts with tag `gauge` will be replaced.
                 */
                this.prefixes = parsedParameters?.prefixes.split(" ") || ["gauge"];
                this.showLabels = parsedParameters?.showLabels || false;
                this.format = this.isFormatValid(parsedParameters.format) ? parsedParameters.format : "%";
            } catch (error) {
                console.error(
                    "Could not parse parameters. Check the formatting of the parameters in target dashboard settings.",
                );
            }
        }
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        _handlers: IDashboardEventHandling,
    ): void {
        customize.insightWidgets().withCustomProvider((insight) => {
            /**
             * If at least one prefix from plugin parameters (or `gauge` prefix) is present in the prefixes of the insight title
             * and the insight is suitable to be used, replace this insight with GaugeAdapter component.
             */
            if (
                this.prefixes.some((prefix) => insightTitle(insight).startsWith(prefix)) &&
                isUsableForGauge(insight)
            ) {
                return gaugeFactory({ showLabels: this.showLabels, format: this.format });
            }
            /**
             * If undefined is returned, nothing happens and original component stays in place.
             */
            return undefined;
        });
    }
}

// (C) 2021-2022 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
    CustomDashboardKpiComponent,
    CustomDashboardInsightComponent,
} from "@gooddata/sdk-ui-dashboard";
import React from "react";
import { insightId } from "@gooddata/sdk-model";

import entryPoint from "../dp_tooltip_plugin_entry/index.js";

import { Tooltip } from "./component/Tooltip.js";
import { TOOLTIP_DATA } from "./fixtures/fixtures.js";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    public onPluginLoaded(_ctx: DashboardContext, _parameters?: string): Promise<void> | void {
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

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        _handlers: IDashboardEventHandling,
    ): void {
        customize.kpiWidgets().withCustomDecorator((kpiProvider) => (insight, widget) => {
            /**
             * This custom decorator tries to find the tooltip data in the provided
             * tooltip data store. If the tooltip information for the KPI is found
             * according to its identifier, it will add the tooltip component to the
             * KPI widget's context menu.
             *
             * If no data for the current widget are found, the decorator returns widget
             * unchanged.
             */
            const identifier = widget.identifier;

            const KpiTooltipCustomDecorator: CustomDashboardKpiComponent = (props) => {
                const Kpi = kpiProvider(insight, widget);
                const tooltipText = TOOLTIP_DATA[identifier];

                if (tooltipText) {
                    return (
                        <>
                            <Kpi {...props} />
                            <Tooltip widgetIdentifier={identifier} tooltipText={tooltipText} />
                        </>
                    );
                }
                return <Kpi {...props} />;
            };
            return KpiTooltipCustomDecorator;
        });

        customize.insightWidgets().withCustomDecorator((insightProvider) => (insight, widget) => {
            /**
             * This custom decorator tries to find the tooltip data in the provided
             * tooltip data store. If the tooltip information for the Insight is found
             * according to its identifier, it will add the tooltip component to the
             * Insight widget's context menu.
             *
             * If no data for the current widget are found, the decorator returns widget
             * unchanged.
             */
            const identifier = insightId(insight);

            const InsightTooltipCustomDecorator: CustomDashboardInsightComponent = (props) => {
                const Insight = insightProvider(insight, widget);
                const tooltipText = TOOLTIP_DATA[identifier];
                if (tooltipText) {
                    return (
                        <>
                            <Insight {...props} />
                            <Tooltip widgetIdentifier={identifier} tooltipText={tooltipText} />
                        </>
                    );
                }
                return <Insight {...props} />;
            };

            return InsightTooltipCustomDecorator;
        });
    }

    public onPluginUnload(_ctx: DashboardContext): Promise<void> | void {
        /*
         * This will be called when user navigates away from the dashboard enhanced by the plugin. At this point,
         * your code may do additional teardown and cleanup.
         *
         * Note: it is safe to delete this stub if your plugin does not need to do anything extra during unload.
         */
    }
}

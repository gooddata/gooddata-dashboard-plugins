// (C) 2021 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardInsightProps,
    IDashboardKpiProps,
} from "@gooddata/sdk-ui-dashboard";

import entryPoint from "../dp_tooltip_plugin_entry";

import React from "react";
import { Tooltip } from "./component/Tooltip";
import { TOOLTIP_DATA } from "./fixtures/fixtures";
import { insightId } from "@gooddata/sdk-model";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer
    ): void {
        customize
            .kpiWidgets()
            .withCustomDecorator((kpiProvider) => (insight, widget) => {
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

                function KpiTooltipCustomDecorator(
                    props: JSX.IntrinsicAttributes &
                        IDashboardKpiProps & { children?: React.ReactNode }
                ) {
                    const Kpi = kpiProvider(insight, widget);
                    const tooltipText = TOOLTIP_DATA[identifier];

                    if (tooltipText) {
                        return (
                            <>
                                <Kpi {...props} />
                                <Tooltip
                                    widgetIdentifier={identifier}
                                    tooltipText={tooltipText}
                                />
                            </>
                        );
                    }
                    return <Kpi {...props} />;
                }
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
            
            function InsightTooltipCustomDecorator(props: JSX.IntrinsicAttributes & IDashboardInsightProps & {children?: React.ReactNode}) {
                const Insight = insightProvider(insight, widget);
                const tooltipText = TOOLTIP_DATA[identifier];
                if(tooltipText) {
                    return (<>
                        <Insight {...props}/>
                        <Tooltip widgetIdentifier={identifier} tooltipText={tooltipText}/>
                    </>
                    )
                }
                return <Insight {...props}/>
            }

            return InsightTooltipCustomDecorator;
        });
    }
}

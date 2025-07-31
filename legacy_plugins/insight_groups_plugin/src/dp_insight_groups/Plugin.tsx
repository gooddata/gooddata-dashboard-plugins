// (C) 2022-2023 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardInsightProps,
} from "@gooddata/sdk-ui-dashboard";
import JSON5 from "json5";

import entryPoint from "../dp_insight_groups_entry/index.js";

import React, { useState } from "react";
import { GroupedWidgetHeader } from "./components/GroupedWidgetHeader/GroupedWidgetHeader.js";
import { validateParameters } from "./utils.js";
import { IGroupsHidingHooks, IGroupsConfig, IGroupsSelection, IWidgetTitles } from "./interface.js";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    private hidingHooks: IGroupsHidingHooks = {};
    private groupsConfig: IGroupsConfig = {};
    private groupsSelection: IGroupsSelection = {};
    private widgetTitles: IWidgetTitles = {};

    public onPluginLoaded(_ctx: DashboardContext, _parameters?: string): Promise<void> | void {
        if (!_parameters || _parameters.length === 0) {
            return;
        }

        try {
            const parametersParsed = JSON5.parse(_parameters);

            validateParameters(parametersParsed);

            this.groupsConfig = parametersParsed;
            this.groupsSelection = Object.keys(this.groupsConfig).reduce<IGroupsSelection>((acc, key) => {
                acc[key] = this.groupsConfig[key][0];
                return acc;
            }, {});
        } catch (e) {
            // test it
            console.error("### Parsing parameters failed", e.message);
            console.error("### Parameters", _parameters);
        }
    }

    public register(_ctx: DashboardContext, customize: IDashboardCustomizer): void {
        customize.insightWidgets().withCustomDecorator((next) => {
            return (insight, widget) => {
                const Decorated = next(insight, widget);
                // collecting widget titles
                this.widgetTitles[insight.insight.identifier] = widget.title;

                // find group in which the insight is
                let groupKey: string | undefined;
                for (const key in this.groupsConfig) {
                    if (this.groupsConfig[key].indexOf(insight.insight.identifier) !== -1) {
                        groupKey = key;
                    }
                }

                return (props: JSX.IntrinsicAttributes & IDashboardInsightProps) => {
                    // do not process the widget if it's not part of any group
                    if (groupKey === undefined) {
                        return <Decorated {...props} />;
                    } else {
                        const [hidden, setHidden] = useState(
                            insight.insight.identifier !== this.groupsSelection[groupKey],
                        );
                        this.hidingHooks[insight.insight.identifier] = setHidden;

                        return (
                            <>
                                <GroupedWidgetHeader
                                    hideColumn={hidden}
                                    selectedIdentifier={insight.insight.identifier}
                                    groupInsightsIdentifiers={this.groupsConfig[groupKey]}
                                    widgetTitles={this.widgetTitles}
                                    onGroupInsightSelected={(identifier) =>
                                        this.selectGroupInsight(groupKey ?? "", identifier)
                                    }
                                    widget={widget}
                                />
                                <Decorated {...props} />
                            </>
                        );
                    }
                };
            };
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

    selectGroupInsight(groupKey: string, selectedIdentifier: string) {
        this.groupsSelection[groupKey] = selectedIdentifier;
        this.groupsConfig[groupKey].forEach((identifier) => {
            this.hidingHooks[identifier](identifier !== selectedIdentifier);
        });
    }
}

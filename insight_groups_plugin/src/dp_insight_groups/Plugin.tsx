// (C) 2022 GoodData Corporation
import React from "react";
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
    IDashboardInsightProps,
    CustomDashboardInsightComponent,
} from "@gooddata/sdk-ui-dashboard";
import { IInsight, IWidget } from "@gooddata/sdk-model";

import entryPoint from "../dp_insight_groups_entry";

import { UngroupedWidget } from "./GroupedWidgets/UngroupedWidget";
import { GroupedWidget } from "./GroupedWidgets/GroupedWidget";

interface IInsightGroupsState {
    hidingHooks: {
        [insightIdentifier: string]: (state: boolean) => void;
    };
    groupsConfig: {
        [groupKey: string]: string[];
    };
    groupsSelection: {
        [groupKey: string]: string;
    };
    widgetTitles: {
        [insightIdentifier: string]: string;
    };
}

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    private state: IInsightGroupsState = {
        hidingHooks: {},
        groupsConfig: {},
        groupsSelection: {},
        widgetTitles: {},
    };

    public onPluginLoaded(_ctx: DashboardContext, parameters?: string): Promise<void> | void {
        if (!parameters || parameters.length === 0) {
            return;
        }

        try {
            const parametersParsed = JSON.parse(parameters);

            if (typeof parametersParsed !== "object") {
                console.error("Invalid type of plugin parameter:", typeof parametersParsed);
                return;
            }

            if (Object.keys(parametersParsed).some((key) => !Array.isArray(parametersParsed[key]))) {
                console.error("Invalid type of group configuration:", parametersParsed);
                return;
            }

            this.state.groupsConfig = parametersParsed;
            this.state.groupsSelection = Object.keys(parametersParsed).reduce((acc, key) => {
                acc[key] = parametersParsed[key][0];
                return acc;
            }, {});
        } catch (e) {
            // test it
            console.error("Parsing parameters failed", e.message);
            console.error("Parameters", parameters);
        }
    }

    public selectGroupInsight(groupKey: string, selectedIdentifier: string) {
        const { groupsSelection, groupsConfig, hidingHooks } = this.state;

        groupsSelection[groupKey] = selectedIdentifier;
        groupsConfig[groupKey].forEach((identifier) => {
            hidingHooks[identifier](identifier !== selectedIdentifier);
        });
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        _handlers: IDashboardEventHandling,
    ): void {
        customize.insightWidgets().withCustomDecorator((next) => {
            return (insight, widget) => {
                const Decorated = next(insight, widget);

                // collecting widget titles
                this.setTitle(insight, widget);
                // find group in which the insight is
                const groupKey = this.getGroup(insight);

                return insightGroupFactory(this.state, Decorated, insight, groupKey, (identifier) =>
                    this.selectGroupInsight(groupKey!, identifier),
                );
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

    private getGroup(insight: IInsight): string | null {
        const { groupsConfig } = this.state;

        for (const key in groupsConfig) {
            if (groupsConfig[key].indexOf(insight.insight.identifier) !== -1) {
                return key;
            }
        }
        return null;
    }

    private setTitle(insight: IInsight, widget: IWidget) {
        const { widgetTitles } = this.state;
        widgetTitles[insight.insight.identifier] = widget.title;
    }
}

const insightGroupFactory = (
    state: IInsightGroupsState,
    Component: React.ComponentType<IDashboardInsightProps>,
    insight: IInsight,
    groupKey: string | null,
    onGroupInsightSelected: (identifier: string) => void,
): CustomDashboardInsightComponent => {
    const InsightGroups: CustomDashboardInsightComponent = (props) => {
        const { groupsSelection, groupsConfig, widgetTitles, hidingHooks } = state;

        // do not process the widget if it's not part of any group
        if (groupKey === null) {
            return <UngroupedWidget Component={Component} {...props} />;
        }

        // widget is part of group
        return (
            <GroupedWidget
                Component={Component}
                hidden={insight.insight.identifier !== groupsSelection[groupKey]}
                groupInsightsIdentifiers={groupsConfig[groupKey]}
                widgetTitles={widgetTitles}
                hidingHooks={hidingHooks}
                {...props}
                onGroupInsightSelected={onGroupInsightSelected}
            />
        );
    };

    return InsightGroups;
};

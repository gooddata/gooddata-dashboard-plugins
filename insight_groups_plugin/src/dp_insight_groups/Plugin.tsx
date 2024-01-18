// (C) 2021-2024 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
    IDashboardInsightProps,
    removeSectionItemByWidgetRef,
    DashboardInitialized,
    useDashboardSelector,
    selectIsInEditMode,
    DashboardSaved,
} from "@gooddata/sdk-ui-dashboard";
import JSON5 from "json5";
import React, { Dispatch, useState } from "react";
import { IInsight, isIdentifierRef, IDashboardWidget, IDashboardLayoutSection } from "@gooddata/sdk-model";

import entryPoint from "../dp_insight_groups_entry/index.js";

import { GroupedWidgetHeader } from "./components/GroupedWidgetHeader/GroupedWidgetHeader.js";
import { validateParameters } from "./utils/validateParameters.js";
import { IGroupsConfig, IWidgetTitles } from "./interface.js";
import { filterInsightWidgets } from "./utils/filterInsightWidgets.js";
import { getInsightIdentifiers } from "./utils/getInsightIdentifiers.js";
import { getWidgetsToHide } from "./utils/getWidgetsToHide.js";
import { DASHBOARD_EVENT_INITIALIZED, DASHBOARD_EVENT_SAVED } from "./constants.js";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    private groupsConfig: IGroupsConfig = {};
    private widgetTitles: IWidgetTitles = {};
    private groupInsights: IInsight[] = [];
    private dashboardLayoutSections: IDashboardLayoutSection<IDashboardWidget>[] = [];

    public onPluginLoaded(_ctx: DashboardContext, _parameters?: string): Promise<void> | void {
        if (!_parameters || _parameters.length === 0) {
            return;
        }

        try {
            const parametersParsed = JSON5.parse(_parameters);

            validateParameters(parametersParsed);

            this.groupsConfig = parametersParsed;
        } catch (e: unknown) {
            // test it
            console.error("### Parsing parameters failed", (e as Error).message);
            console.error("### Parameters", _parameters);
        }
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        handler: IDashboardEventHandling,
    ): void {
        /**
         * The new way to hide grouped insights due to dashboard fluid layout specifics.
         */
        handler.addEventHandler(DASHBOARD_EVENT_INITIALIZED, (event: DashboardInitialized, dispatch) => {
            const payload = event.payload;
            const insightIdsToGroup = Object.values(this.groupsConfig).flat();

            this.groupInsights = payload.insights
                .slice()
                .filter((i) => insightIdsToGroup.includes(i.insight.identifier));
            this.dashboardLayoutSections = payload?.dashboard?.layout?.sections ?? []; // saving it to use whenever dashboard mode changes

            this.hideInsights(dispatch);
        });

        /**
         * If layout was changed in edit mode -> perform hideInsight function
         */
        handler.addEventHandler(DASHBOARD_EVENT_SAVED, (event: DashboardSaved, dispatch) => {
            const payload = event.payload;
            this.dashboardLayoutSections = payload?.dashboard?.layout?.sections ?? [];

            this.hideInsights(dispatch);
        });

        customize.insightWidgets().withCustomDecorator((next) => {
            return (insight, widget) => {
                const Decorated = next(insight, widget);

                // find group in which the insight is
                const groupKey = Object.keys(this.groupsConfig)?.find((groupKey) =>
                    this.groupsConfig[groupKey].includes(insight.insight.identifier),
                );

                return (props: JSX.IntrinsicAttributes & IDashboardInsightProps) => {
                    const isEditMode = useDashboardSelector(selectIsInEditMode);

                    if (groupKey === undefined || isEditMode) {
                        return <Decorated {...props} />;
                    } else {
                        const currentGroup = this.groupsConfig[groupKey];
                        const [activeInsightId, setActiveInsightId] = useState(currentGroup?.[0]);

                        const activeInsight = this.groupInsights.find(
                            (insight) => insight.insight.identifier === activeInsightId,
                        );

                        if (activeInsight === undefined) {
                            return <Decorated {...props} />;
                        } else {
                            return (
                                <>
                                    <GroupedWidgetHeader
                                        selectedIdentifier={activeInsight.insight.identifier}
                                        groupInsightsIdentifiers={this.groupsConfig[groupKey]}
                                        widgetTitles={this.widgetTitles}
                                        onGroupInsightSelected={(identifier) => {
                                            setActiveInsightId(identifier);
                                        }}
                                        widget={widget}
                                    />
                                    <Decorated {...props} insight={activeInsight} />
                                </>
                            );
                        }
                    }
                };
            };
        });
    }

    public hideInsights(dispatch: Dispatch<any>) {
        /**
         * Filter out non-insight widgets,
         * since insight_groups plugin working only with "insight" type of widgets at the moment.
         */
        const filteredSectionsWidgets = filterInsightWidgets(this.dashboardLayoutSections);

        /**
         * Take all insight ids which is not first one
         * in the group.
         */
        const insightIdsToHide = Object.values(this.groupsConfig).flatMap((group) => group.slice(1));

        /**
         * Collect all insight uris or identifiers (if possible) to
         * match them between the layout section items.
         * It's an extra step due to the possible absence of identifier
         * in the layout section widget object (different backend types).
         */
        const insightUrisOrIdentifiersToHide = getInsightIdentifiers(insightIdsToHide, this.groupInsights);

        /**
         * Match insight uris with widget insight uris or insight identifiers
         * from each section of dashboard
         * to collect a list of widgets that should be not visible.
         */
        const widgetsToHide = getWidgetsToHide(filteredSectionsWidgets, insightUrisOrIdentifiersToHide);

        /**
         * Perform the hide a.k.a. remove widgets from the layout.
         */
        widgetsToHide.forEach((w) => {
            dispatch(removeSectionItemByWidgetRef(w.widget.ref, w.widget.identifier));
        });

        /**
         * In order to collect widget titles, which will be used in insight groups to indicate
         * current and available insights to select from, we have to perform this extra check
         * to match section widget insights (which do not contain titles) with "global" insights (which contains titles)
         * since there might be used different types of backend, like tiger or bear.
         * With bear backend there is no "identifier" in the section widget insight object,
         * hence "uri" is used to match the insights.
         */
        const sectionsWidgetTitlesByUriOrId = filteredSectionsWidgets?.reduce<Record<string, string>>(
            (acc, widget) => {
                const ref = widget?.widget?.insight;

                if (ref) {
                    acc[isIdentifierRef(ref) ? ref.identifier : ref.uri] = widget?.widget?.title ?? "";
                }

                return acc;
            },
            {},
        );

        /**
         * Collect all widget titles of the current dashboard,
         * to correctly display under GroupedWidgetHeader.
         */
        this.widgetTitles = this.groupInsights.reduce<IWidgetTitles>((acc, ins) => {
            const match = isIdentifierRef(ins.insight.ref) ? ins.insight.identifier : ins.insight.uri;

            if (sectionsWidgetTitlesByUriOrId[match]) {
                acc[ins.insight.identifier] = sectionsWidgetTitlesByUriOrId[match];
            }

            return acc;
        }, {});
    }
}

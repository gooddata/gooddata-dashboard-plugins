// (C) 2024 GoodData Corporation

import { IInsightWidget, isUriRef } from "@gooddata/sdk-model";

import { NonNullableIDashboardLayoutItem } from "../interface.js";

/**
 * Get widgets to hide from insight identifiers
 * @param widgets
 * @param insightIds
 */
export const getWidgetsToHide = (
    widgets: NonNullableIDashboardLayoutItem<IInsightWidget>[],
    insightIds: string[],
) => {
    return widgets.filter((item) => {
        const widgetInsightRef = isUriRef(item.widget.insight)
            ? item.widget?.insight.uri
            : item.widget?.insight.identifier;

        return insightIds.includes(widgetInsightRef);
    });
};

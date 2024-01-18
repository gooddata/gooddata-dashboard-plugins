// (C) 2024 GoodData Corporation

import {
    IDashboardLayoutSection,
    IDashboardWidget,
    IInsightWidget,
    isInsightWidget,
} from "@gooddata/sdk-model";

import { NonNullableIDashboardLayoutItem } from "../interface.js";

/**
 * Filter insight widgets from layout sections
 * @param layoutSections
 */
export const filterInsightWidgets = (layoutSections: IDashboardLayoutSection<IDashboardWidget>[]) => {
    return layoutSections.flatMap((section) => {
        return section.items.filter((item) => {
            return item?.widget && isInsightWidget(item.widget);
        });
    }) as NonNullableIDashboardLayoutItem<IInsightWidget>[];
};

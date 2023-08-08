// (C) 2023 GoodData Corporation

import { IDashboardDescription } from "./interface";

export const DESCRIPTION_WIDGET_TYPE = "kdDescription";

export const descriptionDefaults: Required<
    Omit<IDashboardDescription, "description" | "metrics" | "dateDataSet" | "sectionTitle">
> = {
    sectionIndex: 0,
    grid: { width: 12, height: 1 },
    wrap: true,
};

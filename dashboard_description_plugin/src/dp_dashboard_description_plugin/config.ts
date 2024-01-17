// (C) 2023-2024 GoodData Corporation

import JSON5 from "json5";

import { DescriptionPluginParameters, IDashboardDescription, PluginMessages } from "./interface.js";

export const DESCRIPTION_WIDGET_TYPE = "kdDescription";

export const descriptionDefaults: Required<
    Omit<
        IDashboardDescription,
        "description" | "metrics" | "dateDataSet" | "sectionTitle" | "attributes" | "textAlign"
    >
> = {
    sectionIndex: 0,
    grid: { width: 12, height: 1 },
    wrap: false,
};

export const DEFAULT_NO_DATA_PLACEHOLDER = "N/A";
export const ERROR_PLACEHOLDER = "??";

export const defaultMessages: PluginMessages = {
    noData: "No Data",
    tooManyDataPoints: "Too many data points, filter down to a single element.",
};

/**
 * Parameters for local testing used in:
 * @link{PluginLoader}
 */
const params: DescriptionPluginParameters = {
    url: "./texts.json",
    texts: { liveMetrics: 0, imageAndLink: 2, loremIpsum: 3 },
};

export const localParams = JSON5.stringify(params);

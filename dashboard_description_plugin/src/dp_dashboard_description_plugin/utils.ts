// (C) 2023-2024 GoodData Corporation

import invariant from "ts-invariant";
import { idRef, isIdentifierRef } from "@gooddata/sdk-model";

import {
    DashboardDescriptions,
    DescriptionPluginParameters,
    IDashboardDescription,
    PluginMessages,
} from "./interface.js";

export function validateParameters(params: unknown): asserts params is DescriptionPluginParameters {
    invariant(typeof params === "object", `"Invalid type of plugin parameters: ${typeof params}`);

    invariant(!!(params as DescriptionPluginParameters)?.url, "URL of JSON file with texts must be defined.");
}

export const getVisibleDescriptionIds = (
    texts: DescriptionPluginParameters["texts"],
    allDescriptionIds: string[],
) => (texts ? Object.keys(texts).filter((textId) => allDescriptionIds.includes(textId)) : allDescriptionIds);

export const validateDescriptions = (descriptionIds: string[], descriptions: DashboardDescriptions) => {
    descriptionIds.forEach((descId) => {
        const description = descriptions[descId].description;
        invariant(
            Array.isArray(description) ? description.length : description,
            `Description text is mandatory, but missing for item "${descId}"`,
        );
    });
};

export const isMessagesConfig = (messages: object = {}): messages is PluginMessages =>
    "noData" in messages || "tooManyDataPoints" in messages;

export const getDateDataSet = (dateDataSet: IDashboardDescription["dateDataSet"]) =>
    isIdentifierRef(dateDataSet)
        ? idRef(dateDataSet.identifier, "dataSet") // the dataSet type is needed in Tiger/Panther
        : dateDataSet;

export class TooManyDataPointsError extends Error {
    public name = "TooManyDataPointsError";
}

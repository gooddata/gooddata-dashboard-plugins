// (C) 2023-2024 GoodData Corporation

import invariant from "ts-invariant";

import { PluginParams } from "./interface.js";

export function validateParameters(params: unknown): asserts params is PluginParams {
    invariant(typeof params === "object", `"Invalid type of plugin parameters: ${typeof params}`);

    invariant(
        (params as PluginParams)?.text || (params as PluginParams)?.logoUrl,
        "At least one of 'text' or 'logoUrl' properties has to be defined in plugin parameters.",
    );
}

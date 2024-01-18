// (C) 2024 GoodData Corporation

import { PluginParams } from "../interface.js";
import invariant from "ts-invariant";

/**
 * Validates plugin parameters
 * @param params
 */
export function validateParameters(params: unknown): asserts params is PluginParams {
    invariant(typeof params === "object", `"Invalid type of plugin parameters: ${typeof params}`);

    invariant(
        params && !Object.keys(params).some((key) => !Array.isArray(params[key as keyof typeof params])),
        `Invalid type of group configuration:", ${params}`,
    );
}

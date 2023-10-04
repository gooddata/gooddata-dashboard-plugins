// (C) 2023 GoodData Corporation
import invariant from "ts-invariant";

import { PluginParams } from "./interface.js";

export function validateParameters(params: unknown): asserts params is PluginParams {
    invariant(typeof params === "object", `"Invalid type of plugin parameters: ${typeof params}`);

    invariant(
        params && !Object.keys(params).some((key) => !Array.isArray(params[key as keyof typeof params])),
        `Invalid type of group configuration:", ${params}`,
    );
}

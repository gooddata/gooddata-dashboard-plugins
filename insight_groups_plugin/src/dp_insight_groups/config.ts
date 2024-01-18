// (C) 2023-2024 GoodData Corporation
import JSON5 from "json5";

import { PluginParams } from "./interface.js";

/**
 * Insight groups declarations
 * key - group name, can be anything, it is not shown anywhere
 * value - array of insight identifiers
 */
const params: PluginParams = {
    groupName1: ["insightIdentifier1", "insightIdentifier2"],
    groupName2: ["insightIdentifier3", "insightIdentifier4", "insightIdentifier5"],
};

export const localParams = JSON5.stringify(params);

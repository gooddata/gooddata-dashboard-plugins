// (C) 2023 GoodData Corporation

import JSON5 from "json5";

import { PluginParams } from "./interface.js";

/**
 * Parameters for local testing used in:
 * @link{PluginLoader}
 */

const NBSP = "\xA0";

const params: PluginParams = {
    text: `Powered by${NBSP}`,
    logoAltText: "GoodData",
    logoUrl: "https://www.gooddata.com/img/generic/logo-gd-b.svg",
};

export const localParams = JSON5.stringify(params);

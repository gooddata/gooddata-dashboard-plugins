// (C) 2023 GoodData Corporation
import JSON5 from "json5";

import { PluginParams } from "./interface.js";

const params: PluginParams = {
    group1: [
        "f8c40907-46e9-407f-a8bf-cf98166a3799",
        "de63d719-876a-4036-bcc2-9ef01269a0d8",
        "b3fa5743-a237-4806-912c-442beddf281f",
    ],
};

export const localParams = JSON5.stringify(params);

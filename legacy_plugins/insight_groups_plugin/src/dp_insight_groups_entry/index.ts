// (C) 2021-2023 GoodData Corporation
import type { DashboardPluginDescriptor } from "@gooddata/sdk-ui-dashboard";

import metadataJson from "../metadata.json";
import packageJson from "../../package.json";
import { ensureSemverPrefix } from '../utils/index.js';

type PluginEntryPoint = DashboardPluginDescriptor & {
    /**
     * Key to the module federation container where to find the engine bundle entry point.
     */
    engineKey: string;
    /**
     * Key to the module federation container where to find the plugin bundle entry point.
     */
    pluginKey: string;
};

const entryPoint: PluginEntryPoint = {
    author: packageJson.author,
    displayName: packageJson.name,
    version: packageJson.version,
    minEngineVersion: "bundled",
    maxEngineVersion: "bundled",
    compatibility: ensureSemverPrefix(packageJson.peerDependencies['@gooddata/sdk-ui-dashboard']),
    // These two must fit the values in the webpack config. Do not edit them unless you know what you are doing
    engineKey: `./${metadataJson.MODULE_FEDERATION_NAME}_ENGINE`,
    pluginKey: `./${metadataJson.MODULE_FEDERATION_NAME}_PLUGIN`,
};

export default entryPoint;

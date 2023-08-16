// (C) 2021-2023 GoodData Corporation

import metadataJson from "../metadata.json";
import packageJson from "../../package.json";

const entryPoint = {
    author: packageJson.author,
    displayName: packageJson.name,
    version: packageJson.version,
    minEngineVersion: "bundled",
    maxEngineVersion: "bundled",
    // These two must fit the values in the webpack config. Do not edit them unless you know what you are doing
    engineKey: `./${metadataJson.MODULE_FEDERATION_NAME}_ENGINE`,
    pluginKey: `./${metadataJson.MODULE_FEDERATION_NAME}_PLUGIN`,
};

export default entryPoint;

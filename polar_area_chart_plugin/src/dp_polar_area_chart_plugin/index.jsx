// (C) 2021 GoodData Corporation

import { Plugin } from "./Plugin";

/**
 * Wraps the plugin and reexports it as a default export. This makes its subsequent loading easier.
 * Do not change this file.
 */
const PluginFactory = () => {
    return new Plugin();
};

export default PluginFactory;

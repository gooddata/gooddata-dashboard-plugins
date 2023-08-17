// (C) 2021-2023 GoodData Corporation
import { DashboardContext, DashboardPluginV1, IDashboardCustomizer } from "@gooddata/sdk-ui-dashboard";
import { PluginAttributeFilter } from "./components/PluginAttributeFilter";

import entryPoint from "../dp_single_select_plugin_entry";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    public register(_ctx: DashboardContext, customize: IDashboardCustomizer): void {
        customize
            .filters()
            .attribute()
            .withCustomProvider(() => {
                return PluginAttributeFilter;
            });
    }
}

// (C) 2021 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
} from "@gooddata/sdk-ui-dashboard";

import entryPoint from "../dp_replace_by_tag_plugin_entry";
import { GaugeAdapter } from "./Gauge";
import { insightTags, insightVisualizationUrl } from "@gooddata/sdk-model";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    public tags: string[] = [];

    public onPluginLoaded(
        _ctx: DashboardContext,
        parameters?: string
    ): Promise<void> | void {
        
        this.tags = parameters?.split(" ") || ["gauge"];
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        _handlers: IDashboardEventHandling
    ): void {
        customize.insightWidgets().withCustomProvider((insight) => {
            if (
                insightTags(insight).some(insightTag => this.tags.includes(insightTag)) &&
                insightVisualizationUrl(insight).includes("bullet")
            ) {
                return GaugeAdapter;
            }

            return undefined;
        });
    }
}

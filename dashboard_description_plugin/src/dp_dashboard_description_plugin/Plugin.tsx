// (C) 2021-2022 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    newCustomWidget,
    newDashboardItem,
    newDashboardSection,
} from "@gooddata/sdk-ui-dashboard";
import JSON5 from "json5";

import entryPoint from "../dp_dashboard_description_plugin_entry";

import { KdDescription } from "./component/KdDescription";
import invariant from "ts-invariant";
import {
    DescriptionPluginParameters,
    DescriptionWidgetExtras,
    IDashboardDescriptions,
    TextsWithPositions,
} from "./component/interface";
import { DESCRIPTION_WIDGET_TYPE, descriptionDefaults } from "./component/config";

/**
 * Parameters for local testing used in:
 * @link{PluginLoader}
 */

export const localParams = `{
         url: "./texts.json",
         texts: {  liveMetrics: 0, imageAndLink: 2, loremIpsum: 3 },
     }`;

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    private descriptions: IDashboardDescriptions = {};
    private allDescriptionIds: string[] = [];
    private visibleDescriptionIds: string[] = [];
    private customTextPositions: TextsWithPositions | undefined;

    async onPluginLoaded(_context: DashboardContext, parameters: string) {
        let parametersParsed: DescriptionPluginParameters;

        try {
            parametersParsed = JSON5.parse(parameters);

            invariant(
                typeof parametersParsed === "object",
                `"Invalid type of plugin parameter: ${typeof parametersParsed}`,
            );

            invariant(!!parametersParsed.url, "URL of JSON file with texts must be defined.");
        } catch (e) {
            console.error("### Parsing parameters failed", e.message);
            console.error("### Parameters", parameters);

            return;
        }

        const request = await fetch(parametersParsed.url, { cache: "no-cache" });
        this.descriptions = await request.json();
        this.allDescriptionIds = Object.keys(this.descriptions);

        this.customTextPositions = parametersParsed.texts;

        this.visibleDescriptionIds = parametersParsed.texts
            ? // filter valid IDs from params, or take all descriptions if no IDs in params
              Object.keys(parametersParsed.texts).filter((textId) => this.allDescriptionIds.includes(textId))
            : this.allDescriptionIds;

        // validate all description items have description text
        this.allDescriptionIds.forEach((descId) => {
            invariant(
                this.descriptions[descId].description,
                `Description text is a mandatory, but missing for item "${descId}"`,
            );
        });
    }

    public register(_ctx: DashboardContext, customize: IDashboardCustomizer): void {
        customize.customWidgets().addCustomWidget(DESCRIPTION_WIDGET_TYPE, KdDescription);

        this.visibleDescriptionIds.forEach((descId) => {
            const {
                sectionIndex,
                sectionTitle,
                description,
                metrics,
                dateDataSet,
                grid = {},
                wrap = descriptionDefaults.wrap,
            } = this.descriptions[descId];

            // check if custom index provided in params, then look in text definition or use the default index of 0.
            const descriptionSectionIndex =
                this.customTextPositions?.[descId] ?? sectionIndex ?? descriptionDefaults.sectionIndex;

            customize.layout().customizeFluidLayout((_layout, customizer) => {
                customizer.addSection(
                    descriptionSectionIndex,
                    newDashboardSection(
                        sectionTitle,
                        newDashboardItem(
                            newCustomWidget<DescriptionWidgetExtras>(descId, DESCRIPTION_WIDGET_TYPE, {
                                description,
                                metrics,
                                dateDataSet,
                                wrap,
                            }),
                            {
                                xl: {
                                    gridWidth: grid.width ?? descriptionDefaults.grid.width!,
                                    gridHeight: grid.height ?? descriptionDefaults.grid.height,
                                },
                            },
                        ),
                    ),
                );
            });
        });
    }
}

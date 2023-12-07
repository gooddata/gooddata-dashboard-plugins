// (C) 2021-2023 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    newCustomWidget,
    newDashboardItem,
    newDashboardSection,
} from "@gooddata/sdk-ui-dashboard";
import { IDashboardLayoutSize } from "@gooddata/sdk-model";
import JSON5 from "json5";

import entryPoint from "../dp_dashboard_description_plugin_entry/index.js";

import { KdDescription } from "./components/KdDescription.js";
import {
    DashboardDescriptions,
    DescriptionPluginParameters,
    DescriptionWidgetExtras,
    PluginMessages,
    TextsWithPositions,
} from "./interface.js";
import { defaultMessages, DESCRIPTION_WIDGET_TYPE, descriptionDefaults } from "./config.js";
import {
    getDateDataSet,
    getVisibleDescriptionIds,
    isMessagesConfig,
    validateDescriptions,
    validateParameters,
} from "./utils.js";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;

    private descriptions: DashboardDescriptions = {};
    private allDescriptionIds: string[] = [];
    private visibleDescriptionIds: string[] = [];
    private customTextPositions: TextsWithPositions | undefined;
    private messages: PluginMessages = defaultMessages;

    async onPluginLoaded(_context: DashboardContext, parameters: string) {
        let parametersParsed: DescriptionPluginParameters;

        try {
            parametersParsed = JSON5.parse(parameters);
            validateParameters(parametersParsed);
        } catch (e) {
            console.error("### Parsing parameters failed", (e as Error).message);
            console.error("### Parameters", parameters);

            return;
        }

        const { texts, url, messages } = parametersParsed;

        const request = await fetch(url, { cache: "no-cache" });
        this.descriptions = await request.json();
        this.allDescriptionIds = Object.keys(this.descriptions);

        this.customTextPositions = texts;

        // filter valid IDs from params, or take all descriptions if no IDs in params
        this.visibleDescriptionIds = getVisibleDescriptionIds(texts, this.allDescriptionIds);

        // validate all description items have description text
        validateDescriptions(this.allDescriptionIds, this.descriptions);

        this.messages = isMessagesConfig(messages) ? { ...this.messages, ...messages } : this.messages;
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
                textAlign,
                attributes,
            } = this.descriptions[descId];

            // check if custom index provided in params, then look in text definition or use the default index of 0.
            const descriptionSectionIndex =
                this.customTextPositions?.[descId] ?? sectionIndex ?? descriptionDefaults.sectionIndex;

            const commonWidgetExtras = {
                metrics,
                dateDataSet: getDateDataSet(dateDataSet),
                wrap,
                textAlign,
                messages: this.messages,
            };

            const widgetLayout: IDashboardLayoutSize = {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                gridWidth: grid.width ?? descriptionDefaults.grid.width!,
                gridHeight: grid.height ?? descriptionDefaults.grid.height,
            };

            customize.layout().customizeFluidLayout((_layout, customizer) => {
                const widgets = Array.isArray(description)
                    ? description.map((item, index) =>
                          newDashboardItem(
                              newCustomWidget<DescriptionWidgetExtras>(
                                  `${descId}${index}`,
                                  DESCRIPTION_WIDGET_TYPE,
                                  {
                                      ...commonWidgetExtras,
                                      description: item,
                                      attributes: Array.isArray(attributes) ? attributes[index] : attributes,
                                  },
                              ),
                              { xl: widgetLayout },
                          ),
                      )
                    : [
                          newDashboardItem(
                              newCustomWidget<DescriptionWidgetExtras>(descId, DESCRIPTION_WIDGET_TYPE, {
                                  ...commonWidgetExtras,
                                  description,
                                  attributes: Array.isArray(attributes) ? attributes[0] : attributes,
                              }),
                              { xl: widgetLayout },
                          ),
                      ];

                customizer.addSection(descriptionSectionIndex, newDashboardSection(sectionTitle, ...widgets));
            });
        });
    }
}

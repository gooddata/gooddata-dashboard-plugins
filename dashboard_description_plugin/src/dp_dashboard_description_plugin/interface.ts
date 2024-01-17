// (C) 2023-2024 GoodData Corporation

import { Identifier, ObjRef } from "@gooddata/sdk-model";
import { ICustomWidget } from "@gooddata/sdk-ui-dashboard";
import { CSSProperties } from "react";

export enum PlaceholderPrefix {
    Attribute = "attribute:",
    Metric = "metric:",
}

type TextId = string;
type InsightId = Identifier;
type SectionIndex = number;
export type ValuePlaceholderInDescription = `${PlaceholderPrefix}${string}`;

export type TextsWithPositions = Record<TextId, SectionIndex>;
export type PluginMessages = { noData: string; tooManyDataPoints: string };

export interface DescriptionPluginParameters {
    url: string;
    texts?: TextsWithPositions; // optional for case to show only certain texts
    messages?: Partial<PluginMessages>;
}

export type ValueWrapper = [before: string, after: string];
export type ValueConfig = ObjRef & {
    wrapper?: ValueWrapper;
    noDataPlaceholder?: string;
    messages?: PluginMessages;
};
type ValuesMap = Record<ValuePlaceholderInDescription, ValueConfig>;

export type AttributeConfig = ValueConfig & {
    link?: boolean;
    email?: boolean;
};
export type AttributesMap = Record<string, AttributeConfig>;
export type AttributesMapByInsight = Record<InsightId, AttributesMap>;

export interface IDashboardDescription {
    description: string | string[];
    sectionIndex?: SectionIndex;
    sectionTitle?: string;
    metrics?: ValuesMap;
    attributes?: AttributesMapByInsight | AttributesMapByInsight[];
    dateDataSet?: ICustomWidget["dateDataSet"];
    grid?: { width?: number; height?: number };
    wrap?: boolean; // default false
    textAlign?: CSSProperties["textAlign"]; // default left
}

export type DashboardDescriptions = Record<TextId, IDashboardDescription>;

export type DescriptionWidgetExtras = Pick<IDashboardDescription, "metrics" | "wrap" | "textAlign"> & {
    description: string;
    messages: PluginMessages;
    attributes?: AttributesMapByInsight;
};

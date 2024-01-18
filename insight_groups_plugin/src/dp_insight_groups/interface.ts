// (C) 2024 GoodData Corporation
import { IDashboardLayoutItem, IInsightWidget } from "@gooddata/sdk-model";

export interface IGroupsConfig {
    [groupKey: string]: string[];
}

export interface IWidgetTitles {
    [insightIdentifier: string]: string;
}

export type NonNullableIDashboardLayoutItem<T> = Omit<IDashboardLayoutItem<T>, "widget"> & {
    widget: IInsightWidget;
};

export type PluginParams = IGroupsConfig;

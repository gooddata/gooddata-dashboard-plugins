// (C) 2023 GoodData Corporation
export interface IGroupsConfig {
    [groupKey: string]: string[];
}

export interface IGroupsSelection {
    [groupKey: string]: string;
}

export interface IGroupsHidingHooks {
    [insightIdentifier: string]: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IWidgetTitles {
    [insightIdentifier: string]: string;
}

export type PluginParams = IGroupsConfig;

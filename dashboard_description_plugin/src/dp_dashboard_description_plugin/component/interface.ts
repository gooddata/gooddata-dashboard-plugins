import { ObjRef } from "@gooddata/sdk-model";
import { ICustomWidget } from "@gooddata/sdk-ui-dashboard";

type TextId = string;
type SectionIndex = number;

export type TextsWithPositions = Record<TextId, SectionIndex>;

export interface DescriptionPluginParameters {
    url: string;
    texts?: TextsWithPositions; // optional for case to show only certain texts
}

type GdcObjectRefs = Record<string, ObjRef>;

export interface IDashboardDescription {
    description: string;
    sectionIndex?: SectionIndex;
    sectionTitle?: string;
    metrics?: GdcObjectRefs;
    dateDataSet?: ICustomWidget["dateDataSet"];
    grid?: { width?: number; height?: number };
    wrap?: boolean;
}

export type IDashboardDescriptions = Record<TextId, IDashboardDescription>;

export type DescriptionWidgetExtras = Pick<IDashboardDescription, "description" | "metrics" | "wrap">;

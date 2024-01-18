// (C) 2024 GoodData Corporation

import { describe, expect, it } from "vitest";
import { IInsightWidget } from "@gooddata/sdk-model";

import { NonNullableIDashboardLayoutItem } from "../interface.js";

import { getWidgetsToHide } from "./getWidgetsToHide.js";

describe("getWidgetsToHide", () => {
    const widgets = [
        {
            widget: {
                type: "insight",
                ref: { uri: "" },
                insight: {
                    uri: "test1",
                },
            },
        },
        {
            widget: {
                type: "insight",
                ref: { identifier: "" },
                insight: {
                    identifier: "test2",
                },
            },
        },
        {
            widget: {
                type: "kpi",
                ref: { uri: "" },
                insight: {
                    uri: "test3",
                },
            },
        },
    ] as NonNullableIDashboardLayoutItem<IInsightWidget>[];

    it("should filter out non-insight type of widgets", () => {
        expect(getWidgetsToHide(widgets, ["test1", "test2", "test3"])).toHaveLength(2);
    });

    it("should return widgets that matches the given insight ids", () => {
        expect(getWidgetsToHide(widgets, ["test2"])).toEqual([
            {
                type: "insight",
                ref: { identifier: "" },
                insight: {
                    identifier: "test2",
                },
            },
        ]);
    });
});

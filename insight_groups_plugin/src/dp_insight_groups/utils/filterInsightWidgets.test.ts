// (C) 2024 GoodData Corporation

import { describe, it, expect } from "vitest";
import { IDashboardLayoutSection, IDashboardWidget } from "@gooddata/sdk-model";

import { filterInsightWidgets } from "./filterInsightWidgets.js";

describe("filterInsightWidgets", () => {
    const section = [
        {
            items: [
                {
                    widget: {
                        type: "insight",
                        ref: { uri: "" },
                        insight: {
                            uri: "",
                        },
                    },
                },
                {
                    widget: {
                        type: "kpi",
                        ref: { uri: "" },
                    },
                },
                {},
            ],
        },
    ] as IDashboardLayoutSection<IDashboardWidget>[];

    it("should return only insight widgets", () => {
        expect(filterInsightWidgets(section)).toHaveLength(1);
    });
});

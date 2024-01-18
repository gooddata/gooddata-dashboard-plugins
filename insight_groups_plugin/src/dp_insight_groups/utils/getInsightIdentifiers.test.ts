// (C) 2024 GoodData Corporation

import { describe, expect, it } from "vitest";
import { IInsight } from "@gooddata/sdk-model";

import { getInsightIdentifiers } from "./getInsightIdentifiers.js";

describe("getInsightIdentifiers", () => {
    const insights = [
        {
            insight: {
                identifier: "insight1",
                ref: {
                    identifier: "identifier1",
                },
            },
        },
        {
            insight: {
                identifier: "insight2",
                ref: {
                    uri: "insight2_uri",
                },
                uri: "insight2_uri",
            },
        },
        {
            insight: {
                identifier: "insight3",
                ref: {
                    uri: "insight3_uri",
                },
                uri: "insight3_uri",
            },
        },
    ] as IInsight[];

    it("should filter out insights that are not matched with array of searching items", () => {
        expect(getInsightIdentifiers(["insight1", "insight2"], insights)).toHaveLength(2);
    });

    it("should return insight identifiers or uri depending on type of insight's ref", () => {
        expect(getInsightIdentifiers(["insight1", "insight2", "insight3"], insights)).toEqual([
            "insight1",
            "insight2_uri",
            "insight3_uri",
        ]);
    });
});

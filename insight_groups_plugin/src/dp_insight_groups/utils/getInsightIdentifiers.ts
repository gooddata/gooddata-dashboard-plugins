// (C) 2024 GoodData Corporation

import { IInsight, isIdentifierRef } from "@gooddata/sdk-model";

/**
 * Get specific insight identifiers from insight objects
 * @param toFind
 * @param insights
 */
export const getInsightIdentifiers = (toFind: string[], insights: IInsight[]) => {
    return insights
        .filter((i) => toFind.includes(i.insight.identifier))
        .map((i) => (isIdentifierRef(i.insight.ref) ? i.insight.identifier : i.insight.uri));
};

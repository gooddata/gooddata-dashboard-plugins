// (C) 2023 GoodData Corporation

import { useEffect, useMemo, useState } from "react";
import { IdentifierRef, idRef } from "@gooddata/sdk-model";
import { ICustomWidget, useWidgetFilters } from "@gooddata/sdk-ui-dashboard";
import { IDataSlice, UseCancelablePromiseStatus, useInsightDataView } from "@gooddata/sdk-ui";

import { AttributesMap, AttributesMapByInsight } from "../interface.js";
import { TooManyDataPointsError } from "../utils.js";

type UseAttributesConfig = {
    attributes: AttributesMapByInsight | undefined;
    widget: ICustomWidget;
};
type UseAttributes = (config: UseAttributesConfig) => {
    attributesSlice: IDataSlice | null;
    attributesError: Error | null;
    attributesStatus: UseCancelablePromiseStatus;
    attributesInsightId?: IdentifierRef;
    attributeConfigs?: AttributesMap;
};

/**
 * Extracts attributes from an insight.
 */
export const useAttributes: UseAttributes = ({ attributes, widget }) => {
    const { attributesInsightId, attributeConfigs } = useMemo(() => {
        if (!attributes) {
            return {};
        }
        const [insightId] = Object.keys(attributes);
        const [attributeConfigs] = Object.values(attributes);

        return { attributesInsightId: idRef(insightId), attributeConfigs };
    }, [attributes]);

    const { result: filters } = useWidgetFilters(widget);

    const {
        result: attributesResult,
        status: attributesStatus,
        error: attributesInsightError,
    } = useInsightDataView(
        {
            insight: attributesInsightId,
            filters,
        },
        [attributesInsightId, filters],
    );

    const [attributesSlice, setAttributesSlice] =
        useState<ReturnType<UseAttributes>["attributesSlice"]>(null);
    const [attributesError, setAttributesError] =
        useState<ReturnType<UseAttributes>["attributesError"]>(null);

    useEffect(() => {
        if (attributesInsightError) {
            setAttributesError(attributesInsightError);
            return;
        }
        if (attributesResult) {
            const slices = attributesResult.data().slices().toArray();

            if (slices.length === 1) {
                setAttributesSlice(slices[0]);
                setAttributesError(null);
            } else if (slices.length > 1) {
                setAttributesError(new TooManyDataPointsError());
            }
        }
    }, [attributesInsightError, attributesResult]);

    return { attributesInsightId, attributesSlice, attributesError, attributesStatus, attributeConfigs };
};

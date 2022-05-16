// (C) 2022 GoodData Corporation
import { DataValue } from "@gooddata/sdk-backend-spi";
import { DataViewFacade } from "@gooddata/sdk-ui";
import {
    bucketMeasure,
    IInsight,
    IMeasure,
    insightBucket,
    insightVisualizationUrl,
} from "@gooddata/sdk-model";

function dataValueAsFloat(value: DataValue): number {
    if (value === null) {
        return NaN;
    }

    return typeof value === "string" ? parseFloat(value) : value;
}

function firstMeasureInBucket(insight: IInsight, bucketId: string): IMeasure | undefined {
    const bucket = insightBucket(insight, bucketId);
    if (!bucket) {
        return undefined;
    }

    return bucketMeasure(bucket);
}

/**
 * Validates if the given insight is suitable for being used as a source for the gauge visualization.
 *
 * @param insight - the insight to validate
 * @returns true if the insight can be used to drive the gauge visualization
 */
export function isUsableForGauge(insight: IInsight): boolean {
    const isBulletChart = insightVisualizationUrl(insight).includes("bullet");

    const primaryMeasure = firstMeasureInBucket(insight, "measures");
    const secondaryMeasure = firstMeasureInBucket(insight, "secondary_measures");

    return isBulletChart && !!primaryMeasure && !!secondaryMeasure;
}

/**
 * Returns the first data point for the first measure in a specified bucket.
 *
 * @param dataViewFacade - the wrapped resulting data
 * @param insight - the insight that was used as the basis of this visualization
 * @param bucketId - the bucket of the insight to look fo the data for
 * @returns numeric result of the given bucket
 */
function getDataForBucket(dataViewFacade: DataViewFacade, insight: IInsight, bucketId: string): number {
    const measure = firstMeasureInBucket(insight, bucketId);
    if (!measure) {
        throw new Error(`The bucket does not contain any measures: ${bucketId}`);
    }

    const dataPoint = dataViewFacade.data().series().firstForMeasure(measure).dataPoints()[0];

    return dataValueAsFloat(dataPoint.rawValue);
}

interface IUseGaugeResult {
    gaugeError: Error | undefined;
    gaugeResult: { value: number; max: number } | undefined;
}

/**
 * Transforms the execution results to data usable by the gauge visualization.
 *
 * @param dataViewFacade - the wrapped resulting data
 * @param insight - the insight that was used as the basis of this visualization
 * @returns the data for the gauge or an error
 */
export const getGaugeValues = (dataViewFacade: DataViewFacade, insight: IInsight): IUseGaugeResult => {
    try {
        return {
            gaugeError: undefined,
            gaugeResult: {
                value: getDataForBucket(dataViewFacade, insight, "measures"),
                max: getDataForBucket(dataViewFacade, insight, "secondary_measures"),
            },
        };
    } catch (err: any) {
        return {
            gaugeError: err,
            gaugeResult: undefined,
        };
    }
};

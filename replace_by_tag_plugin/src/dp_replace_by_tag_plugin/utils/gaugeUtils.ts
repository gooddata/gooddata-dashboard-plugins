// (C) 2022 GoodData Corporation

import {DataValue} from "@gooddata/sdk-backend-spi";
import {DataViewFacade} from "@gooddata/sdk-ui";
import {bucketMeasure, IBucket, IInsight, IMeasure, insightBucket} from "@gooddata/sdk-model";

function parseResult(value: DataValue): number {
    return Number.parseFloat(value?.toString() ?? "0");
}

interface IMeasureBucketsResult {
    valueBucket?: IBucket;
    maxBucket?: IBucket;
}

function getMeasureBuckets( insight: IInsight ):  IMeasureBucketsResult{
    return {
        valueBucket: insightBucket(insight, "measures"),
        maxBucket: insightBucket(insight, "secondary_measures")
    }
}

interface IMeasuresResult {
    valueMeasure?: IMeasure,
    maxMeasure?: IMeasure,
}

function getMeasures(valueBucket: IBucket, maxBucket: IBucket): IMeasuresResult {
    return {
        valueMeasure: bucketMeasure(valueBucket),
        maxMeasure: bucketMeasure(maxBucket),
    }
}

interface IUseGaugeResult {
    gaugeError: Error | undefined;
    result: {
        value: number;
        max: number;
    } | undefined;
}

export const getGaugeValues = (dataViewFacade: DataViewFacade, insight: IInsight): IUseGaugeResult => {

    const {valueBucket, maxBucket} = getMeasureBuckets(insight);

    if(!valueBucket || !maxBucket) {
        return {
            gaugeError: new Error("Buckets for gauge are not available"),
            result: undefined,
        }
    }

    const {valueMeasure, maxMeasure} = getMeasures(valueBucket, maxBucket);

    if(!valueMeasure || !maxMeasure) {
        return {
            gaugeError: new Error("Measures for gauge are not available"),
            result: undefined
        }
    }

    const value = dataViewFacade!
        .data()
        .series()
        .firstForMeasure(valueMeasure)
        .dataPoints()[0];

    const max = dataViewFacade!
        .data()
        .series()
        .firstForMeasure(maxMeasure)
        .dataPoints()[0];

    return {
        result: {
            value: parseResult(value.rawValue),
            max: parseResult(max.rawValue),
        },
        gaugeError: undefined
    }

}

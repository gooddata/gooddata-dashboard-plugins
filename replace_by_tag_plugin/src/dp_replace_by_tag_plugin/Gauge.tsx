// (C) 2022 GoodData Corporation
import { DataValue } from "@gooddata/sdk-backend-spi";
import { bucketMeasure, insightBucket } from "@gooddata/sdk-model";
import { ErrorComponent, LoadingComponent } from "@gooddata/sdk-ui";
import { CustomDashboardInsightComponent } from "@gooddata/sdk-ui-dashboard";
import React from "react";
import { useInsightWidgetDataView } from "./utils/useInsightWidgetDataView";

function parseResult(value: DataValue): number {
    return Number.parseFloat(value?.toString() ?? "0");
}

export const GaugeAdapter: CustomDashboardInsightComponent = (props) => {
    const {
        ErrorComponent: CustomError,
        LoadingComponent: CustomLoading,
        widget,
        insight,
    } = props;

    const GaugeError = CustomError ?? ErrorComponent;
    const GaugeLoading = CustomLoading ?? LoadingComponent;

    const { result, error, status } = useInsightWidgetDataView({
        insightWidget: widget,
    });

    if (status === "loading" || status === "pending") {
        return <GaugeLoading />;
    }

    if (status === "error") {
        return <GaugeError message={error?.message ?? "Unknown error"} />;
    }

    const primaryMeasureBucket = insightBucket(insight, "measures");
    const secondaryMeasureBucket = insightBucket(insight, "secondary_measures");

    if (!primaryMeasureBucket || !secondaryMeasureBucket) {
        return <GaugeError message={"Insight buckets are weird"} />;
    }

    const primaryMeasure = bucketMeasure(primaryMeasureBucket)!;
    const secondaryMeasure = bucketMeasure(secondaryMeasureBucket)!;

    const value = result!
        .data()
        .series()
        .firstForMeasure(primaryMeasure)
        .dataPoints()[0];
    const max = result!
        .data()
        .series()
        .firstForMeasure(secondaryMeasure)
        .dataPoints()[0];

    return (
        <Gauge
            max={parseResult(max.rawValue)}
            value={parseResult(value.rawValue)}
        />
    );
};

export const Gauge: React.FC<{
    max: number;
    value: number;
    format?: "%" | "#";
    showLabels?: boolean;
}> = ({ max, value, format = "#", showLabels = false }) => {
    const percent = value / max;

    return (
        <div
            style={{
                padding: "1rem",
            }}
        >
            <GaugeChart
                animate={false}
                nrOfLevels={20}
                percent={percent}
                textColor="black"
                formatTextValue={(perValue: number) =>
                    format === "#" ? value : `${perValue} %`
                }
            />
            {showLabels && (
                <svg viewBox="0 0 250 25">
                    <text x="15%" y="20">
                        {format === "#" ? "0" : "0%"}
                    </text>
                    <text x="75%" y="20">
                        {format === "#" ? max : "100%"}
                    </text>
                </svg>
            )}
        </div>
    );
};

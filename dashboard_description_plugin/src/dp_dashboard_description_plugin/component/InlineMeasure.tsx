// (C) 2022 GoodData Corporation
import React from "react";
import { ICustomWidget, useCustomWidgetExecutionDataView } from "@gooddata/sdk-ui-dashboard";
import { newMeasure, ObjRef } from "@gooddata/sdk-model";
import { colors2Object, numberFormat } from "@gooddata/numberjs";
import { isNoDataSdkError } from "@gooddata/sdk-ui";

export const InlineMeasure: React.FC<{ metricRef: ObjRef; widget: ICustomWidget }> = ({
    metricRef,
    widget,
}) => {
    const measure = newMeasure(metricRef);
    const { error, result, status } = useCustomWidgetExecutionDataView({
        widget,
        execution: {
            seriesBy: [measure],
        },
    });

    if (status === "loading" || status === "pending") {
        return <span>...</span>;
    }

    if (status === "error") {
        return (
            <span className="error" title={error?.message}>
                {isNoDataSdkError(error) ? "–" : "??"}
            </span>
        );
    }

    const valueDataPoint = result?.data().series().firstForMeasure(measure).dataPoints()[0];

    const format =
        result?.meta().measureDescriptor(measure.measure.localIdentifier)?.measureHeaderItem.format ?? "";
    const { color } = colors2Object(numberFormat(valueDataPoint?.rawValue ?? "", format));

    const formattedValue = valueDataPoint?.formattedValue();

    return <span style={{ color }}>{formattedValue}</span>;
};

// (C) 2022 GoodData Corporation
import React from "react";
import {ICustomWidget, useCustomWidgetExecutionDataView} from "@gooddata/sdk-ui-dashboard";
import {ObjRef, newMeasure} from "@gooddata/sdk-model";

export const InlineMeasure: React.FC<{ metricRef: ObjRef, widget: ICustomWidget }> = ({metricRef, widget}) => {
    const measure = newMeasure(metricRef);
    const {error, result, status} = useCustomWidgetExecutionDataView({
        widget,
        execution: {
            seriesBy: [measure],
        },
    });

    if (status === "loading" || status === "pending") {
        return <span>...</span>;
    }

    if (status === "error") {
        return <span className="error" title={error?.message}>??</span>;
    }

    const formattedValue = result?.data().series().firstForMeasure(measure).dataPoints()[0].formattedValue();

    return <span>{formattedValue}</span>;
};

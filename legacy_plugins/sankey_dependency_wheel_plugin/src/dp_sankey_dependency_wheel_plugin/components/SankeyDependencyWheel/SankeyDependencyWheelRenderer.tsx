// (C) 2023 GoodData Corporation

import React, { useMemo } from "react";
import {
    useInsightWidgetDataView,
    useDashboardSelector,
    selectColorPalette,
} from "@gooddata/sdk-ui-dashboard";
import Highcharts from "highcharts";
import HighchartsSankey from "highcharts/modules/sankey.js";
import HighchartsWheel from "highcharts/modules/dependency-wheel.js";
import { HighchartsReact } from "highcharts-react-official";

HighchartsSankey(Highcharts);
HighchartsWheel(Highcharts);

import { IInsightWidget, isResultAttributeHeader } from "@gooddata/sdk-model";
import { IErrorProps, ILoadingProps } from "@gooddata/sdk-ui";

interface ISankeyDependencyWheelProps {
    widget: IInsightWidget;
    ErrorComponent: React.ComponentType<IErrorProps>;
    LoadingComponent: React.ComponentType<ILoadingProps>;
}

export const SankeyDependencyWheelRenderer: React.FC<ISankeyDependencyWheelProps> = ({
    LoadingComponent,
    ErrorComponent,
    widget,
}) => {
    const colorPalette = useDashboardSelector(selectColorPalette);
    const colors = useMemo(
        () => colorPalette.map((color) => `rgb(${color.fill.r}, ${color.fill.g}, ${color.fill.b})`),
        [colorPalette],
    );

    const { result, error, status } = useInsightWidgetDataView({
        insightWidget: widget,
    });

    if (status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error") {
        return <ErrorComponent message={error?.message ?? "Unknown error"} />;
    }

    const data = result
        .data()
        .series()
        .toArray()[0]
        .dataPoints()
        .map((dataPoint) => {
            const from = dataPoint.sliceDesc?.headers[0];
            const to = dataPoint.sliceDesc?.headers[1];

            return {
                from: isResultAttributeHeader(from) ? from.attributeHeaderItem?.name : null,
                to: isResultAttributeHeader(to) ? to.attributeHeaderItem?.name : null,
                weight: parseFloat(`${dataPoint.rawValue ?? ""}`),
            };
        });

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    chart: {
                        type: "dependencywheel",
                    },
                    title: null,
                    series: [{ data }],
                    colors,
                }}
            />
        </div>
    );
};

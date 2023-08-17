// (C) 2023 GoodData Corporation

import React, { useMemo } from "react";
import {
    useInsightWidgetDataView,
    useDashboardSelector,
    selectColorPalette
} from "@gooddata/sdk-ui-dashboard";
import Highcharts from "highcharts";
import HighchartSankey from "highcharts/modules/sankey";
import HighchartsWheel from "highcharts/modules/dependency-wheel";
import HighchartsReact from "highcharts-react-official";

HighchartSankey(Highcharts);
HighchartsWheel(Highcharts);

import { WIDGET_TITLE_SUFFIX } from "./Plugin";

const SankeyDependencyWheel = (props) => {
    const {
        LoadingComponent,
        ErrorComponent,
        widget,
    } = props;

    const colorPalette = useDashboardSelector(selectColorPalette);
    const colors = useMemo(() => colorPalette.map(color =>
        `rgb(${color.fill.r}, ${color.fill.g}, ${color.fill.b})`), [colorPalette]);

    widget.title = widget.title.replace(WIDGET_TITLE_SUFFIX, '').trim();

    const { result, error, status } = useInsightWidgetDataView({
        insightWidget: widget,
    });

    if (status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error") {
        return <ErrorComponent message={error?.message ?? "Unknown error"} />;
    }

    if (result) {
        const data = result
            .data()
            .series()
            .toArray()[0]
            .dataPoints()
            .map((dataPoint) => ({
                from: dataPoint.sliceDesc.headers[0].attributeHeaderItem.name,
                to: dataPoint.sliceDesc.headers[1].attributeHeaderItem.name,
                weight: parseFloat(dataPoint.rawValue),
            }));

        return (
            <div style={{ height: '100%', width: '100%' }}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                        chart: {
                            type: "dependencywheel",
                        },
                        title: null,
                        series: [{ data }],
                        colors
                    }}
                />
            </div>
        );
    }
};

export default SankeyDependencyWheel;

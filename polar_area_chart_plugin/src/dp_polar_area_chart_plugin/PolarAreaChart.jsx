import React from "react";
import {
    useInsightWidgetDataView,
    useDashboardSelector,
    selectColorPalette
} from "@gooddata/sdk-ui-dashboard";
import "chart.js/auto";
import { PolarArea } from "react-chartjs-2";

import { WIDGET_TITLE_SUFFIX } from "./Plugin";

const PolarAreaChart = (props) => {
    const {
        LoadingComponent,
        ErrorComponent,
        widget,
    } = props;
    const colorPalette = useDashboardSelector(selectColorPalette).map(color =>
        `rgba(${color.fill.r}, ${color.fill.g}, ${color.fill.b}, .5)`);

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
        const results = result
            .data()
            .slices()
            .toArray()
            .map((slice, i) => ({
                name: slice.sliceTitles()[0],
                value: parseFloat(slice.rawData()[0]),
                fill: colorPalette[i % colorPalette.length]
            }));

        const labels = results.reduce((acc, r) => acc.concat(r.name), []);
        const values = results.reduce((acc, r) => acc.concat(r.value), []);
        const colors = results.reduce((acc, r) => acc.concat(r.fill), []);

        const data = {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 1
            }]
        };

        return (
            <div style={{ height: '100%', maxHeight: 334 }}>
                <PolarArea
                    data={data}
                    options={{
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        scales: {
                            r: {
                                pointLabels: {
                                    display: true,
                                    centerPointLabels: true,
                                    font: {
                                        size: 12
                                    }
                                }
                            }
                        }
                    }}
                />
            </div>
        );
    }
};

export default PolarAreaChart;

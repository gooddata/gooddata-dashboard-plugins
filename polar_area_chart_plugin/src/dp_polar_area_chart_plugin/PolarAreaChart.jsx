import React from "react";
import {
    useInsightWidgetDataView,
    useDashboardSelector,
    selectColorPalette
} from "@gooddata/sdk-ui-dashboard";
import "chart.js/auto";
import { PolarArea } from "react-chartjs-2";

import { WIDGET_TITLE_SUFFIX } from "./Plugin";

// const MONTH_NAMES = {
//     '01': 'Jan',
//     '02': 'Feb',
//     '03': 'Mar',
//     '04': 'Apr',
//     '05': 'May',
//     '06': 'Jun',
//     '07': 'Jul',
//     '08': 'Aug',
//     '09': 'Sep',
//     '10': 'Oct',
//     '11': 'Nov',
//     '12': 'Dec'
// };

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

        // Couldn't figure out how to get month names so I hardcoded them 🤷‍♂️
        // https://gooddata.slack.com/archives/C6PDGGNRH/p1682387905940879
        // const labels = results.reduce((acc, r) => acc.concat(MONTH_NAMES[r.name]), []);
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
                                ticks: {
                                    display: false
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

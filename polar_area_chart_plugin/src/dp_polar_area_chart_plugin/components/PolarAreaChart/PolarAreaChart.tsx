// (C) 2024 GoodData Corporation

import React from "react";

import {
    selectColorPalette,
    useDashboardSelector,
    useInsightWidgetDataView,
} from "@gooddata/sdk-ui-dashboard";
import { IInsightWidget } from "@gooddata/sdk-model";
import { IErrorProps, ILoadingProps } from "@gooddata/sdk-ui";

import "chart.js/auto";
import { PolarArea } from "react-chartjs-2";

interface IPolarAreaChartProps {
    widget: IInsightWidget;
    ErrorComponent: React.ComponentType<IErrorProps>;
    LoadingComponent: React.ComponentType<ILoadingProps>;
}

export const PolarAreaChart: React.FC<IPolarAreaChartProps> = ({
    widget,
    LoadingComponent,
    ErrorComponent,
}) => {
    const colorPalette = useDashboardSelector(selectColorPalette).map(
        (color) => `rgba(${color.fill.r}, ${color.fill.g}, ${color.fill.b}, .5)`,
    );

    const { result, error, status } = useInsightWidgetDataView({
        insightWidget: widget,
    });

    if (status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error" || !result) {
        return <ErrorComponent message={error?.message ?? "Unknown error"} />;
    }

    const results = result
        .data()
        .slices()
        .toArray()
        .map((slice, i) => ({
            name: slice.sliceTitles()[0],
            value: parseFloat(`${slice.rawData()[0] ?? ""}`),
            fill: colorPalette[i % colorPalette.length],
        }));

    const labels = results.reduce<string[]>((acc, r) => acc.concat(r.name ?? ""), []);
    const values = results.reduce<number[]>((acc, r) => acc.concat(r.value), []);
    const colors = results.reduce<string[]>((acc, r) => acc.concat(r.fill), []);

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderWidth: 1,
            },
        ],
    };

    return (
        <PolarArea
            data={data}
            options={{
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
                scales: {
                    r: {
                        ticks: {
                            display: false,
                        },
                    },
                },
            }}
        />
    );
};

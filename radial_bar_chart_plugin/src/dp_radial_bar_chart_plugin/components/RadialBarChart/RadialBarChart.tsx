import {
    selectColorPalette,
    useDashboardSelector,
    useInsightWidgetDataView,
} from "@gooddata/sdk-ui-dashboard";
import React, { useMemo } from "react";
import { IInsightWidget } from "@gooddata/sdk-model";
import { IErrorProps, ILoadingProps } from "@gooddata/sdk-ui";
import { Legend, RadialBar, ResponsiveContainer, RadialBarChart as RBC } from "recharts";

interface IRadialBarChartProps {
    widget: IInsightWidget;
    ErrorComponent: React.ComponentType<IErrorProps>;
    LoadingComponent: React.ComponentType<ILoadingProps>;
    wrapperHeight?: number;
}

const wrapperStyle = { fontSize: 12 };

export const RadialBarChart: React.FC<IRadialBarChartProps> = ({
    wrapperHeight,
    widget,
    ErrorComponent,
    LoadingComponent,
}) => {
    const colorPalette = useDashboardSelector(selectColorPalette);

    const colors = useMemo(
        () => colorPalette.map((color) => `rgb(${color.fill.r}, ${color.fill.g}, ${color.fill.b})`),
        [colorPalette],
    );

    const { result, error, status } = useInsightWidgetDataView({
        insightWidget: widget,
    });

    const data = useMemo(
        () =>
            result
                ?.data()
                .slices()
                .toArray()
                .map((slice, i) => ({
                    name: slice.sliceTitles()[0],
                    value: parseFloat(`${slice.rawData()[0] ?? ""}`),
                    fill: colors[i % colors.length],
                })),
        [result, colors],
    );

    if (status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error" || !result) {
        return <ErrorComponent message={error?.message ?? "Unknown error"} />;
    }

    return (
        <ResponsiveContainer width={"100%"} height={wrapperHeight}>
            <RBC innerRadius="10%" outerRadius="100%" barSize={10} data={data}>
                <RadialBar
                    // uncomment the following line to display labels
                    // label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="value"
                />
                <Legend
                    layout="vertical"
                    verticalAlign="top"
                    align="right"
                    iconSize={12}
                    wrapperStyle={wrapperStyle}
                />
            </RBC>
        </ResponsiveContainer>
    );
};

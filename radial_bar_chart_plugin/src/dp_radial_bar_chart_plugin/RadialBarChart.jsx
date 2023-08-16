// (C) 2023 GoodData Corporation

import React, { useMemo } from "react";
import {
    RadialBarChart as RBC,
    RadialBar,
    Legend,
    ResponsiveContainer
} from "recharts";
import {
    useInsightWidgetDataView,
    useDashboardSelector,
    selectColorPalette
} from "@gooddata/sdk-ui-dashboard";

import { WIDGET_TITLE_SUFFIX } from "./Plugin";

const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px'
};

const RadialBarChart = (props) => {
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
            .slices()
            .toArray()
            .map((slice, i) => ({
                name: slice.sliceTitles()[0],
                value: parseFloat(slice.rawData()[0]),
                fill: colors[i % colors.length]
            }));

        return (
            <div style={{ height: '100%', width: '100%' }}>
                <ResponsiveContainer height="99%">
                    <RBC cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" barSize={10} data={data}>
                        <RadialBar
                            minAngle={15}
                            // uncomment the following line to display labels
                            // label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            clockWise
                            dataKey="value"
                        />
                        <Legend
                            iconSize={10}
                            iconType="square"
                            layout="vertical"
                            verticalAlign="middle"
                            wrapperStyle={style}
                        />
                    </RBC>
                </ResponsiveContainer>
            </div>
        );
    }
};

export default RadialBarChart;

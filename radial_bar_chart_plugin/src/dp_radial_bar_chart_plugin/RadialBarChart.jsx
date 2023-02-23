import React from "react";
import { RadialBarChart as RBC, RadialBar, Legend, ResponsiveContainer } from "recharts";
import { useInsightWidgetDataView } from "@gooddata/sdk-ui-dashboard";

import { WIDGET_TITLE_SUFFIX } from "./Plugin";

const indigoColors = ['#14B2E2', '#06C08E', '#E54D42', '#F18600', '#AB56A3', '#F4D522', '#93A1AD', '#6BBFD8', '#B589B1', '#EE8780', '#F1AB54', '#85D1BC'];

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
                fill: indigoColors[i % indigoColors.length]
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

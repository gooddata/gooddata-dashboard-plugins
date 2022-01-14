// (C) 2022 GoodData Corporation
import { ErrorComponent, LoadingComponent } from "@gooddata/sdk-ui";
import { CustomDashboardInsightComponent } from "@gooddata/sdk-ui-dashboard";
import React from "react";
import { useInsightWidgetDataView } from "./utils/useInsightWidgetDataView";
import { getGaugeValues } from "./utils/gaugeUtils";
import GaugeChart from "react-gauge-chart";

export const GaugeAdapter: CustomDashboardInsightComponent = (props) => {
    const {
        ErrorComponent: CustomError,
        LoadingComponent: CustomLoading,
        widget,
        insight,
    } = props;

    const GaugeError = CustomError ?? ErrorComponent;
    const GaugeLoading = CustomLoading ?? LoadingComponent;

    const { result, error, status } = useInsightWidgetDataView({
        insightWidget: widget,
    });

    if (status === "loading" || status === "pending") {
        return <GaugeLoading />;
    }

    if (status === "error") {
        return <GaugeError message={error?.message ?? "Unknown error"} />;
    }

    const { result: gaugeResult, gaugeError } = getGaugeValues(
        result!,
        insight
    );

    if (gaugeError || !gaugeResult) {
        return <GaugeError message={gaugeError?.message || "Unknown error"} />;
    }

    return <Gauge max={gaugeResult.max} value={gaugeResult.value} />;
};

export const Gauge: React.FC<{
    max: number;
    value: number;
    format?: "%" | "#";
    showLabels?: boolean;
}> = ({ max, value, format = "#", showLabels = false }) => {
    const percent = value / max;

    return (
        <div
            style={{
                padding: "1rem",
            }}
        >
            <GaugeChart
                animate={false}
                nrOfLevels={20}
                percent={percent}
                textColor="black"
                formatTextValue={(perValue: number) =>
                    format === "#" ? value : `${perValue} %`
                }
            />
            {showLabels && (
                <svg viewBox="0 0 250 25">
                    <text x="15%" y="20">
                        {format === "#" ? "0" : "0%"}
                    </text>
                    <text x="75%" y="20">
                        {format === "#" ? max : "100%"}
                    </text>
                </svg>
            )}
        </div>
    );
};

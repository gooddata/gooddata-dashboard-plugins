// (C) 2022 GoodData Corporation
import React from "react";
import {
    CustomDashboardInsightComponent,
    selectLocale,
    useDashboardSelector,
    useInsightWidgetDataView,
} from "@gooddata/sdk-ui-dashboard";
import { getGaugeValues } from "../utils/gaugeUtils";
import GaugeChart from "react-gauge-chart";

interface IGaugeParameters {
    showLabels: boolean;
    format?: "%" | "#";
}

export const gaugeFactory = (parameters: IGaugeParameters): CustomDashboardInsightComponent => {
    const GaugeInsight: CustomDashboardInsightComponent = (props) => {
        const { ErrorComponent: GaugeError, LoadingComponent: GaugeLoading, widget, insight } = props;

        // get the current user's locale to format the numbers properly
        const locale = useDashboardSelector(selectLocale);

        // load the data for the insight
        const { result, error, status } = useInsightWidgetDataView({
            insightWidget: widget,
        });

        if (status === "loading" || status === "pending") {
            return <GaugeLoading />;
        }

        if (status === "error") {
            return <GaugeError message={error?.message ?? "Unknown error"} />;
        }

        // once the data is loaded, convert it to values the Gauge visualization can understand
        const { gaugeResult, gaugeError } = getGaugeValues(result!, insight);

        if (gaugeError || !gaugeResult) {
            return <GaugeError message={gaugeError?.message ?? "Unknown error"} />;
        }

        return (
            <Gauge
                max={gaugeResult.max}
                value={gaugeResult.value}
                format={parameters.format || "%"}
                locale={locale}
                showLabels={parameters.showLabels}
            />
        );
    };

    return GaugeInsight;
};

export const Gauge: React.FC<{
    max: number;
    value: number;
    format?: "%" | "#";
    showLabels?: boolean;
    locale?: string;
}> = ({ max, value, format = "#", showLabels = false, locale = "en-US" }) => {
    const percent = value / max;

    return (
        <div style={{ padding: "1rem" }}>
            <GaugeChart
                animate={false}
                nrOfLevels={20}
                percent={percent}
                textColor="black"
                colors={["#42c1e7", "#14B2E2", "#108eb4"]}
                formatTextValue={() =>
                    format === "#"
                        ? new Intl.NumberFormat(locale).format(value)
                        : new Intl.NumberFormat(locale, {
                              style: "percent",
                          }).format(percent)
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

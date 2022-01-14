// (C) 2022 GoodData Corporation
import { CustomDashboardInsightComponent } from "@gooddata/sdk-ui-dashboard";
import React from "react";
import {useInsightWidgetDataView} from "./utils/useInsightWidgetDataView";

export const GaugeAdapter: CustomDashboardInsightComponent = (props) => {
    // TODO get the data for props.insight
    const {
        ErrorComponent: GaugeError,
        LoadingComponent: GaugeLoading,
        widget
    } = props;

    const {result, error, status} = useInsightWidgetDataView({
        insightWidget: widget
    });

    if((status === "loading" || status === "pending") && GaugeLoading) {
        return <GaugeLoading />
    }
    if(error && GaugeError) {
        return <GaugeError message={error.message}/>
    }

    console.log("result", result);
    if(result) {
        const [min, max, value] = result.data().series().toArray()[0].dataPoints();

        return <Gauge min={min.rawValue()} max={max} value={value} />
    }
    return <GaugeError message={"Result is empty"}/>
};

export const Gauge: React.FC<{
    min: number;
    max: number;
    value: number;
}> = () => {
    return <div>GAUGE</div>
};

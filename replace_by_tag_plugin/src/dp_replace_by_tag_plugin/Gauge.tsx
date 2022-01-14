// (C) 2022 GoodData Corporation
import { CustomDashboardInsightComponent } from "@gooddata/sdk-ui-dashboard";
import React from "react";

export const GaugeAdapter: CustomDashboardInsightComponent = (_props) => {
    // TODO get the data for props.insight
    return <Gauge min={0} max={100} value={80} />
};

export const Gauge: React.FC<{
    min: number;
    max: number;
    value: number;
}> = () => {
    return <div>GAUGE</div>
};

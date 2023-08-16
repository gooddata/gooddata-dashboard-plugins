// (C) 2022-2023 GoodData Corporation
import React from "react";
import { IDashboardInsightProps } from "@gooddata/sdk-ui-dashboard";

export const UngroupedWidget: React.FC<
    IDashboardInsightProps & { Component: React.ComponentType<IDashboardInsightProps> }
> = (props) => {
    const { Component, ...restProps } = props;
    return <Component {...restProps} />;
};

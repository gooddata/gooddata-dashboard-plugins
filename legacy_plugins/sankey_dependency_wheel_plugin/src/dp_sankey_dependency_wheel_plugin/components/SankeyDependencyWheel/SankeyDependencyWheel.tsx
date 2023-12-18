// (C) 2023 GoodData Corporation

import React, { useMemo } from "react";
import { IDashboardInsightProps } from "@gooddata/sdk-ui-dashboard";

import ErrorBoundary from "../ErrorBoundary/ErrorBoundary.js";
import { useWidgetTitle } from "../../hooks/useWidgetTitle.js";

import { SankeyDependencyWheelRenderer } from "./SankeyDependencyWheelRenderer.js";

import "./style.css";

const SankeyDependencyWheel: React.FC<IDashboardInsightProps> = ({
    LoadingComponent,
    ErrorComponent,
    widget,
}) => {
    const { WidgetTitle, getWidgetTitleProps } = useWidgetTitle(widget);

    const GeneralError = useMemo(
        () => <ErrorComponent message="Unable to display the report" />,
        [ErrorComponent],
    );

    return (
        <ErrorBoundary fallback={GeneralError}>
            <WidgetTitle {...getWidgetTitleProps()} />
            {/*{customWidgetTitleComponent}*/}
            <div className={"sankey-dependency-wheel-wrapper"}>
                <SankeyDependencyWheelRenderer
                    widget={widget}
                    ErrorComponent={ErrorComponent}
                    LoadingComponent={LoadingComponent}
                />
            </div>
        </ErrorBoundary>
    );
};

export default SankeyDependencyWheel;

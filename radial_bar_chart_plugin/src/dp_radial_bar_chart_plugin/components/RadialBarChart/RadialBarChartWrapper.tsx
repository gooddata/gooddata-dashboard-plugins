// (C) 2023-2024 GoodData Corporation

import React, { useMemo, useRef } from "react";
import { IDashboardInsightProps, selectIsInViewMode, useDashboardSelector } from "@gooddata/sdk-ui-dashboard";

import "./style.css";
import { RadialBarChart } from "./RadialBarChart.js";
import { CustomTitle } from "./CustomTitle.js";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary.js";
import { useHideOriginalWidgetTitleInViewMode } from "../useHideOriginalWidgetTitleInViewMode.js";
import { WIDGET_TITLE_SUFFIX } from "../../Plugin.js";

const RadialBarChartWrapper: React.FC<IDashboardInsightProps> = (props) => {
    const { LoadingComponent, ErrorComponent, widget } = props;

    const wrapperRef = useRef<HTMLDivElement>(null);

    const isInViewMode = useDashboardSelector(selectIsInViewMode);

    const GeneralError = useMemo(
        () => <ErrorComponent message="Unable to display the report" />,
        [ErrorComponent],
    );

    // replace original widget title with a new one without the suffix
    useHideOriginalWidgetTitleInViewMode(widget, isInViewMode);
    const customWidgetTitleComponent = useMemo(() => {
        const titleWithoutSuffix = widget.title.replace(WIDGET_TITLE_SUFFIX, "");

        return isInViewMode ? <CustomTitle>{titleWithoutSuffix}</CustomTitle> : null;
    }, [widget.title, isInViewMode]);

    return (
        <ErrorBoundary ErrorComponent={GeneralError}>
            {customWidgetTitleComponent}
            <div ref={wrapperRef} className={"radial-bar-wrapper"}>
                <RadialBarChart
                    wrapperHeight={wrapperRef.current?.offsetHeight}
                    widget={widget}
                    ErrorComponent={ErrorComponent}
                    LoadingComponent={LoadingComponent}
                />
            </div>
        </ErrorBoundary>
    );
};

export default RadialBarChartWrapper;

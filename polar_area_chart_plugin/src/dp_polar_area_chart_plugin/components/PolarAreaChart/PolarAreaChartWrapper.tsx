// (C) 2023-2024 GoodData Corporation

import React, { useMemo } from "react";
import { useDashboardSelector, IDashboardInsightProps, selectIsInViewMode } from "@gooddata/sdk-ui-dashboard";

import { useHideOriginalWidgetTitleInViewMode } from "../useHideOriginalWidgetTitleInViewMode.js";
import { CustomTitle } from "./CustomTitle.js";
import { WIDGET_TITLE_SUFFIX } from "../../Plugin.js";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary.js";
import { PolarAreaChart } from "./PolarAreaChart.js";

import "./styles.css";

const PolarAreaChartWrapper: React.FC<IDashboardInsightProps> = (props) => {
    const { LoadingComponent, ErrorComponent, widget } = props;
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
            <div className={"polar-area-wrapper"}>
                <PolarAreaChart
                    widget={widget}
                    ErrorComponent={ErrorComponent}
                    LoadingComponent={LoadingComponent}
                />
            </div>
        </ErrorBoundary>
    );
};

export default PolarAreaChartWrapper;

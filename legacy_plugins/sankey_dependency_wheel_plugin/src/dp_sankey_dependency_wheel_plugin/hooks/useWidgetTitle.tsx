import { IInsightWidget } from "@gooddata/sdk-model";
import { Fragment, useCallback } from "react";
import { selectIsInViewMode, useDashboardSelector } from "@gooddata/sdk-ui-dashboard";

import { WIDGET_TITLE_SUFFIX } from "../Plugin.js";
import { CustomTitle } from "../components/SankeyDependencyWheel/CustomTitle.js";

import { useHideOriginalWidgetTitleInViewMode } from "./useHideOriginalWidgetTitleInViewMode.js";

/**
 * Hides original widget title and returns custom widget title component,
 * alongside with props. Just for the sake of keeping this logic in one place.
 * @param widget - insight widget
 */
export const useWidgetTitle = (widget: IInsightWidget) => {
    const isInViewMode = useDashboardSelector(selectIsInViewMode);

    // Perform hide widget title effect before attaching the new title
    useHideOriginalWidgetTitleInViewMode(widget, isInViewMode);

    const getWidgetTitleProps = useCallback(() => {
        if (!isInViewMode) return null;

        return {
            children: widget.title.replace(WIDGET_TITLE_SUFFIX, ""),
        };
    }, [isInViewMode, widget.title]);

    return {
        WidgetTitle: isInViewMode ? CustomTitle : Fragment,
        getWidgetTitleProps,
    };
};

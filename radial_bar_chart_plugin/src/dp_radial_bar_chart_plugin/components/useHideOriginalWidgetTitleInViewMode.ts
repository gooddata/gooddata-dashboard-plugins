// (C) 2023-2024 GoodData Corporation
import { IInsightWidget } from "@gooddata/sdk-model";
import { changeInsightWidgetVisConfiguration, useDispatchDashboardCommand } from "@gooddata/sdk-ui-dashboard";
import { useEffect } from "react";

/***
 * This hook is used to hide the original widget title in view mode.
 * @param widget - insight widget
 * @param isInViewMode - is widget in view mode
 */
export const useHideOriginalWidgetTitleInViewMode = (widget: IInsightWidget, isInViewMode: boolean) => {
    const changeWidgetConfigCommand = useDispatchDashboardCommand(changeInsightWidgetVisConfiguration);

    useEffect(() => {
        if (!widget.configuration?.hideTitle) {
            changeWidgetConfigCommand(widget, { hideTitle: isInViewMode });
        }
    }, [changeWidgetConfigCommand, widget, isInViewMode]);
};

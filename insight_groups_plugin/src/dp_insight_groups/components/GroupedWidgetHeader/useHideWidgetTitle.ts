// (C) 2024 GoodData Corporation
import { IInsightWidget } from "@gooddata/sdk-model";
import { changeInsightWidgetVisConfiguration, useDispatchDashboardCommand } from "@gooddata/sdk-ui-dashboard";
import { useEffect } from "react";

/**
 * This hook is used to hide widget title
 * @param widget
 */
export const useHideWidgetTitle = (widget: IInsightWidget) => {
    const changeWidgetConfigCommand = useDispatchDashboardCommand(changeInsightWidgetVisConfiguration);

    useEffect(() => {
        if (!widget.configuration?.hideTitle) {
            changeWidgetConfigCommand(widget, { hideTitle: true });
        }
    }, [changeWidgetConfigCommand, widget]);
};

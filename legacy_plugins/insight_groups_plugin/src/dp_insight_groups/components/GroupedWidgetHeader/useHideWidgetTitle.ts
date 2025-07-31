// (C) 2023 GoodData Corporation
import { IInsightWidget } from "@gooddata/sdk-model";
import { changeInsightWidgetVisConfiguration, useDispatchDashboardCommand } from "@gooddata/sdk-ui-dashboard";
import { useEffect } from "react";

export const useHideWidgetTitle = (widget: IInsightWidget) => {
    const changeWidgetConfigCommand = useDispatchDashboardCommand(changeInsightWidgetVisConfiguration);

    useEffect(() => {
        if (!widget.configuration?.hideTitle) {
            changeWidgetConfigCommand(widget, { hideTitle: true });
        }
    }, [changeWidgetConfigCommand, widget]);
};

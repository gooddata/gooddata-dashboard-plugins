// (C) 2022-2023 GoodData Corporation
import React, { useState } from "react";
import { IDashboardInsightProps } from "@gooddata/sdk-ui-dashboard";

import { GroupedWidgetHeader, ICustomHeaderProps } from "../GroupedWidgetHeader/GroupedWidgetHeader";

export const GroupedWidget: React.FC<
    IDashboardInsightProps & {
        Component: React.ComponentType<IDashboardInsightProps>;
        hidden: boolean;
        groupInsightsIdentifiers: string[];
        widgetTitles: ICustomHeaderProps["widgetTitles"];
        hidingHooks: { [key: string]: (state: boolean) => void };
        onGroupInsightSelected: (identifier: string) => void;
    }
> = (props) => {
    const {
        Component,
        hidden,
        groupInsightsIdentifiers,
        widgetTitles,
        hidingHooks,
        onGroupInsightSelected,
        ...restProps
    } = props;
    const { insight } = restProps;

    const [isHidden, setIsHidden] = useState(hidden);
    hidingHooks[insight.insight.identifier] = setIsHidden;

    return (
        <>
            <GroupedWidgetHeader
                hideColumn={isHidden}
                selectedIdentifier={insight.insight.identifier}
                groupInsightsIdentifiers={groupInsightsIdentifiers}
                widgetTitles={widgetTitles}
                onGroupInsightSelected={onGroupInsightSelected}
            />
            <Component {...restProps} />
        </>
    );
};
